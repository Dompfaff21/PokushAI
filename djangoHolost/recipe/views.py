from django.shortcuts import render, redirect
from .models import Posts

def posts(request):
    post = Posts.objects.all
    content = {
        'form': post
    }
    return render(request, 'posts.html', content)

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
        return redirect('posts')

    return render(request, 'new_post.html')