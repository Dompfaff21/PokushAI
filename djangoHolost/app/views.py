from django.shortcuts import render, redirect
from django.contrib import messages
from .utils import predict_recipe, get_recipe_data, unique_ingredients

def app(request):
    """Страница выбора ингредиентов и отправки запроса на рецепт."""
    if request.method == 'POST':
        switch_result = request.POST.getlist('ingredients')
        if switch_result:
            switch_result = [ingredient.strip().lower() for ingredient in switch_result]
            all_ingredients = {ingredient: idx for idx, ingredient in enumerate(unique_ingredients)}
            predicted_dishes = predict_recipe(switch_result, all_ingredients)

            if not predicted_dishes:
                messages.error(request, 'Ничего не найдено.')
            else:
                request.session['predicted_dishes'] = predicted_dishes
                return redirect('recipe_result')
        else:
            messages.error(request, "Пожалуйста, выберите хотя бы один ингредиент.")

    return render(request, 'app.html', {'ingredients': unique_ingredients})


def recipe_result(request):
    """Страница отображения результата рецепта."""
    dishes = request.session.get('predicted_dishes')
    if not dishes:
        return redirect('app')

    recipes = {dish: get_recipe_data(dish) for dish in dishes}
    return render(request, 'recipe.html', {'recipes': recipes})


def recipe_detail(request, dish):
    """Страница с подробностями выбранного рецепта."""
    recipe_data = get_recipe_data(dish)
    if not recipe_data:
        return redirect('recipe_result')

    ingredients = sorted(recipe_data.get('ingredients', []))
    steps = recipe_data.get('details', [])

    structured_steps = [{'title': f"Шаг {i + 1}", 'text': step} for i, step in enumerate(steps)]
    return render(request, 'recipe_detail.html', {
        'dish': dish,
        'ingredients': ingredients,
        'steps': structured_steps,
    })
