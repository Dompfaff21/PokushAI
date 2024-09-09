from django.shortcuts import render, redirect
from .models import Posts

def posts(request):
    return render(request, 'posts.html')

def new_post(request):
    if request.method == 'POST':
        data = request.POST

        post_image = request.FILES.get('post_image')
        title = data.get('title')
        description = data.get('description')

        Posts.objects.create(
            author=request.user,
            post_image=post_image,
            title=title,
            description=description,
        )
        return redirect('new_post')

    return render(request, 'new_post.html')