from django.shortcuts import render, redirect
from .models import Ingredient
from .utils import predict_recipe, get_recipe_details

def app(request):
    """Страница выбора ингредиентов и отправки запроса на рецепт."""
    ingredients = Ingredient.objects.values_list('Ingredients', flat=True).distinct().order_by('Ingredients')
    error_message = None

    if request.method == 'POST':
        try:
            switch_result = request.POST.getlist('ingredients')

            if switch_result:
                switch_result = [ingredient.strip().lower() for ingredient in switch_result]
                all_ingredients = {ingredient.strip().lower(): idx for idx, ingredient in enumerate(ingredients)}
                predicted_dishes = predict_recipe(switch_result, all_ingredients)
                print(f"Словарь ингредиентов: {all_ingredients}")

                if not predicted_dishes:
                    error_message = 'Ничего не найдено'
                else:
                    dishes_details = {}
                    for dish in predicted_dishes:
                        details = get_recipe_details(dish)
                        dishes_details[dish] = details

                    request.session['predicted_dishes'] = dishes_details
                    return redirect('recipe_result')
            else:
                error_message = "Пожалуйста, выберите хотя бы один ингредиент."
        except Exception as e:
            print(f"Ошибка: {str(e)}")
            error_message = 'Произошла ошибка на сервере'

    return render(request, 'app.html', {'ingredients': ingredients, 'error_message': error_message})


def recipe_result(request):
    """Страница отображения результата рецепта."""

    dishes = request.session.get('predicted_dishes')

    if not dishes:
        return redirect('app')

    return render(request, 'recipe.html', {'dishes': dishes})