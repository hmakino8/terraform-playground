from django.contrib import admin
from django.urls import path, include
from deicafe_app import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='products')

urlpatterns = [
  # Django Admin
  path('admin/', admin.site.urls),

  # Auth
  path('api/signup/', views.signup_api, name='signup_api'),
  path('api/login/', views.login_api, name='login_api'),
  path('api/logout/', views.logout_api, name='logout_api'),
  path('api/user/', views.get_user_info, name='get_user_info'),
  
  # Security
  path('api/get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),

  # API
  path('api/', include(router.urls)),
  
  path('api/cart/add/', views.add_to_cart, name='add_to_cart'),
  path('api/cart/', views.get_cart_items, name='get_cart_items'),
  path('api/cart/clear/', views.clear_cart, name='clear_cart'),
  path('api/cart/<int:cart_id>/delete/', views.delete_cart_item, name='delete_cart_item'),
  path('api/reservations/create/', views.add_to_reservation, name='add_to_reservation'),
  path('api/reservations/', views.get_reservation_items, name='get_reservation_items'),
]
