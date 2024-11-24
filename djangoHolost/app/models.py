from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    Ingredients = models.CharField(max_length=100, blank=True, null=True)
    Details = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name