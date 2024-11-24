import numpy as np
import tensorflow as tf
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, 'main', 'static', 'app', 'model.tflite')
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print("Входные данные:", input_details)
print("Выходные данные:", output_details)

csv_path = os.path.join(BASE_DIR, 'main', 'static', 'app', 'recipes2.csv')
recipes = pd.read_csv(csv_path)


unique_ingredients = sorted(list(set(recipes["Ingredients"])))

unique_recipes = sorted(list(set(recipes["Recipe"])))

def preprocess_input(switch_result, all_ingredients):
    """Предобработка входных данных для модели TFLite."""
    print(f"Ингредиенты для обработки: {switch_result}")
    
    ingredient_indices = [all_ingredients.get(ingredient.strip().lower(), -1) for ingredient in switch_result]
    print(f"Индексы ингредиентов: {ingredient_indices}")
    
    input_data = np.zeros(len(all_ingredients))
    for idx in ingredient_indices:
        if idx != -1:
            input_data[idx] = 1
    
    if input_data.size > 96:
        input_data = input_data[:96]
    elif input_data.size < 96:
        input_data = np.pad(input_data, (0, 96 - input_data.size), 'constant')
    
    return np.reshape(input_data, (1, 96)).astype(np.float32)

def predict_recipe(switch_result, all_ingredients):
    """Генерация предсказания на основе входных данных для TFLite."""

    input_data = preprocess_input(switch_result, all_ingredients)
    print(f"Входные данные для модели: {input_data}")

    if np.all(input_data == 0):
        print("Ошибка: Нет выбранных ингредиентов")
        return None
    

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()


    output_data = interpreter.get_tensor(output_details[0]['index'])
    print(f"Выходные данные: {output_data}")


    predicted_index = np.argmax(output_data)
    print(f"Предсказанный индекс: {predicted_index}")
    

    return unique_recipes[predicted_index]

def get_recipe_details(dish_name):
    """Получение подробной информации о рецепте."""
    print(f"Ищем рецепт для: {dish_name}")
    details = recipes[recipes["Recipe"] == dish_name]["Details"].values
    return details[0] if len(details) > 0 else "Детали не найдены"