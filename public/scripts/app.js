const addIngredientsBtn = document.getElementById('add-ingredients')
const addInstructionsBtn = document.getElementById('add-instructions')
const recipeForm = document.querySelector('.create-recipe-form')

if (addIngredientsBtn) {
    addIngredientsBtn.addEventListener('click', function() {
        const ingredientRow = document.querySelector('.ingredient-row');

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.name = 'ingredients';
        newInput.className = 'ingredient-row';
        newInput.placeholder = 'Add new ingredient'

        const deleteInput = document.createElement('button');
        deleteInput.type = 'button';
        deleteInput.className = 'delete-btn';
        deleteInput.textContent = '❌';
        deleteBtn(deleteInput)
        inputContainer.appendChild(newInput);
        inputContainer.appendChild(deleteInput)


        ingredientRow.appendChild(inputContainer);
    })
}

if (addInstructionsBtn) {
    addInstructionsBtn.addEventListener('click', function() {
        const instructionRow = document.querySelector('.instruction-content');

        const inputContainer = document.createElement('div')
        inputContainer.className = 'input-container';

        const newInput = document.createElement('textarea');
        newInput.name = 'instructions';
        newInput.placeholder = 'Next step...';

        const deleteInput = document.createElement('button');
        deleteInput.type = 'button';
        deleteInput.className = 'delete-btn';
        deleteInput.textContent = '❌';
        deleteBtn(deleteInput)

        inputContainer.appendChild(newInput);
        inputContainer.appendChild(deleteInput)


        instructionRow.appendChild(inputContainer)
    })
}

if (recipeForm) {
    recipeForm.addEventListener('submit', function() {

        const ingredientChecker = recipeForm.querySelectorAll('input[name="ingredients"]');
        ingredientChecker.forEach(inputChecker => {
            if (inputChecker.value.trim() === '') {
                inputChecker.parentElement.remove();
            }
        })
        const instructionChecker = recipeForm.querySelectorAll('textarea[name="instructions"]')
        instructionChecker.forEach(inputChecker => {
            if (inputChecker.value.trim() === '') {
                inputChecker.parentElement.remove()
            }
        })

    })
}

function deleteBtn(btn) {
    btn.addEventListener('click', () => {
      btn.parentElement.remove();
    });
  }
  
  document.querySelectorAll('.delete-btn').forEach(deleteBtn);