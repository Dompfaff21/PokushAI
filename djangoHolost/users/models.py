from django.db import models

# Create your models here.
class Users(models.Model):
    name = models.CharField('Имя', max_length=50)
    family = models.CharField('Фамилия', max_length=50)
    email = models.CharField('E-mail', max_length=256)
    number = models.CharField('Номер телефона', max_length=11)
