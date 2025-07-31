// In the estimateFromMealType method, replace the pasta section with:

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
