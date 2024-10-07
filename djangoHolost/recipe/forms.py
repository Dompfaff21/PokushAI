from django import forms
from django.forms import inlineformset_factory

from .models import Posts, Steps


class RecipeForm(forms.ModelForm):
    class Meta:
        model = Posts
        fields = ['title', 'description', 'post_image']

StepFormSet = inlineformset_factory(Posts, Steps, fields=['step_des', 'step_image'], extra=0, can_delete=True)