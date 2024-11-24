from django.shortcuts import render
from .models import Ingredient
from .utils import predict_recipe, get_recipe_details

from django.shortcuts import render
from .models import Ingredient

def app(request):
    """Страница выбора ингредиентов и отображения рецептов."""

    ingredients = Ingredient.objects.values_list('Ingredients', flat=True).distinct().order_by('Ingredients')
    
    recipe = None
    error_message = None

    if request.method == 'POST':
        try:
            switch_result = request.POST.getlist('ingredients')
            print(f"Полученные ингредиенты: {switch_result}")

            if switch_result:
            
                switch_result = [ingredient.strip().lower() for ingredient in switch_result]
                print(f"После нормализации: {switch_result}")


                all_ingredients = {ingredient.strip().lower(): idx for idx, ingredient in enumerate(ingredients)}
                print(f"Словарь ингредиентов: {all_ingredients}")

                predicted_dish = predict_recipe(switch_result, all_ingredients)
                if not predicted_dish:
                    error_message = 'Ничего не найдено'
                else:
                    recipe = {
                        'dish': predicted_dish,
                        'details': get_recipe_details(predicted_dish)
                    }
            else:
                error_message = "Пожалуйста, выберите хотя бы один ингредиент."

        except Exception as e:

            print(f"Ошибка: {str(e)}")
            error_message = 'Произошла ошибка на сервере'


    return render(request, 'app.html', {'ingredients': ingredients, 'recipe': recipe, 'error_message': error_message})