from django.shortcuts import render, redirect
from .models import Posts
from users.models import Profile
from django.contrib import messages
from PIL import Image

def posts(request):
    post = Posts.objects.all()
    profiles = Profile.objects.all()
    content = {
        'form': post,
        'profiles': profiles
    }
    return render(request, 'posts.html', content)

def new_post(request):
    if request.method == 'POST':
        data = request.POST

        post_image = request.FILES.get('post_image')
        title = data.get('title')
        description = data.get('description')

        if post_image:
            image = Image.open(post_image)
            width, height = image.size
            max_width = 1920
            max_height = 1080

            if width > max_width or height > max_height:
                messages.error(request, f'Размер изображения не должен превышать {max_width}x{max_height} пикселей.')
                return redirect('new_post')

        Posts.objects.create(
            author=request.user,
            post_image=post_image,
            title=title,
            description=description,
        )
        return redirect('posts')

    return render(request, 'new_post.html')