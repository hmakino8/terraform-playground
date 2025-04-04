from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout, authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .serializers import SignupSerializer, ProductSerializer, CartWriteSerializer, CartReadSerializer, ReservationSerializer
from .models import Product, Cart, Reservation
from rest_framework import viewsets


@api_view(['GET'])
def get_csrf_token(request):
  return JsonResponse({'csrfToken': get_token(request)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
  user = request.user
  return Response({
    'username': user.username,
    'email': user.email,
    'role': user.role
  }, status=status.HTTP_200_OK)

@api_view(['POST'])
@csrf_exempt
def signup_api(request):
  if request.method == 'POST':
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
      password = request.data.get('password')
      password_confirm = request.data.get('password_confirm')
      
      if password != password_confirm:
        return Response(
          {'message': 'パスワード不一致'},
          status=status.HTTP_400_BAD_REQUEST
        )

      user = serializer.save()
      user.set_password(password)
      user.save()

      return Response(
        {'message': 'ユーザー登録完了'},
        status=status.HTTP_201_CREATED
      )
    return Response(
      serializer.errors,
      status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
@csrf_exempt
def login_api(request):
  if request.method == 'POST':
    email = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=email, password=password)
    
    if user is not None:
      login(request, user)
      return Response({
        'message': 'ログイン成功',
        'username': user.username,
        'email': user.email,
        'role': user.role
      }, status=status.HTTP_200_OK)
    else:
      return Response({
        'message': '不正なログイン',
      }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@csrf_exempt
def logout_api(request):
  logout(request)
  return Response({'message': 'ログアウト成功'}, status=status.HTTP_200_OK)

class ProductViewSet(viewsets.ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  
  def list(sefl, request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    data = request.data
    try:
        serializer = CartWriteSerializer(data=data)
        product = data.get('product')
        if not product or not product.get('id'):
            return Response({'message': '商品情報が不正です'}, status=status.HTTP_400_BAD_REQUEST)
            
        cart_data = {
            'product': product['id'],
            'name': product['name'],
            'image': product['image'],
            'price_s': product['price_s'],
            'price_m': product['price_m'],
            'price_l': product['price_l'],
            'size': data.get('size'),
            'quantity': data.get('quantity'),
            'user': request.user.id
        }
        
        serializer = CartWriteSerializer(data=cart_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_items(request):
  cart_items = Cart.objects.filter(user=request.user)
  serializer = CartReadSerializer(cart_items, many=True)
  return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
  Cart.objects.filter(user=request.user).delete()
  return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, cart_id):
  try:
    cart_item = Cart.objects.get(id=cart_id, user=request.user)
    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
  except Cart.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_reservation(request):
  try:
    data = request.data.copy()
    data['user'] = request.user.id
    
    cart_items = Cart.objects.filter(id__in=data['cart_items'])
    
    items = []
    for cart_item in cart_items:
      price = getattr(cart_item.product, f'price_{cart_item.size.lower()}')
      items.append({
        'product_name': cart_item.product.name,
        'size': cart_item.size,
        'quantity': cart_item.quantity,
        'price': str(price)  # DecimalFieldはJSONに直接保存できないため文字列に変換
      })
    
    # 予約データを作成
    data['items'] = items
    
    serializer = ReservationSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      # カートを削除
      cart_items.delete()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  except Exception as e:
    return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reservation_items(request):
  reservation_items = Reservation.objects.all()
  serializer = ReservationSerializer(reservation_items, many=True)
  return Response(serializer.data)