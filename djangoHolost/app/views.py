import re
from django.shortcuts import render, redirect
from .models import Ingredient
from django.contrib import messages
from .utils import predict_recipe, get_recipe_details

def app(request):
    """Страница выбора ингредиентов и отправки запроса на рецепт."""
    ingredients = Ingredient.objects.values_list('Ingredients', flat=True).distinct().order_by('Ingredients')

    if request.method == 'POST':
        try:
            switch_result = request.POST.getlist('ingredients')

            if switch_result:
                switch_result = [ingredient.strip().lower() for ingredient in switch_result]
                all_ingredients = {ingredient.strip().lower(): idx for idx, ingredient in enumerate(ingredients)}
                predicted_dishes = predict_recipe(switch_result, all_ingredients)
                print(f"Словарь ингредиентов: {all_ingredients}")

                if not predicted_dishes:
                    messages.error(request, 'Ничего не найдено.')
                    return redirect('app')
                else:
                    dishes_details = {}
                    for dish in predicted_dishes:
                        details = get_recipe_details(dish)
                        dishes_details[dish] = details

                    request.session['predicted_dishes'] = dishes_details
                    return redirect('recipe_result')
            else:
                messages.error(request, "Пожалуйста, выберите хотя бы один ингредиент.")
                return redirect('app')
        except Exception as e:
            print(f"Ошибка: {str(e)}")
            messages.error(request, 'Произошла ошибка на сервере. Повторите попытку позже.')
            return redirect('app')

    return render(request, 'app.html', {'ingredients': ingredients})


def recipe_result(request):
    """Страница отображения результата рецепта."""

    dishes = request.session.get('predicted_dishes')

    if not dishes:
        return redirect('app')

    return render(request, 'recipe.html', {'dishes': dishes})

def recipe_detail(request, dish):
    """Страница с подробностями выбранного рецепта."""
    details = get_recipe_details(dish)

    if not details:
        return redirect('recipe_result')

    steps = re.split(r'(Шаг \d+)', details)  # Разделяем по шаблону "Шаг X"

    # Теперь мы очистим разделители "Шаг X", чтобы оставались только шаги
    steps = [step.strip() for step in steps if step.strip()]

    structured_steps = []
    for i in range(0, len(steps), 2):  # Пропускаем каждый второй элемент, так как это шаг
        step_title = steps[i]  # Это будет заголовок "Шаг X"
        step_text = steps[i + 1] if i + 1 < len(steps) else "" # Текст шага (может быть пустым)
        structured_steps.append({'title': step_title, 'text': step_text})

    return render(request, 'recipe_detail.html', {'dish': dish, 'steps': structured_steps})