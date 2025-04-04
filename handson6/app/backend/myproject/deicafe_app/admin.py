from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Product, CustomUser, Reservation


class CustomUserAdmin(UserAdmin):
  model = CustomUser
  list_display = ('username', 'email', 'role')
  fieldsets = UserAdmin.fieldsets + (
    (None, {'fields': ('role',)}),
  )
  add_fieldsets = UserAdmin.add_fieldsets + (
    (None, {'fields': ('role',)}),
  )

class ProductAdmin(admin.ModelAdmin):
  readonly_fields = ('price_s', 'price_l')
  list_display = ('name', 'price_s', 'price_m', 'price_l', 'image', 'category')
  search_fields = ('name',)

class ReservationAdmin(admin.ModelAdmin):
  list_display = ('user', 'reservation_date', 'reservation_time_start', 'reservation_time_end', 'seat', 'is_takein', 'is_pre_order')
  search_fields = ('user',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Reservation, ReservationAdmin)
