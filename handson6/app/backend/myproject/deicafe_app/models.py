from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
  email = models.EmailField(unique=True)
  role = models.CharField(max_length=20, default='user')
  password_confirm = models.CharField(max_length=20, default='')
  
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']

    
class Product(models.Model):
  name = models.CharField(
    max_length=100,
    default=''
  )

  image = models.CharField(
    max_length=100,
    default=''
  )

  price_s = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0,
    verbose_name='Small size price'
  )

  price_m = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0,
    verbose_name='Medium size price'
  )

  price_l = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0,
    verbose_name='Large size price'
  )

  category = models.CharField(
    max_length=100,
    default='その他'
  )
  
  def save(self, *args, **kwargs):
    self.price_s = self.price_m - 30
    self.price_l = self.price_m + 30
    super().save(*args, **kwargs)
  
  def __str__(self):
    return self.name

class Cart(models.Model):
  SIZE_CHOICES = [
    ('S', 'Small'),
    ('M', 'Medium'),
    ('L', 'Large'),
  ]
  user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  size = models.CharField(max_length=10, choices=SIZE_CHOICES)
  quantity = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Reservation(models.Model):
  user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
  is_takein = models.BooleanField(default=False)
  is_pre_order = models.BooleanField(default=False)
  reservation_date = models.DateField()
  reservation_time_start = models.TimeField()
  reservation_time_end = models.TimeField()
  seat = models.IntegerField()
  items = models.JSONField(default=list)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)