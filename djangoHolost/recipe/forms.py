from django import forms
from .models import Posts, Steps
from django.forms import inlineformset_factory

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Posts
        fields = ['title', 'description', 'post_image']

StepFormSet = inlineformset_factory(Posts, Steps, fields=['step_des', 'step_image'], extra=1, can_delete=True)