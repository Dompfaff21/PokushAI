from django.db import models
from django.contrib.auth.models import User

class Posts(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField('Заголовок', max_length=160)
    description = models.TextField('Описание', max_length=1000)
    post_image = models.ImageField('Фото к рецепту', null=True, blank=True, upload_to='recipe_pics')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    update_at = models.DateTimeField('Дата последнего обновления', auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
