/ src/services/fastNutrition.js
import nutritionDatabase from '../data/nutritionDatabase.json';

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
        calories: 400,
        protein: 12,
        carbs: 60,
        fat: 12,
        sugar: 3,
        fiber: 3,
        sodium: 500,
        saturatedFat: 3,
        cholesterol: 30,
        potassium: 200,
        vitaminC: 5,
        calcium: 50,
        iron: 2,
        ingredients: ['Pasta', 'Sauce', 'Cheese'],
        instructions: ['Boil pasta', 'Add sauce', 'Top with cheese'],
        tips: 'Cook pasta al dente for best texture',
        cookTime: '20 minutes',
        nutrition: 'Carbohydrate-rich pasta dish'
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
    return nutritionDatabase.map(meal => meal.name);
  }
  
  // Get meals by category
  static getMealsByCategory(category) {
    return nutritionDatabase
      .filter(meal => meal.category === category)
      .map(meal => meal.name);
  }
}

export default FastNutritionService;
