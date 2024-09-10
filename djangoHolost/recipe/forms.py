from django import forms
from .models import Posts

class PostsForDisplay(forms.Form):
    class Meta:
        model = Posts
        fields = ('author', 'title', 'description', 'created_at', 'update_at')