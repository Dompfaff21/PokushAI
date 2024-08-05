from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField('Номер телефона', max_length=11,)
    birth_date = models.DateField('Дата рождения')

    def __str__(self):
        return self.phone

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'