from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Posts
from users.models import Profile
from django.contrib import messages
from .forms import RecipeForm, StepFormSet


def posts(request):
    post = Posts.objects.all()
    profiles = Profile.objects.all()
    content = {
        'form': post,
        'profiles': profiles
    }
    return render(request, 'posts.html', content)

@login_required
def new_post(request):
    if request.method == 'POST':
        recipe_form = RecipeForm(request.POST)
        formset = StepFormSet(request.POST)

        if recipe_form.is_valid() and formset.is_valid():
            recipe = recipe_form.save(commit=False)
            recipe.author = request.user
            recipe.save()

            steps = formset.save(commit=False)
            for step in steps:
                step.recipe = recipe
                step.save()

            messages.success(request, 'Рецепт успешно создан!')
            return redirect('posts')  # Перенаправление на список рецептов

    else:
        recipe_form = RecipeForm()
        formset = StepFormSet()

    return render(request, 'new_post.html', {'recipe_form': recipe_form, 'formset': formset})