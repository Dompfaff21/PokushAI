// APP

function addChosenIngredient(ingredient) {
    const container = document.getElementById('chosenIngredients');
    if (!document.querySelector(`.ingredient-tag[data-ingredient="${ingredient}"]`)) {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        tag.dataset.ingredient = ingredient;
        tag.innerHTML = `${ingredient} <span class="remove-tag">&times;</span>`;
        container.appendChild(tag);
        
        tag.querySelector('.remove-tag').addEventListener('click', function() {
            removeChosenIngredient(ingredient);
        });
    }
}

function removeChosenIngredient(ingredient) {
    const tag = document.querySelector(`.ingredient-tag[data-ingredient="${ingredient}"]`);
    if (tag) tag.remove();
    
    const label = document.querySelector(`label[data-ingredient="${ingredient}"]`);
    if (label) {
        const checkbox = label.querySelector('input[type="checkbox"]');
        checkbox.checked = false;
        label.classList.remove('selected');
    }
}

function toggleIngredientSelection(label) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    const ingredient = label.dataset.ingredient;
    
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        label.classList.add('selected');
        addChosenIngredient(ingredient);
    } else {
        label.classList.remove('selected');
        removeChosenIngredient(ingredient);
    }
}

function addIngredient(ingredient) {
    const label = document.querySelector(`label[data-ingredient="${ingredient}"]`);
    if (label) {
        toggleIngredientSelection(label);
    }
}

function filterIngredients() {
    const query = document.getElementById("ingredientSearch").value.toLowerCase();
    const suggestions = document.getElementById("suggestionsList");
    const clearSearch = document.getElementById("clearSearch");
    
    suggestions.innerHTML = '';
    clearSearch.style.display = query.length > 0 ? 'block' : 'none';

    if (query.length > 0) {
        const filtered = ingredients.filter(item => 
            item.name.toLowerCase().includes(query) &&
            !document.querySelector(`.ingredient-tag[data-ingredient="${item.name}"]`)
        );
        
        if (filtered.length > 0) {
            suggestions.style.display = 'block';
            filtered.forEach(item => {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.textContent = item.name;
                suggestionDiv.onclick = () => addIngredient(item.name);
                suggestions.appendChild(suggestionDiv);
            });
        } else {
            suggestions.style.display = 'none';
        }
    } else {
        suggestions.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scrollable-list label').forEach(label => {
        label.addEventListener('click', () => toggleIngredientSelection(label));
    });

    document.getElementById('clearSearch').addEventListener('click', function() {
        document.getElementById('ingredientSearch').value = '';
        this.style.display = 'none';
        document.getElementById('suggestionsList').style.display = 'none';
        filterIngredients();
    });
});