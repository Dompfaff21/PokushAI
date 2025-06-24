import os
import json
import numpy as np
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, 'main', 'static', 'app', 'model.tflite')
json_path = os.path.join(BASE_DIR, 'main', 'static', 'app', 'recipes2.json')

interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

with open(json_path, 'r', encoding='utf-8') as f:
    recipes_data = json.load(f)

unique_ingredients = sorted(
    {ingredient.strip().lower() for recipe in recipes_data.values() for ingredient in recipe.get('ingredients', [])}
)
unique_recipes = sorted(recipes_data.keys())


def preprocess_input(switch_result, all_ingredients):
    """Предобработка входных данных для модели TFLite."""
    ingredient_indices = [all_ingredients.get(ingredient, -1) for ingredient in switch_result]
    input_data = np.zeros(len(all_ingredients))
    for idx in ingredient_indices:
        if idx != -1:
            input_data[idx] = 1

    input_data = np.pad(input_data, (0, 96 - len(input_data)), 'constant')[:96]
    return np.reshape(input_data, (1, 96)).astype(np.float32)


def predict_recipe(switch_result, all_ingredients):
    """Генерация предсказания на основе входных данных для TFLite."""
    input_data = preprocess_input(switch_result, all_ingredients)
    if np.all(input_data == 0):
        return None

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])
    top_indices = np.argsort(output_data[0])[-3:][::-1]
    return [unique_recipes[i] for i in top_indices]


def get_recipe_data(recipe_name):
    """Получение данных рецепта из JSON."""
    return recipes_data.get(recipe_name, {})