import csv
from django.core.management.base import BaseCommand
from app.models import Ingredient

class Command(BaseCommand):
    help = 'Load ingredients with additional details from recipe2.csv into the database'

    def handle(self, *args, **kwargs):
        file_path = 'C:/Users/Admin/Desktop/PokushAI/djangoHolost/main/static/app/recipes2.csv'  # Укажите путь к вашему файлу
        
        try:
            with open(file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                current_recipe = None
                details = ""
                
                for row in reader:
                    
                    if current_recipe != row['Recipe']:
                        current_recipe = row['Recipe']
                        details = row['Details']
                        
                    Ingredient.objects.get_or_create(
                        name=row['Recipe'],
                        Ingredients=row['Ingredients'],
                        Details=details,
                    )

            self.stdout.write(self.style.SUCCESS(f'Ingredients loaded successfully from {file_path}.'))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File {file_path} not found.'))