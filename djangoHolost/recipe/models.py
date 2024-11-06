from django.db import models
from django.contrib.auth.models import User

class Posts(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField('Заголовок', max_length=160)
    description = models.TextField('Описание', max_length=1000)
    post_image = models.ImageField('Фото к рецепту', null=True, blank=True, upload_to='recipe_pics')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    update_at = models.DateTimeField('Дата последнего обновления', auto_now=True)
    views = models.PositiveIntegerField(default=0)
    viewed_users = models.ManyToManyField(User, related_name="viewed_posts", blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

class Steps(models.Model):
    recipe = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='steps')
    step_des = models.TextField(max_length=1000)
    step_image = models.ImageField(null=True, blank=True, upload_to='step_pics')

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('user', 'post')