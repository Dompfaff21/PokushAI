from django.shortcuts import render
from django.conf import settings

from recipe.models import Posts, Like
from users.models import Profile
from django.db.models import Count

def error_404_view(request, exception):
    return render(request, '404.html')

def index_page(request):
    top_posts = Posts.objects.annotate(num_likes=Count('likes')).order_by('-num_likes', '-created_at')[:5]
    profiles = Profile.objects.all()
    
    liked_posts = []
    if request.user.is_authenticated:
        liked_posts = Like.objects.filter(user=request.user).values_list('post_id', flat=True)

    content = {
        'top_posts': top_posts,
        'profiles': profiles,
        'liked_posts': liked_posts,
    }
    return render(request, 'index.html', content)