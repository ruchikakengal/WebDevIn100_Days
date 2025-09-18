const searchButton = document.getElementById("search-recipe");
const foodInput = document.getElementById("recipe-input");

const recipeDisplay = document.getElementById("recipe-display");
const recipeName = document.getElementById("recipe-name");
const recipeImage = document.getElementById("recipe-img");
const ingredientsDiv = document.getElementById("ingredients");
const instructionsDiv = document.getElementById("recipe");

searchButton.addEventListener("click", () => {
  const foodName = foodInput.value.trim();
  if (foodName === "") {
    alert("Please enter a recipe name.");
    return;
  }
  fetchRecipe(foodName);
});

async function fetchRecipe(foodName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;

  try {
    const res = await axios.get(url);
    const meals = res.data.meals;

    if (!meals) {
      recipeDisplay.classList.add("hidden");
      alert("No recipe found with that name.");
      return;
    }

    const recipe = meals[0];
    
    recipeName.innerText = recipe.strMeal;
    recipeImage.src = recipe.strMealThumb;

    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredientList += `• ${ingredient} - ${measure}<br>`;
      }
    }
    ingredientsDiv.innerHTML = `<h3>Ingredients:</h3>${ingredientList}`;
    instructionsDiv.innerHTML = `<h3>Instructions:</h3><p>${recipe.strInstructions}</p>`;

    recipeDisplay.classList.remove("hidden");

  } catch (error) {
    console.error(error);
    alert("Something went wrong while fetching the recipe.");
  }
}
