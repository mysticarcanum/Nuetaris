// Support both Node.js and browser environments
let nutritionDatabase;
try {
  // Try ES module import first (for browser)
  nutritionDatabase = require('../data/nutritionDatabase.json');
} catch (error) {
  // Fallback for browser environment - we'll load it dynamically
  nutritionDatabase = [];
}

class FastNutritionService {
  static nutritionCache = new Map();
  static searchCache = new Map();
  
  // Lightning fast local search (under 100ms)
  static async estimateNutritionFromName(mealName) {
    const cacheKey = mealName.toLowerCase().trim();
    
    // Check cache first
    if (this.nutritionCache.has(cacheKey)) {
      return this.nutritionCache.get(cacheKey);
    }
    
    // Fast fuzzy search in local database
    const result = this.fuzzySearch(mealName);
    
    if (result) {
      this.nutritionCache.set(cacheKey, result);
      return result;
    }
    
    // Fallback to simple estimation based on meal type
    const estimated = this.estimateFromMealType(mealName);
    this.nutritionCache.set(cacheKey, estimated);
    return estimated;
  }
  
  static fuzzySearch(mealName) {
    const searchTerm = mealName.toLowerCase();
    
    // If database is not loaded, return null
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return null;
    }
    
    // Exact match first
    const exactMatch = nutritionDatabase.find(meal => 
      meal.name.toLowerCase() === searchTerm
    );
    if (exactMatch) return exactMatch;
    
    // Partial match
    const partialMatch = nutritionDatabase.find(meal => 
      meal.name.toLowerCase().includes(searchTerm) ||
      searchTerm.includes(meal.name.toLowerCase())
    );
    if (partialMatch) return partialMatch;
    
    // Keyword matching
    const keywords = searchTerm.split(' ');
    const keywordMatch = nutritionDatabase.find(meal => 
      keywords.some(keyword => 
        meal.name.toLowerCase().includes(keyword) ||
        meal.keywords?.some(k => k.toLowerCase().includes(keyword))
      )
    );
    if (keywordMatch) return keywordMatch;
    
    return null;
  }
  
  static estimateFromMealType(mealName) {
    const name = mealName.toLowerCase();
    
    // Quick estimation based on meal characteristics
    if (name.includes('salad')) {
      return {
        calories: 150,
        protein: 8,
        carbs: 15,
        fat: 8,
        sugar: 5,
        fiber: 4,
        sodium: 300,
        saturatedFat: 1,
        cholesterol: 10,
        potassium: 300,
        vitaminC: 20,
        calcium: 100,
        iron: 2,
        ingredients: ['Mixed greens', 'Vegetables', 'Dressing'],
        instructions: ['Wash greens', 'Chop vegetables', 'Add dressing'],
        tips: 'Use fresh ingredients for best nutrition',
        cookTime: '10 minutes',
        nutrition: 'Low calorie, high fiber salad'
      };
    }
    
    if (name.includes('pasta') || name.includes('noodle')) {
      return {
        calories: 420,
        protein: 12,
        carbs: 70,
        fat: 8,
        sugar: 8,
        fiber: 6,
        sodium: 500,
        saturatedFat: 2,
        cholesterol: 0,
        potassium: 400,
        vitaminC: 25,
        calcium: 50,
        iron: 3,
        ingredients: ['Pasta', 'Tomato sauce', 'Olive oil', 'Garlic', 'Herbs'],
        instructions: ['Boil pasta', 'Prepare tomato sauce', 'Combine and serve'],
        tips: 'Cook pasta al dente for best texture',
        cookTime: '20 minutes',
        nutrition: 'Complex carbs, lycopene, fiber'
      };
    }
    
    if (name.includes('chicken') || name.includes('poultry')) {
      return {
        calories: 350,
        protein: 35,
        carbs: 20,
        fat: 15,
        sugar: 3,
        fiber: 2,
        sodium: 400,
        saturatedFat: 4,
        cholesterol: 100,
        potassium: 400,
        vitaminC: 10,
        calcium: 50,
        iron: 3,
        ingredients: ['Chicken breast', 'Seasonings', 'Vegetables'],
        instructions: ['Season chicken', 'Cook until done', 'Serve with sides'],
        tips: 'Cook to internal temperature of 165°F',
        cookTime: '25 minutes',
        nutrition: 'High protein chicken dish'
      };
    }
    
    if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) {
      return {
        calories: 300,
        protein: 30,
        carbs: 15,
        fat: 12,
        sugar: 2,
        fiber: 2,
        sodium: 350,
        saturatedFat: 2,
        cholesterol: 80,
        potassium: 500,
        vitaminC: 8,
        calcium: 50,
        iron: 2,
        ingredients: ['Fish fillet', 'Lemon', 'Herbs', 'Vegetables'],
        instructions: ['Season fish', 'Cook until flaky', 'Serve with lemon'],
        tips: 'Don\'t overcook fish - it should flake easily',
        cookTime: '15 minutes',
        nutrition: 'Omega-3 rich fish dish'
      };
    }
    
    if (name.includes('beef') || name.includes('steak') || name.includes('burger')) {
      return {
        calories: 450,
        protein: 25,
        carbs: 25,
        fat: 25,
        sugar: 3,
        fiber: 2,
        sodium: 600,
        saturatedFat: 8,
        cholesterol: 80,
        potassium: 400,
        vitaminC: 5,
        calcium: 50,
        iron: 4,
        ingredients: ['Beef', 'Seasonings', 'Bun or sides'],
        instructions: ['Season beef', 'Cook to desired doneness', 'Serve'],
        tips: 'Let meat rest before cutting',
        cookTime: '20 minutes',
        nutrition: 'Protein-rich beef dish'
      };
    }
    
    if (name.includes('soup') || name.includes('broth')) {
      return {
        calories: 200,
        protein: 10,
        carbs: 25,
        fat: 8,
        sugar: 5,
        fiber: 3,
        sodium: 800,
        saturatedFat: 2,
        cholesterol: 20,
        potassium: 400,
        vitaminC: 15,
        calcium: 100,
        iron: 2,
        ingredients: ['Broth', 'Vegetables', 'Protein', 'Seasonings'],
        instructions: ['Simmer broth', 'Add vegetables', 'Add protein', 'Season'],
        tips: 'Use homemade broth for better flavor',
        cookTime: '30 minutes',
        nutrition: 'Warming soup with vegetables'
      };
    }
    
    if (name.includes('pizza')) {
      return {
        calories: 300,
        protein: 12,
        carbs: 35,
        fat: 12,
        sugar: 3,
        fiber: 2,
        sodium: 600,
        saturatedFat: 4,
        cholesterol: 30,
        potassium: 200,
        vitaminC: 5,
        calcium: 150,
        iron: 2,
        ingredients: ['Pizza dough', 'Sauce', 'Cheese', 'Toppings'],
        instructions: ['Preheat oven', 'Add toppings', 'Bake until golden'],
        tips: 'Use a pizza stone for crispier crust',
        cookTime: '15 minutes',
        nutrition: 'Classic pizza with toppings'
      };
    }
    
    if (name.includes('smoothie') || name.includes('shake')) {
      return {
        calories: 250,
        protein: 15,
        carbs: 30,
        fat: 8,
        sugar: 20,
        fiber: 4,
        sodium: 100,
        saturatedFat: 2,
        cholesterol: 10,
        potassium: 400,
        vitaminC: 30,
        calcium: 200,
        iron: 2,
        ingredients: ['Fruits', 'Yogurt or milk', 'Protein powder', 'Ice'],
        instructions: ['Blend fruits', 'Add liquid', 'Blend until smooth'],
        tips: 'Use frozen fruits for thicker consistency',
        cookTime: '5 minutes',
        nutrition: 'Nutritious smoothie with fruits'
      };
    }
    
    if (name.includes('yogurt') || name.includes('bowl')) {
      return {
        calories: 180,
        protein: 15,
        carbs: 20,
        fat: 5,
        sugar: 12,
        fiber: 3,
        sodium: 120,
        saturatedFat: 2,
        cholesterol: 15,
        potassium: 300,
        vitaminC: 8,
        calcium: 200,
        iron: 1,
        ingredients: ['Greek yogurt', 'Granola', 'Berries', 'Honey'],
        instructions: ['Scoop yogurt', 'Add toppings', 'Drizzle honey'],
        tips: 'Use full-fat yogurt for creamier texture',
        cookTime: '2 minutes',
        nutrition: 'Protein-rich yogurt bowl'
      };
    }
    
    if (name.includes('rice') || name.includes('grain')) {
      return {
        calories: 220,
        protein: 5,
        carbs: 45,
        fat: 2,
        sugar: 1,
        fiber: 3,
        sodium: 200,
        saturatedFat: 0,
        cholesterol: 0,
        potassium: 150,
        vitaminC: 0,
        calcium: 20,
        iron: 1,
        ingredients: ['Rice or grain', 'Seasonings', 'Vegetables'],
        instructions: ['Cook grain', 'Add seasonings', 'Serve with vegetables'],
        tips: 'Use brown rice for more fiber',
        cookTime: '20 minutes',
        nutrition: 'Complex carbohydrates, fiber'
      };
    }
    
    if (name.includes('sandwich') || name.includes('wrap')) {
      return {
        calories: 350,
        protein: 20,
        carbs: 40,
        fat: 15,
        sugar: 5,
        fiber: 4,
        sodium: 700,
        saturatedFat: 5,
        cholesterol: 50,
        potassium: 300,
        vitaminC: 10,
        calcium: 100,
        iron: 2,
        ingredients: ['Bread or wrap', 'Protein', 'Vegetables', 'Condiments'],
        instructions: ['Layer ingredients', 'Wrap or close sandwich', 'Serve'],
        tips: 'Use whole grain bread for better nutrition',
        cookTime: '5 minutes',
        nutrition: 'Balanced meal with protein and carbs'
      };
    }
    
    if (name.includes('eggs') || name.includes('omelet')) {
      return {
        calories: 280,
        protein: 18,
        carbs: 5,
        fat: 20,
        sugar: 2,
        fiber: 1,
        sodium: 400,
        saturatedFat: 6,
        cholesterol: 400,
        potassium: 200,
        vitaminC: 5,
        calcium: 100,
        iron: 2,
        ingredients: ['Eggs', 'Vegetables', 'Cheese', 'Seasonings'],
        instructions: ['Beat eggs', 'Add ingredients', 'Cook until set'],
        tips: 'Don\'t overcook eggs for best texture',
        cookTime: '10 minutes',
        nutrition: 'High protein breakfast option'
      };
    }
    
    if (name.includes('pancake') || name.includes('waffle')) {
      return {
        calories: 300,
        protein: 8,
        carbs: 50,
        fat: 10,
        sugar: 15,
        fiber: 2,
        sodium: 400,
        saturatedFat: 3,
        cholesterol: 60,
        potassium: 150,
        vitaminC: 0,
        calcium: 100,
        iron: 2,
        ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Syrup'],
        instructions: ['Mix batter', 'Cook on griddle', 'Serve with toppings'],
        tips: 'Use whole grain flour for better nutrition',
        cookTime: '15 minutes',
        nutrition: 'Classic breakfast with carbs'
      };
    }
    
    if (name.includes('cereal') || name.includes('oatmeal')) {
      return {
        calories: 200,
        protein: 8,
        carbs: 35,
        fat: 5,
        sugar: 10,
        fiber: 5,
        sodium: 150,
        saturatedFat: 1,
        cholesterol: 0,
        potassium: 200,
        vitaminC: 5,
        calcium: 100,
        iron: 3,
        ingredients: ['Cereal or oats', 'Milk', 'Fruits', 'Nuts'],
        instructions: ['Pour cereal', 'Add milk', 'Top with fruits'],
        tips: 'Choose low-sugar cereals for better nutrition',
        cookTime: '3 minutes',
        nutrition: 'Fiber-rich breakfast option'
      };
    }
    
    if (name.includes('noodle') || name.includes('ramen')) {
      return {
        calories: 400,
        protein: 12,
        carbs: 65,
        fat: 10,
        sugar: 5,
        fiber: 3,
        sodium: 800,
        saturatedFat: 3,
        cholesterol: 0,
        potassium: 200,
        vitaminC: 5,
        calcium: 50,
        iron: 2,
        ingredients: ['Noodles', 'Broth', 'Vegetables', 'Protein'],
        instructions: ['Cook noodles', 'Prepare broth', 'Add toppings'],
        tips: 'Use fresh vegetables for better nutrition',
        cookTime: '15 minutes',
        nutrition: 'Comforting noodle dish'
      };
    }
    
    if (name.includes('curry') || name.includes('spice')) {
      return {
        calories: 350,
        protein: 15,
        carbs: 40,
        fat: 15,
        sugar: 8,
        fiber: 6,
        sodium: 600,
        saturatedFat: 3,
        cholesterol: 30,
        potassium: 400,
        vitaminC: 20,
        calcium: 100,
        iron: 3,
        ingredients: ['Protein', 'Vegetables', 'Spices', 'Coconut milk'],
        instructions: ['Sauté spices', 'Add protein and vegetables', 'Simmer'],
        tips: 'Adjust spice level to preference',
        cookTime: '25 minutes',
        nutrition: 'Flavorful spiced dish'
      };
    }
    
    if (name.includes('stew') || name.includes('casserole')) {
      return {
        calories: 380,
        protein: 20,
        carbs: 35,
        fat: 18,
        sugar: 8,
        fiber: 5,
        sodium: 600,
        saturatedFat: 6,
        cholesterol: 60,
        potassium: 500,
        vitaminC: 15,
        calcium: 100,
        iron: 3,
        ingredients: ['Protein', 'Vegetables', 'Broth', 'Seasonings'],
        instructions: ['Brown meat', 'Add vegetables', 'Simmer until tender'],
        tips: 'Cook low and slow for best flavor',
        cookTime: '45 minutes',
        nutrition: 'Hearty comfort food'
      };
    }
    
    if (name.includes('grill') || name.includes('barbecue')) {
      return {
        calories: 400,
        protein: 30,
        carbs: 25,
        fat: 20,
        sugar: 5,
        fiber: 3,
        sodium: 500,
        saturatedFat: 6,
        cholesterol: 80,
        potassium: 400,
        vitaminC: 10,
        calcium: 50,
        iron: 3,
        ingredients: ['Protein', 'Seasonings', 'Vegetables', 'Sauce'],
        instructions: ['Season meat', 'Grill to desired doneness', 'Serve'],
        tips: 'Let meat rest before cutting',
        cookTime: '20 minutes',
        nutrition: 'Grilled protein with sides'
      };
    }
    
    if (name.includes('bake') || name.includes('roast')) {
      return {
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15,
        sugar: 5,
        fiber: 4,
        sodium: 400,
        saturatedFat: 4,
        cholesterol: 60,
        potassium: 400,
        vitaminC: 15,
        calcium: 80,
        iron: 2,
        ingredients: ['Protein', 'Vegetables', 'Seasonings', 'Oil'],
        instructions: ['Season ingredients', 'Arrange on pan', 'Bake until done'],
        tips: 'Use high heat for crispy texture',
        cookTime: '30 minutes',
        nutrition: 'Oven-roasted meal'
      };
    }
    
    if (name.includes('stir') || name.includes('wok')) {
      return {
        calories: 320,
        protein: 18,
        carbs: 35,
        fat: 12,
        sugar: 8,
        fiber: 5,
        sodium: 600,
        saturatedFat: 2,
        cholesterol: 40,
        potassium: 400,
        vitaminC: 25,
        calcium: 80,
        iron: 2,
        ingredients: ['Protein', 'Vegetables', 'Sauce', 'Oil'],
        instructions: ['Heat wok', 'Stir fry protein', 'Add vegetables'],
        tips: 'Use high heat for authentic stir fry',
        cookTime: '15 minutes',
        nutrition: 'Quick stir-fried dish'
      };
    }
    
    if (name.includes('dip') || name.includes('spread')) {
      return {
        calories: 120,
        protein: 5,
        carbs: 8,
        fat: 8,
        sugar: 3,
        fiber: 2,
        sodium: 300,
        saturatedFat: 2,
        cholesterol: 10,
        potassium: 150,
        vitaminC: 5,
        calcium: 50,
        iron: 1,
        ingredients: ['Base ingredient', 'Seasonings', 'Herbs', 'Oil'],
        instructions: ['Mix ingredients', 'Season to taste', 'Chill if needed'],
        tips: 'Let flavors meld for best taste',
        cookTime: '5 minutes',
        nutrition: 'Flavorful dip or spread'
      };
    }
    
    if (name.includes('snack') || name.includes('trail')) {
      return {
        calories: 160,
        protein: 5,
        carbs: 15,
        fat: 10,
        sugar: 8,
        fiber: 3,
        sodium: 50,
        saturatedFat: 1,
        cholesterol: 0,
        potassium: 200,
        vitaminC: 0,
        calcium: 50,
        iron: 1,
        ingredients: ['Nuts', 'Dried fruits', 'Seeds', 'Optional chocolate'],
        instructions: ['Mix ingredients', 'Portion into servings', 'Store'],
        tips: 'Use unsalted nuts for lower sodium',
        cookTime: '5 minutes',
        nutrition: 'Energy-rich snack mix'
      };
    }
    
    // Default estimation for unknown meals
    return {
      calories: 300,
      protein: 15,
      carbs: 30,
      fat: 10,
      sugar: 5,
      fiber: 3,
      sodium: 400,
      saturatedFat: 2,
      cholesterol: 50,
      potassium: 250,
      vitaminC: 10,
      calcium: 100,
      iron: 2,
      ingredients: ['Main ingredient', 'Seasonings', 'Sauce'],
      instructions: ['Prepare ingredients', 'Cook as needed', 'Season to taste'],
      tips: 'Adjust seasoning to personal preference',
      cookTime: '15 minutes',
      nutrition: 'Balanced meal with protein and vegetables'
    };
  }
  
  // Get meal suggestions (instant)
  static async getMealSuggestions(query) {
    const searchTerm = query.toLowerCase();
    const cacheKey = `suggestions_${searchTerm}`;
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }
    
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return [];
    }
    
    const suggestions = nutritionDatabase
      .filter(meal => 
        meal.name.toLowerCase().includes(searchTerm) ||
        meal.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        )
      )
      .slice(0, 5)
      .map(meal => meal.name);
    
    this.searchCache.set(cacheKey, suggestions);
    return suggestions;
  }
  
  // Clear cache (useful for testing)
  static clearCache() {
    this.nutritionCache.clear();
    this.searchCache.clear();
  }
  
  // Get all available meals
  static getAllMeals() {
    return nutritionDatabase ? nutritionDatabase.map(meal => meal.name) : [];
  }
  
  // Get meals by category
  static getMealsByCategory(category) {
    return nutritionDatabase
      ? nutritionDatabase
          .filter(meal => meal.category === category)
          .map(meal => meal.name)
      : [];
  }
  
  // Get meals by cuisine
  static getMealsByCuisine(cuisine) {
    return nutritionDatabase
      ? nutritionDatabase
          .filter(meal => meal.cuisine === cuisine)
          .map(meal => meal.name)
      : [];
  }
  
  // Get random meal suggestions
  static getRandomMeals(count = 5) {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return [];
    }
    
    const shuffled = [...nutritionDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(meal => meal.name);
  }
  
  // Get meal by exact name
  static getMealByName(mealName) {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return null;
    }
    
    return nutritionDatabase.find(meal => 
      meal.name.toLowerCase() === mealName.toLowerCase()
    );
  }
  
  // Get nutritional summary for a meal
  static getNutritionalSummary(mealName) {
    const meal = this.getMealByName(mealName);
    if (!meal) return null;
    
    return {
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      summary: `${meal.calories} calories, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat`
    };
  }
  
  // Get cooking tips for a meal
  static getCookingTips(mealName) {
    const meal = this.getMealByName(mealName);
    return meal ? meal.tips : null;
  }
  
  // Get cooking time for a meal
  static getCookingTime(mealName) {
    const meal = this.getMealByName(mealName);
    return meal ? meal.cookTime : null;
  }
  
  // Get ingredients for a meal
  static getIngredients(mealName) {
    const meal = this.getMealByName(mealName);
    return meal ? meal.ingredients : null;
  }
  
  // Get instructions for a meal
  static getInstructions(mealName) {
    const meal = this.getMealByName(mealName);
    return meal ? meal.instructions : null;
  }
  
  // Get meal categories
  static getMealCategories() {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return [];
    }
    
    const categories = [...new Set(nutritionDatabase.map(meal => meal.category))];
    return categories.sort();
  }
  
  // Get cuisine types
  static getCuisineTypes() {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return [];
    }
    
    const cuisines = [...new Set(nutritionDatabase.map(meal => meal.cuisine))];
    return cuisines.sort();
  }
  
  // Search meals by multiple criteria
  static searchMealsByCriteria(criteria) {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return [];
    }
    
    let filtered = nutritionDatabase;
    
    if (criteria.category) {
      filtered = filtered.filter(meal => meal.category === criteria.category);
    }
    
    if (criteria.cuisine) {
      filtered = filtered.filter(meal => meal.cuisine === criteria.cuisine);
    }
    
    if (criteria.maxCalories) {
      filtered = filtered.filter(meal => meal.calories <= criteria.maxCalories);
    }
    
    if (criteria.minProtein) {
      filtered = filtered.filter(meal => meal.protein >= criteria.minProtein);
    }
    
    if (criteria.searchTerm) {
      const searchTerm = criteria.searchTerm.toLowerCase();
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm) ||
        meal.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }
    
    return filtered.map(meal => meal.name);
  }
  
  // Get meal statistics
  static getMealStatistics() {
    if (!nutritionDatabase || nutritionDatabase.length === 0) {
      return null;
    }
    
    const totalMeals = nutritionDatabase.length;
    const categories = [...new Set(nutritionDatabase.map(meal => meal.category))];
    const cuisines = [...new Set(nutritionDatabase.map(meal => meal.cuisine))];
    
    const avgCalories = nutritionDatabase.reduce((sum, meal) => sum + meal.calories, 0) / totalMeals;
    const avgProtein = nutritionDatabase.reduce((sum, meal) => sum + meal.protein, 0) / totalMeals;
    const avgCarbs = nutritionDatabase.reduce((sum, meal) => sum + meal.carbs, 0) / totalMeals;
    const avgFat = nutritionDatabase.reduce((sum, meal) => sum + meal.fat, 0) / totalMeals;
    
    return {
      totalMeals,
      categories: categories.length,
      cuisines: cuisines.length,
      averageNutrition: {
        calories: Math.round(avgCalories),
        protein: Math.round(avgProtein),
        carbs: Math.round(avgCarbs),
        fat: Math.round(avgFat)
      }
    };
  }
}

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FastNutritionService;
} else {
  // Browser environment
  window.FastNutritionService = FastNutritionService;
}
