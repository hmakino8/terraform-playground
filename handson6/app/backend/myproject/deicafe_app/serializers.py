from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Cart, Reservation

class SignupSerializer(serializers.ModelSerializer):
  class Meta:
    model = get_user_model()
    fields = '__all__'
    
class ProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'

class CartWriteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Cart
    fields = ['product', 'size', 'quantity', 'user']

class CartReadSerializer(serializers.ModelSerializer):
  product = ProductSerializer()

  class Meta:
    model = Cart
    fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Reservation
    fields = '__all__'
