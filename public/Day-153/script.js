// Recipe Data
const recipes = [
    {
        id: 1,
        title: "Classic Margherita Pizza",
        image: "https://pixabay.com/get/g65fde9bb7607faf200454a8c2c8e80b0c2148e2e883b3e505465e3557139d342b600fc751becd408bee01a25796ef84c43437c87a53d4902ebe7d0a3228da288_1280.jpg",
        description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil leaves on a crispy wood-fired crust.",
        cuisine: "italian",
        mealType: "dinner",
        difficulty: "medium",
        cookingTime: "30 mins",
        servings: 4,
        ingredients: [
            "1 pizza dough ball",
            "1/2 cup tomato sauce",
            "8 oz fresh mozzarella cheese",
            "Fresh basil leaves",
            "2 tbsp olive oil",
            "Salt to taste",
            "Black pepper to taste"
        ],
        instructions: [
            "Preheat oven to 500°F (260°C) with pizza stone inside.",
            "Roll out pizza dough on floured surface to 12-inch circle.",
            "Spread tomato sauce evenly, leaving 1-inch border for crust.",
            "Tear mozzarella into chunks and distribute over sauce.",
            "Drizzle with olive oil and season with salt and pepper.",
            "Transfer to hot pizza stone and bake for 10-12 minutes.",
            "Remove from oven and top with fresh basil leaves.",
            "Let cool for 2 minutes, slice and serve immediately."
        ]
    },
    {
        id: 2,
        title: "Chicken Tacos Al Pastor",
        image: "https://pixabay.com/get/ga379fe8e4ed034f8d644e115a4f4100c7083ce3563220799b742bff5d9864bee603b5cc8ea0cadb1e8df57a87515d0b4340942da35bad2faa6bedc735ec8b01c_1280.jpg",
        description: "Flavorful Mexican-style chicken tacos with pineapple, onions, and authentic al pastor spices.",
        cuisine: "mexican",
        mealType: "lunch",
        difficulty: "easy",
        cookingTime: "25 mins",
        servings: 6,
        ingredients: [
            "2 lbs chicken thighs, boneless",
            "1 fresh pineapple, diced",
            "1 large onion, sliced",
            "12 corn tortillas",
            "2 tsp chili powder",
            "1 tsp cumin",
            "1 tsp paprika",
            "2 limes, juiced",
            "Cilantro for garnish",
            "Mexican crema",
            "Salsa verde"
        ],
        instructions: [
            "Season chicken thighs with chili powder, cumin, paprika, and salt.",
            "Heat large skillet over medium-high heat with oil.",
            "Cook chicken thighs for 6-7 minutes per side until golden.",
            "Remove chicken and let rest, then dice into small pieces.",
            "Sauté onions and pineapple in same pan for 5 minutes.",
            "Return diced chicken to pan and mix with pineapple mixture.",
            "Warm tortillas in dry skillet for 30 seconds each side.",
            "Fill tortillas with chicken mixture, top with cilantro and crema."
        ]
    },
    {
        id: 3,
        title: "Beef Teriyaki Stir Fry",
        image: "https://pixabay.com/get/g7c5704268ae52cc51eff9080c25d555cf3fd6639f3f4175a6b9395eee2da9a44ef5d7af96378977c7f6b18391d745d3538080541aad1e38d745d57f71edbc55c_1280.jpg",
        description: "Quick and delicious Asian-inspired beef stir fry with vegetables in a savory teriyaki sauce.",
        cuisine: "asian",
        mealType: "dinner",
        difficulty: "easy",
        cookingTime: "20 mins",
        servings: 4,
        ingredients: [
            "1 lb beef sirloin, sliced thin",
            "2 cups mixed vegetables (broccoli, carrots, snap peas)",
            "3 cloves garlic, minced",
            "1 inch ginger, grated",
            "1/4 cup soy sauce",
            "2 tbsp honey",
            "1 tbsp rice vinegar",
            "1 tsp sesame oil",
            "2 tbsp vegetable oil",
            "1 tbsp cornstarch",
            "Green onions for garnish",
            "Sesame seeds for garnish"
        ],
        instructions: [
            "Mix soy sauce, honey, rice vinegar, and sesame oil for teriyaki sauce.",
            "Toss beef slices with cornstarch and let sit for 5 minutes.",
            "Heat wok or large skillet over high heat with vegetable oil.",
            "Stir-fry beef for 2-3 minutes until browned, remove and set aside.",
            "Add garlic and ginger to pan, stir-fry for 30 seconds.",
            "Add mixed vegetables and stir-fry for 3-4 minutes until crisp-tender.",
            "Return beef to pan, add teriyaki sauce and toss everything together.",
            "Serve immediately over rice, garnished with green onions and sesame seeds."
        ]
    },
    {
        id: 4,
        title: "Classic Caesar Salad",
        image: "https://pixabay.com/get/gab9d753ef8a4f7ef2f4b5c7b07d887d7abbb3f8435a21e26de1fffcf445f51012c00c31cbcb67f1f3b8fa5020050e43cd403f4dd5e89b6fb30c7c28bdb950a5c_1280.jpg",
        description: "Fresh romaine lettuce with homemade Caesar dressing, parmesan cheese, and crispy croutons.",
        cuisine: "american",
        mealType: "lunch",
        difficulty: "easy",
        cookingTime: "15 mins",
        servings: 4,
        ingredients: [
            "2 heads romaine lettuce, chopped",
            "1/2 cup parmesan cheese, grated",
            "2 cups bread cubes for croutons",
            "3 cloves garlic, minced",
            "2 anchovy fillets",
            "1 egg yolk",
            "2 tbsp lemon juice",
            "1 tsp Dijon mustard",
            "1/2 cup olive oil",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C) for croutons.",
            "Toss bread cubes with olive oil and bake for 10-12 minutes until golden.",
            "In a large bowl, mash anchovies and garlic into a paste.",
            "Whisk in egg yolk, lemon juice, and Dijon mustard.",
            "Slowly drizzle in olive oil while whisking to create emulsion.",
            "Add chopped romaine lettuce and toss with dressing.",
            "Top with grated parmesan cheese and warm croutons.",
            "Season with freshly ground black pepper and serve immediately."
        ]
    },
    {
        id: 5,
        title: "Mediterranean Quinoa Bowl",
        image: "https://pixabay.com/get/g703ed35d5fc9e3741e6a696e8771a88ce66bc9f51775375267a2027cc003ff91056525e54e65a65946708f47f04ec01405e2abfbbcb3e8f25c495a97208fc60e_1280.jpg",
        description: "Healthy and colorful quinoa bowl with Mediterranean vegetables, feta cheese, and lemon herb dressing.",
        cuisine: "mediterranean",
        mealType: "lunch",
        difficulty: "easy",
        cookingTime: "25 mins",
        servings: 4,
        ingredients: [
            "1 cup quinoa",
            "2 cups vegetable broth",
            "1 cucumber, diced",
            "2 tomatoes, diced",
            "1/2 red onion, thinly sliced",
            "1 cup Kalamata olives",
            "4 oz feta cheese, crumbled",
            "1/4 cup olive oil",
            "2 tbsp lemon juice",
            "1 tsp dried oregano",
            "Fresh parsley, chopped",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Rinse quinoa under cold water until water runs clear.",
            "Bring vegetable broth to boil, add quinoa and reduce heat.",
            "Simmer covered for 15 minutes until liquid is absorbed.",
            "Remove from heat and let stand 5 minutes, then fluff with fork.",
            "Whisk together olive oil, lemon juice, oregano, salt, and pepper.",
            "In large bowl, combine cooled quinoa with diced vegetables.",
            "Add olives and feta cheese to the bowl.",
            "Drizzle with dressing and toss gently to combine."
        ]
    },
    {
        id: 6,
        title: "Spicy Chicken Curry",
        image: "https://pixabay.com/get/g3e0cb5149417186fc7a1c661ff32aec8a90886bc2a10307eb64482ec3afc633a79ea74041332b893bcf37981d864b9f7826866aa5e7baacdbce043fd543cfeda_1280.jpg",
        description: "Rich and aromatic Indian-style chicken curry with fragrant spices and coconut milk.",
        cuisine: "indian",
        mealType: "dinner",
        difficulty: "medium",
        cookingTime: "45 mins",
        servings: 6,
        ingredients: [
            "2 lbs chicken breast, cubed",
            "1 can coconut milk",
            "2 onions, diced",
            "4 cloves garlic, minced",
            "1 inch ginger, grated",
            "2 tbsp curry powder",
            "1 tsp turmeric",
            "1 tsp cumin",
            "1 tsp coriander",
            "1 can diced tomatoes",
            "2 tbsp vegetable oil",
            "Salt to taste",
            "Fresh cilantro for garnish",
            "Basmati rice for serving"
        ],
        instructions: [
            "Heat oil in large pot over medium heat.",
            "Add onions and cook until softened, about 5 minutes.",
            "Add garlic, ginger, and all spices, cook for 1 minute until fragrant.",
            "Add chicken pieces and cook until browned on all sides.",
            "Stir in diced tomatoes and simmer for 10 minutes.",
            "Add coconut milk and bring to gentle simmer.",
            "Cover and cook for 20-25 minutes until chicken is tender.",
            "Serve over basmati rice and garnish with fresh cilantro."
        ]
    },
    {
        id: 7,
        title: "Chocolate Chip Cookies",
        image: "https://pixabay.com/get/gdad399c9ac469de028cd6709a4bc86765f478422bd65836da27d738c1237abc0306f2ecd1c2f96cbe465b7a1883185b4453d18f1cda7d3c6f4babf0d3a468b03_1280.jpg",
        description: "Classic homemade chocolate chip cookies that are crispy on the edges and chewy in the center.",
        cuisine: "american",
        mealType: "dessert",
        difficulty: "easy",
        cookingTime: "25 mins",
        servings: 24,
        ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 tsp baking soda",
            "1 tsp salt",
            "1 cup butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup brown sugar, packed",
            "2 large eggs",
            "2 tsp vanilla extract",
            "2 cups chocolate chips"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C).",
            "Mix flour, baking soda, and salt in medium bowl.",
            "Beat butter and both sugars until creamy in large bowl.",
            "Beat in eggs one at a time, then vanilla extract.",
            "Gradually blend in flour mixture until just combined.",
            "Stir in chocolate chips.",
            "Drop rounded tablespoons of dough onto ungreased baking sheets.",
            "Bake 9-11 minutes until golden brown, cool on baking sheet 2 minutes."
        ]
    },
    {
        id: 8,
        title: "Breakfast Pancakes",
        image: "https://pixabay.com/get/g68c10d8a392087d64f49e9ec6d9c7fdfaa2491b2673d1d4a0a365e95c1dd9e6e5c49a0870e9f96e233264182f19ff9c94eadb20eae709cf37835f124fddaca9f_1280.jpg",
        description: "Fluffy American-style breakfast pancakes served with maple syrup and fresh berries.",
        cuisine: "american",
        mealType: "breakfast",
        difficulty: "easy",
        cookingTime: "20 mins",
        servings: 4,
        ingredients: [
            "2 cups all-purpose flour",
            "2 tbsp sugar",
            "2 tsp baking powder",
            "1 tsp salt",
            "2 large eggs",
            "1 3/4 cups milk",
            "1/4 cup melted butter",
            "1 tsp vanilla extract",
            "Butter for cooking",
            "Maple syrup for serving",
            "Fresh berries for garnish"
        ],
        instructions: [
            "Mix flour, sugar, baking powder, and salt in large bowl.",
            "Whisk eggs, milk, melted butter, and vanilla in separate bowl.",
            "Pour wet ingredients into dry ingredients and stir until just combined.",
            "Don't overmix - lumps are okay.",
            "Heat griddle or large skillet over medium heat.",
            "Butter the pan and pour 1/4 cup batter for each pancake.",
            "Cook until bubbles form and edges set, flip and cook until golden.",
            "Serve immediately with maple syrup and fresh berries."
        ]
    },
    {
        id: 9,
        title: "Greek Moussaka",
        image: "https://pixabay.com/get/gf7dcde3a166cebe6b6b0b5d761370b3cf790df5cc836de25e0d59d19aef6e961928f0590cfeb06181e33517d3f10523a2ade9c9907c08de3685d789dbd08f51e_1280.jpg",
        description: "Traditional Greek layered casserole with eggplant, meat sauce, and creamy béchamel topping.",
        cuisine: "mediterranean",
        mealType: "dinner",
        difficulty: "hard",
        cookingTime: "90 mins",
        servings: 8,
        ingredients: [
            "3 large eggplants, sliced",
            "1 lb ground lamb",
            "1 onion, diced",
            "3 cloves garlic, minced",
            "1 can crushed tomatoes",
            "1/2 cup red wine",
            "1 tsp cinnamon",
            "1/2 cup butter",
            "1/2 cup flour",
            "2 cups milk",
            "1/2 cup parmesan cheese",
            "2 egg yolks",
            "Olive oil for frying",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Salt eggplant slices and let drain for 30 minutes, then pat dry.",
            "Fry eggplant slices in olive oil until golden, set aside.",
            "Cook ground lamb with onion and garlic until browned.",
            "Add tomatoes, wine, cinnamon, salt, and pepper, simmer 20 minutes.",
            "Make béchamel: melt butter, whisk in flour, gradually add milk.",
            "Cook béchamel until thick, remove from heat and stir in cheese and egg yolks.",
            "Layer eggplant, meat sauce, repeat, top with béchamel.",
            "Bake at 350°F for 45 minutes until golden and set."
        ]
    },
    {
        id: 10,
        title: "Thai Green Papaya Salad",
        image: "https://pixabay.com/get/gd1d0f6be5629760b197e96a3cbf56e830f1cc698d7693dcf8523bb153300b28a675e9dd68f79d76503c28542c6d076a3413de4a45f17f502ad3d108982c15d98_1280.jpg",
        description: "Fresh and zesty Thai salad with shredded green papaya, tomatoes, and lime dressing.",
        cuisine: "asian",
        mealType: "lunch",
        difficulty: "medium",
        cookingTime: "15 mins",
        servings: 4,
        ingredients: [
            "1 large green papaya, julienned",
            "2 tomatoes, cut in wedges",
            "1/4 cup green beans, cut in pieces",
            "2 cloves garlic",
            "2 Thai chilies",
            "2 tbsp fish sauce",
            "2 tbsp lime juice",
            "1 tbsp palm sugar",
            "2 tbsp roasted peanuts",
            "1 tbsp dried shrimp (optional)"
        ],
        instructions: [
            "Using mortar and pestle, pound garlic and chilies.",
            "Add green beans and pound lightly to bruise.",
            "Add fish sauce, lime juice, and palm sugar.",
            "Add shredded papaya and pound gently to mix.",
            "Add tomatoes and pound lightly.",
            "Taste and adjust seasoning with more lime juice or fish sauce.",
            "Transfer to serving plate.",
            "Garnish with roasted peanuts and serve immediately."
        ]
    },
    {
        id: 11,
        title: "BBQ Pulled Pork Sandwich",
        image: "https://pixabay.com/get/g0118a277f33543974f7962e3ead33b54ad97c4c120e45bfadf6546429e631a80f4aaafd66870db431701247d3a0c128677a980b2312fb9183aed663e1dc8a54c_1280.jpg",
        description: "Slow-cooked pulled pork in tangy BBQ sauce served on soft brioche buns with coleslaw.",
        cuisine: "american",
        mealType: "lunch",
        difficulty: "medium",
        cookingTime: "6 hours",
        servings: 8,
        ingredients: [
            "3 lbs pork shoulder",
            "2 tbsp brown sugar",
            "1 tbsp paprika",
            "1 tsp garlic powder",
            "1 tsp onion powder",
            "1 tsp cumin",
            "1 cup BBQ sauce",
            "1/2 cup apple cider vinegar",
            "8 brioche buns",
            "Coleslaw for serving"
        ],
        instructions: [
            "Mix brown sugar and all dry spices for rub.",
            "Rub spice mixture all over pork shoulder.",
            "Place in slow cooker and cook on low for 6 hours.",
            "Remove pork and shred with two forks.",
            "Mix BBQ sauce with apple cider vinegar.",
            "Toss shredded pork with BBQ sauce mixture.",
            "Toast brioche buns lightly.",
            "Serve pulled pork on buns topped with coleslaw."
        ]
    },
    {
        id: 12,
        title: "Vietnamese Pho",
        image: "https://pixabay.com/get/g7e0b8fc45cf6045917636cfe1622c4e6e5dc99e015854c9201c8c39b4276fa04641434b60fed401b901e71569680955654f6780f4cf4cd398063da4ae073d632_1280.jpg",
        description: "Authentic Vietnamese noodle soup with aromatic broth, rice noodles, and fresh herbs.",
        cuisine: "asian",
        mealType: "lunch",
        difficulty: "hard",
        cookingTime: "4 hours",
        servings: 6,
        ingredients: [
            "2 lbs beef bones",
            "1 lb beef brisket",
            "1 onion, halved",
            "3 inch ginger piece",
            "4 star anise",
            "1 cinnamon stick",
            "6 cloves",
            "1 tbsp coriander seeds",
            "1 lb rice noodles",
            "1/2 lb raw beef sirloin, thinly sliced",
            "Bean sprouts",
            "Thai basil",
            "Lime wedges",
            "Fish sauce",
            "Hoisin sauce"
        ],
        instructions: [
            "Char onion and ginger over open flame until blackened.",
            "Toast spices in dry pan for 2-3 minutes until fragrant.",
            "Boil beef bones and brisket, then drain and rinse.",
            "Place bones, brisket, charred vegetables, and spices in large pot.",
            "Add water to cover and simmer for 3-4 hours, skimming foam.",
            "Strain broth and season with fish sauce and salt.",
            "Cook rice noodles according to package directions.",
            "Serve noodles in bowls, top with raw beef slices and hot broth."
        ]
    }
];

// Application State
let currentRecipes = [...recipes];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentModal = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const cuisineFilter = document.getElementById('cuisineFilter');
const mealTypeFilter = document.getElementById('mealTypeFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const clearFilters = document.getElementById('clearFilters');
const recipeGrid = document.getElementById('recipeGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const noResults = document.getElementById('noResults');
const noFavorites = document.getElementById('noFavorites');
const resultsCount = document.getElementById('resultsCount');
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const randomRecipeBtn = document.querySelector('.random-recipe-btn');
const modal = document.getElementById('recipeModal');
const loading = document.getElementById('loading');
const favoritesCount = document.querySelector('.favorites-count');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    displayRecipes(currentRecipes);
    updateFavoritesCount();
    setupEventListeners();
    displayFavorites();
}

function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    
    // Filters
    cuisineFilter.addEventListener('change', applyFilters);
    mealTypeFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('change', applyFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Random recipe
    randomRecipeBtn.addEventListener('click', showRandomRecipe);
    
    // Modal close events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Search Functionality
function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query) {
        clearSearch.classList.add('visible');
    } else {
        clearSearch.classList.remove('visible');
    }
    
    applyFilters();
}

function clearSearchInput() {
    searchInput.value = '';
    clearSearch.classList.remove('visible');
    applyFilters();
}

// Filter Functionality
function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const cuisine = cuisineFilter.value;
    const mealType = mealTypeFilter.value;
    const difficulty = difficultyFilter.value;
    
    currentRecipes = recipes.filter(recipe => {
        // Search filter
        const matchesSearch = !searchQuery || 
            recipe.title.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchQuery)
            );
        
        // Category filters
        const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
        const matchesMealType = !mealType || recipe.mealType === mealType;
        const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
        
        return matchesSearch && matchesCuisine && matchesMealType && matchesDifficulty;
    });
    
    displayRecipes(currentRecipes);
    updateResultsCount();
}

function clearAllFilters() {
    searchInput.value = '';
    cuisineFilter.value = '';
    mealTypeFilter.value = '';
    difficultyFilter.value = '';
    clearSearch.classList.remove('visible');
    
    currentRecipes = [...recipes];
    displayRecipes(currentRecipes);
    updateResultsCount();
}

function updateResultsCount() {
    const count = currentRecipes.length;
    const total = recipes.length;
    
    if (count === total) {
        resultsCount.textContent = 'Showing all recipes';
    } else if (count === 0) {
        resultsCount.textContent = 'No recipes found';
    } else {
        resultsCount.textContent = `Showing ${count} of ${total} recipes`;
    }
}

// Recipe Display
function displayRecipes(recipesToShow) {
    recipeGrid.innerHTML = '';
    
    if (recipesToShow.length === 0) {
        noResults.classList.add('visible');
        return;
    } else {
        noResults.classList.remove('visible');
    }
    
    recipesToShow.forEach((recipe, index) => {
        const recipeCard = createRecipeCard(recipe);
        recipeCard.style.animationDelay = `${index * 0.1}s`;
        recipeGrid.appendChild(recipeCard);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card fade-in';
    card.onclick = () => openModal(recipe);
    
    const isFavorite = favorites.includes(recipe.id);
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" loading="lazy">
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.title}</h3>
            <div class="recipe-meta">
                <span class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${recipe.cookingTime}
                </span>
                <span class="meta-item">
                    <i class="fas fa-users"></i>
                    ${recipe.servings} servings
                </span>
            </div>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-actions">
                <span class="difficulty-badge difficulty-${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
                <button class="favorite-toggle ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${recipe.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Favorites Functionality
function toggleFavorite(recipeId) {
    const index = favorites.indexOf(recipeId);
    
    if (index === -1) {
        favorites.push(recipeId);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    
    // Update UI
    displayRecipes(currentRecipes);
    displayFavorites();
    
    // Update modal if open
    if (currentModal && currentModal.id === recipeId) {
        updateModalFavoriteButton(recipeId);
    }
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

function displayFavorites() {
    const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
    
    favoritesGrid.innerHTML = '';
    
    if (favoriteRecipes.length === 0) {
        noFavorites.classList.add('visible');
        return;
    } else {
        noFavorites.classList.remove('visible');
    }
    
    favoriteRecipes.forEach((recipe, index) => {
        const recipeCard = createRecipeCard(recipe);
        recipeCard.style.animationDelay = `${index * 0.1}s`;
        favoritesGrid.appendChild(recipeCard);
    });
}

// Navigation
function switchSection(sectionName) {
    // Update navigation
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Update sections
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName) {
            section.classList.add('active');
        }
    });
    
    // Refresh favorites if switching to favorites section
    if (sectionName === 'favorites') {
        displayFavorites();
    }
}

// Random Recipe
function showRandomRecipe() {
    showLoading();
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        const randomRecipe = recipes[randomIndex];
        hideLoading();
        openModal(randomRecipe);
    }, 500);
}

// Modal Functionality
function openModal(recipe) {
    currentModal = recipe;
    
    // Populate modal content
    document.getElementById('modalImage').src = recipe.image;
    document.getElementById('modalImage').alt = recipe.title;
    document.getElementById('modalTitle').textContent = recipe.title;
    document.getElementById('modalTime').textContent = recipe.cookingTime;
    document.getElementById('modalDifficulty').textContent = recipe.difficulty;
    document.getElementById('modalCuisine').textContent = recipe.cuisine;
    document.getElementById('modalServings').textContent = `${recipe.servings} servings`;
    document.getElementById('modalDescription').textContent = recipe.description;
    
    // Update favorite button
    updateModalFavoriteButton(recipe.id);
    
    // Populate ingredients checklist
    const ingredientsContainer = document.getElementById('ingredientsChecklist');
    ingredientsContainer.innerHTML = '';
    
    recipe.ingredients.forEach((ingredient, index) => {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
            <input type="checkbox" class="ingredient-checkbox" id="ingredient-${index}">
            <label for="ingredient-${index}" class="ingredient-text">${ingredient}</label>
        `;
        
        const checkbox = ingredientItem.querySelector('.ingredient-checkbox');
        checkbox.addEventListener('change', () => {
            ingredientItem.classList.toggle('checked', checkbox.checked);
        });
        
        ingredientsContainer.appendChild(ingredientItem);
    });
    
    // Populate instructions
    const instructionsContainer = document.getElementById('instructionsList');
    instructionsContainer.innerHTML = '';
    
    recipe.instructions.forEach((instruction, index) => {
        const instructionItem = document.createElement('div');
        instructionItem.className = 'instruction-item slide-in';
        instructionItem.style.animationDelay = `${index * 0.1}s`;
        instructionItem.innerHTML = `
            <div class="instruction-number">${index + 1}</div>
            <div class="instruction-text">${instruction}</div>
        `;
        instructionsContainer.appendChild(instructionItem);
    });
    
    // Setup modal favorite button
    const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
    modalFavoriteBtn.onclick = () => toggleFavorite(recipe.id);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateModalFavoriteButton(recipeId) {
    const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
    const isFavorite = favorites.includes(recipeId);
    
    if (isFavorite) {
        modalFavoriteBtn.classList.add('active');
        modalFavoriteBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>Remove from Favorites</span>
        `;
    } else {
        modalFavoriteBtn.classList.remove('active');
        modalFavoriteBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>Add to Favorites</span>
        `;
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModal = null;
    
    // Clear ingredient checkboxes
    const checkboxes = document.querySelectorAll('.ingredient-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove('checked');
    });
}

// Loading Spinner
function showLoading() {
    loading.classList.add('active');
}

function hideLoading() {
    loading.classList.remove('active');
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced search with debounce
searchInput.addEventListener('input', debounce(handleSearch, 300));

// Lazy loading for images
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, observerOptions);

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
    }
}, true);

// Service Worker for caching (if needed)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, but app still works
    });
}

// Export functions for potential testing
window.RecipeFinderApp = {
    toggleFavorite,
    switchSection,
    openModal,
    closeModal,
    showRandomRecipe,
    applyFilters
};
