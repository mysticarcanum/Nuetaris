import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './MealSidebar.css';

const MealSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredMeal, setHoveredMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [expandedMeal, setExpandedMeal] = useState(null);

  // Cuisine filter options
  const cuisines = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'Western', label: 'Western' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Middle Eastern', label: 'Middle Eastern' },
    { value: 'British', label: 'British' },
    { value: 'American', label: 'American' },
    { value: 'Healthy', label: 'Healthy' },
    { value: 'Snack', label: 'Snack' }
  ];

  // Meal type filter options
  const mealTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  // Comprehensive meal database with detailed recipes
  const mealCategories = {
    breakfast: {
      name: "Breakfast",
      meals: [
        // Western Breakfast
        {
          name: "Greek Yogurt Bowl",
          cuisine: "Western",
          mealType: "breakfast",
          cookTime: "5 minutes",
          nutrition: "High protein, probiotics, calcium",
          calories: 180,
          protein: "15g",
          carbs: "20g",
          fat: "5g",
          ingredients: [
            "1 cup Greek yogurt",
            "1/4 cup granola",
            "1/2 cup mixed berries",
            "1 tbsp honey",
            "1 tbsp chopped nuts"
          ],
          instructions: [
            "Scoop Greek yogurt into a bowl",
            "Top with granola and fresh berries",
            "Drizzle with honey",
            "Sprinkle with chopped nuts",
            "Serve immediately"
          ],
          tips: "Use full-fat Greek yogurt for creamier texture. Can be prepared the night before."
        },
        {
          name: "Oatmeal with Berries",
          cuisine: "Western",
          mealType: "breakfast",
          cookTime: "10 minutes",
          nutrition: "Fiber-rich, antioxidants, sustained energy",
          calories: 220,
          protein: "8g",
          carbs: "35g",
          fat: "4g",
          ingredients: [
            "1/2 cup rolled oats",
            "1 cup water or milk",
            "1/4 cup mixed berries",
            "1 tbsp maple syrup",
            "Pinch of salt"
          ],
          instructions: [
            "Bring water/milk to boil in a saucepan",
            "Add oats and salt, reduce heat to low",
            "Cook for 5-7 minutes, stirring occasionally",
            "Top with berries and maple syrup",
            "Let stand for 2 minutes before serving"
          ],
          tips: "Use steel-cut oats for more texture. Add cinnamon for extra flavor."
        },
        {
          name: "Scrambled Eggs on Toast",
          cuisine: "Western",
          mealType: "breakfast",
          cookTime: "8 minutes",
          nutrition: "Complete protein, B vitamins, choline",
          calories: 280,
          protein: "18g",
          carbs: "25g",
          fat: "12g",
          ingredients: [
            "2 large eggs",
            "1 slice whole grain bread",
            "1 tbsp butter",
            "Salt and pepper to taste",
            "Fresh herbs (optional)"
          ],
          instructions: [
            "Toast bread until golden brown",
            "Crack eggs into a bowl and whisk",
            "Melt butter in a non-stick pan over medium heat",
            "Add eggs and cook, stirring gently",
            "Season with salt and pepper",
            "Serve over toast with fresh herbs"
          ],
          tips: "Don't over-stir the eggs for fluffier texture. Add a splash of milk for creaminess."
        },
        // Chinese Breakfast
        {
          name: "Congee (Rice Porridge)",
          cuisine: "Chinese",
          mealType: "breakfast",
          cookTime: "30 minutes",
          nutrition: "Easy to digest, warming, traditional",
          calories: 180,
          protein: "4g",
          carbs: "35g",
          fat: "2g",
          ingredients: [
            "1/2 cup white rice",
            "4 cups water",
            "1/2 tsp salt",
            "1 green onion, chopped",
            "1 tbsp soy sauce"
          ],
          instructions: [
            "Rinse rice until water runs clear",
            "Combine rice and water in a large pot",
            "Bring to boil, then reduce to simmer",
            "Cook for 25-30 minutes, stirring occasionally",
            "Season with salt and soy sauce",
            "Garnish with green onions"
          ],
          tips: "Can be made in advance and reheated. Add ginger for extra flavor."
        },
        {
          name: "Jianbing (Chinese Crepe)",
          cuisine: "Chinese",
          mealType: "breakfast",
          cookTime: "8 minutes",
          nutrition: "Protein, vegetables, street food",
          calories: 320,
          protein: "15g",
          carbs: "35g",
          fat: "12g",
          ingredients: [
            "1/2 cup all-purpose flour",
            "1/4 cup water",
            "1 egg",
            "1 green onion, chopped",
            "1 tbsp hoisin sauce"
          ],
          instructions: [
            "Mix flour and water to form a thin batter",
            "Heat a non-stick pan over medium heat",
            "Pour batter and spread thinly",
            "Crack egg on top and spread",
            "Add green onions and fold",
            "Brush with hoisin sauce and serve"
          ],
          tips: "Use a large pan for easier flipping. Can add vegetables for extra nutrition."
        }
      ]
    },
    lunch: {
      name: "Lunch",
      meals: [
        // Western Lunch
        {
          name: "Chicken Caesar Salad",
          cuisine: "Western",
          mealType: "lunch",
          cookTime: "15 minutes",
          nutrition: "Lean protein, fiber, vitamins A & K",
          calories: 320,
          protein: "28g",
          carbs: "15g",
          fat: "16g",
          ingredients: [
            "1 chicken breast, grilled",
            "2 cups romaine lettuce",
            "1/4 cup croutons",
            "2 tbsp Caesar dressing",
            "1/4 cup parmesan cheese"
          ],
          instructions: [
            "Grill chicken breast until cooked through",
            "Chop lettuce and place in bowl",
            "Slice chicken and add to salad",
            "Top with croutons and parmesan",
            "Drizzle with Caesar dressing and toss"
          ],
          tips: "Use leftover chicken for quick preparation. Add cherry tomatoes for color."
        },
        {
          name: "Tuna Sandwich",
          cuisine: "Western",
          mealType: "lunch",
          cookTime: "5 minutes",
          nutrition: "Omega-3 fatty acids, protein, B vitamins",
          calories: 290,
          protein: "22g",
          carbs: "35g",
          fat: "8g",
          ingredients: [
            "1 can tuna in water",
            "2 slices whole grain bread",
            "1 tbsp mayonnaise",
            "1/4 cup diced celery",
            "Salt and pepper to taste"
          ],
          instructions: [
            "Drain tuna and flake with fork",
            "Mix with mayonnaise and celery",
            "Season with salt and pepper",
            "Spread on bread and close sandwich",
            "Cut diagonally and serve"
          ],
          tips: "Add diced red onion for extra flavor. Use Greek yogurt instead of mayo for less fat."
        },
        // Chinese Lunch
        {
          name: "Kung Pao Chicken",
          cuisine: "Chinese",
          mealType: "lunch",
          cookTime: "20 minutes",
          nutrition: "Protein, vegetables, spicy flavors",
          calories: 380,
          protein: "25g",
          carbs: "25g",
          fat: "18g",
          ingredients: [
            "1 chicken breast, diced",
            "2 tbsp soy sauce",
            "1 tbsp rice wine",
            "1/2 cup peanuts",
            "2 green onions, chopped",
            "2 tbsp vegetable oil"
          ],
          instructions: [
            "Marinate chicken in soy sauce and rice wine",
            "Heat oil in wok over high heat",
            "Stir-fry chicken until golden",
            "Add peanuts and green onions",
            "Cook for 2 minutes and serve"
          ],
          tips: "Use a wok for authentic flavor. Adjust spice level with chili peppers."
        },
        {
          name: "Mapo Tofu",
          cuisine: "Chinese",
          mealType: "lunch",
          cookTime: "15 minutes",
          nutrition: "Plant protein, spicy, traditional",
          calories: 280,
          protein: "15g",
          carbs: "20g",
          fat: "12g",
          ingredients: [
            "1 block firm tofu, cubed",
            "2 tbsp doubanjiang (spicy bean paste)",
            "1 tbsp soy sauce",
            "2 green onions, chopped",
            "1 tbsp vegetable oil"
          ],
          instructions: [
            "Heat oil in a wok over medium heat",
            "Add doubanjiang and stir-fry for 30 seconds",
            "Add tofu cubes and gently stir",
            "Add soy sauce and green onions",
            "Cook for 5 minutes and serve"
          ],
          tips: "Handle tofu gently to prevent breaking. Add ground pork for extra protein."
        }
      ]
    },
    dinner: {
      name: "Dinner",
      meals: [
        // Western Dinner
        {
          name: "Grilled Salmon with Vegetables",
          cuisine: "Western",
          mealType: "dinner",
          cookTime: "25 minutes",
          nutrition: "Omega-3, protein, fiber, vitamins",
          calories: 420,
          protein: "35g",
          carbs: "20g",
          fat: "22g",
          ingredients: [
            "1 salmon fillet (6 oz)",
            "1 cup mixed vegetables",
            "2 tbsp olive oil",
            "1 lemon, sliced",
            "Salt and pepper to taste"
          ],
          instructions: [
            "Preheat grill to medium-high heat",
            "Season salmon with salt and pepper",
            "Brush vegetables with olive oil",
            "Grill salmon for 4-5 minutes per side",
            "Grill vegetables until tender",
            "Serve with lemon wedges"
          ],
          tips: "Don't overcook salmon - it should be slightly pink in center. Use a fish basket for easier grilling."
        },
        {
          name: "Spaghetti Carbonara",
          cuisine: "Western",
          mealType: "dinner",
          cookTime: "25 minutes",
          nutrition: "Protein, carbs, creamy sauce",
          calories: 520,
          protein: "20g",
          carbs: "60g",
          fat: "22g",
          ingredients: [
            "8 oz spaghetti",
            "4 slices bacon, diced",
            "2 large eggs",
            "1/2 cup parmesan cheese",
            "Black pepper to taste"
          ],
          instructions: [
            "Cook pasta according to package directions",
            "Cook bacon until crispy",
            "Beat eggs with parmesan and pepper",
            "Drain pasta, reserving 1/2 cup water",
            "Add hot pasta to eggs, stirring quickly",
            "Add bacon and serve immediately"
          ],
          tips: "Use hot pasta to cook eggs without scrambling. Add pasta water if sauce is too thick."
        },
        // Chinese Dinner
        {
          name: "Sweet & Sour Pork",
          cuisine: "Chinese",
          mealType: "dinner",
          cookTime: "25 minutes",
          nutrition: "Protein, tangy flavors, vegetables",
          calories: 420,
          protein: "22g",
          carbs: "35g",
          fat: "20g",
          ingredients: [
            "1 lb pork, cubed",
            "1/4 cup cornstarch",
            "2 tbsp soy sauce",
            "1/4 cup vinegar",
            "2 tbsp sugar",
            "1 bell pepper, sliced"
          ],
          instructions: [
            "Coat pork in cornstarch",
            "Deep fry pork until golden",
            "Mix soy sauce, vinegar, and sugar",
            "Stir-fry bell pepper",
            "Add sauce and pork, cook until thickened"
          ],
          tips: "Use a wok for authentic cooking. Add pineapple for extra sweetness."
        }
      ]
    },
    snacks: {
      name: "Snacks",
      meals: [
        // Healthy Snacks
        {
          name: "Apple with Peanut Butter",
          cuisine: "Healthy",
          mealType: "snack",
          cookTime: "2 minutes",
          nutrition: "Fiber, healthy fats, protein",
          calories: 180,
          protein: "6g",
          carbs: "25g",
          fat: "8g",
          ingredients: [
            "1 medium apple, sliced",
            "2 tbsp natural peanut butter",
            "1 tbsp honey (optional)"
          ],
          instructions: [
            "Wash and slice apple",
            "Spread peanut butter on apple slices",
            "Drizzle with honey if desired",
            "Serve immediately"
          ],
          tips: "Use natural peanut butter without added sugar. Try almond butter for variety."
        },
        {
          name: "Greek Yogurt with Honey",
          cuisine: "Healthy",
          mealType: "snack",
          cookTime: "1 minute",
          nutrition: "Protein, probiotics, natural sweetness",
          calories: 150,
          protein: "15g",
          carbs: "18g",
          fat: "4g",
          ingredients: [
            "1 cup Greek yogurt",
            "1 tbsp honey",
            "1/4 cup granola (optional)"
          ],
          instructions: [
            "Scoop yogurt into a bowl",
            "Drizzle with honey",
            "Top with granola if desired",
            "Serve immediately"
          ],
          tips: "Use full-fat Greek yogurt for creamier texture. Add fresh fruit for extra nutrition."
        },
        {
          name: "Mixed Nuts (30g)",
          cuisine: "Healthy",
          mealType: "snack",
          cookTime: "0 minutes",
          nutrition: "Healthy fats, protein, minerals",
          calories: 180,
          protein: "6g",
          carbs: "8g",
          fat: "16g",
          ingredients: [
            "30g mixed nuts (almonds, walnuts, cashews)"
          ],
          instructions: [
            "Measure out 30g of mixed nuts",
            "Serve in a small bowl",
            "Enjoy as a healthy snack"
          ],
          tips: "Choose unsalted nuts for lower sodium. Store in an airtight container."
        },
        // Indulgent Snacks
        {
          name: "Chocolate Bar",
          cuisine: "Snack",
          mealType: "snack",
          cookTime: "0 minutes",
          nutrition: "Quick energy, mood boost",
          calories: 240,
          protein: "3g",
          carbs: "25g",
          fat: "14g",
          ingredients: [
            "1 chocolate bar (50g)"
          ],
          instructions: [
            "Unwrap chocolate bar",
            "Break into pieces",
            "Enjoy in moderation"
          ],
          tips: "Choose dark chocolate for antioxidants. Savor slowly for maximum enjoyment."
        },
        {
          name: "Crisps (30g packet)",
          cuisine: "Snack",
          mealType: "snack",
          cookTime: "0 minutes",
          nutrition: "Quick energy, satisfying crunch",
          calories: 150,
          protein: "2g",
          carbs: "18g",
          fat: "8g",
          ingredients: [
            "1 packet crisps (30g)"
          ],
          instructions: [
            "Open packet of crisps",
            "Pour into bowl or eat from packet",
            "Enjoy as a snack"
          ],
          tips: "Choose baked crisps for lower fat content. Pair with hummus for protein."
        }
      ]
    },
    london_favorites: {
      name: "London Favorites",
      meals: [
        {
          name: "Fish & Chips",
          cuisine: "British",
          mealType: "dinner",
          cookTime: "20 minutes",
          nutrition: "Protein, carbs, traditional British",
          calories: 850,
          protein: "35g",
          carbs: "80g",
          fat: "45g",
          ingredients: [
            "1 cod fillet",
            "1 cup flour",
            "1 cup beer",
            "2 large potatoes",
            "Vegetable oil for frying",
            "Salt and vinegar"
          ],
          instructions: [
            "Cut potatoes into chips and soak in cold water",
            "Mix flour and beer to make batter",
            "Heat oil to 375°F (190°C)",
            "Dip fish in batter and fry for 4-5 minutes",
            "Fry chips until golden and crispy",
            "Serve with salt and vinegar"
          ],
          tips: "Use a deep fryer for best results. Drain on paper towels to remove excess oil."
        },
        {
          name: "Burger & Fries",
          cuisine: "American",
          mealType: "dinner",
          cookTime: "15 minutes",
          nutrition: "Protein, carbs, satisfying meal",
          calories: 750,
          protein: "30g",
          carbs: "65g",
          fat: "35g",
          ingredients: [
            "1 beef patty",
            "1 burger bun",
            "1 slice cheese",
            "Lettuce and tomato",
            "French fries",
            "Ketchup and mustard"
          ],
          instructions: [
            "Grill beef patty to desired doneness",
            "Toast burger bun",
            "Add cheese to patty and let melt",
            "Assemble burger with lettuce and tomato",
            "Serve with fries and condiments"
          ],
          tips: "Use 80/20 ground beef for juicier burgers. Let patty rest before serving."
        }
      ]
    }
  };

  // Search and filter functionality
  const filteredMeals = useMemo(() => {
    let filtered = {};
    
    Object.entries(mealCategories).forEach(([key, category]) => {
      const filteredMeals = category.meals.filter(meal => {
        const matchesSearch = !searchTerm || 
          meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.nutrition.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
          );
        
        const matchesCuisine = selectedCuisine === 'all' || 
          meal.cuisine === selectedCuisine;
        
        const matchesMealType = selectedMealType === 'all' || 
          meal.mealType === selectedMealType;
        
        return matchesSearch && matchesCuisine && matchesMealType;
      });
      
      if (filteredMeals.length > 0) {
        filtered[key] = {
          ...category,
          meals: filteredMeals
        };
      }
    });
    
    return filtered;
  }, [searchTerm, selectedCuisine, selectedMealType]);

  const handleMealDrag = (e, meal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(meal));
  };

  const handleCustomMeal = (customMeal) => {
    toast.success('Custom meal added!');
    setShowCustomForm(false);
  };

  const toggleMealExpansion = (mealId) => {
    setExpandedMeal(expandedMeal === mealId ? null : mealId);
  };

  return (
    <motion.div
      className="meal-sidebar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sidebar-header">
        <h3>Suggested Meals</h3>
        <motion.button
          className="add-custom-btn"
          onClick={() => setShowCustomForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Custom
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="clear-search-btn"
          >
            X
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Cuisine:</label>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="filter-select"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine.value} value={cuisine.value}>
                {cuisine.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Meal Type:</label>
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="filter-select"
          >
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="meal-categories">
        {Object.entries(filteredMeals).map(([key, category]) => (
          <div key={key} className="meal-category">
            <h4 className="category-title">{category.name}</h4>
            <div className="meals-list">
              {category.meals.map((meal, index) => {
                const mealId = `${key}-${index}`;
                const isExpanded = expandedMeal === mealId;
                
                return (
                  <motion.div
                    key={index}
                    className="meal-item"
                    draggable
                    onDragStart={(e) => handleMealDrag(e, meal)}
                    onMouseEnter={() => setHoveredMeal(meal)}
                    onMouseLeave={() => setHoveredMeal(null)}
                    onTouchStart={() => setHoveredMeal(meal)}
                    onTouchEnd={() => setHoveredMeal(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="meal-header">
                      <div className="meal-name">{meal.name}</div>
                      <div className="meal-cuisine">{meal.cuisine}</div>
                      <div className="meal-cook-time">Time: {meal.cookTime}</div>
                      <div className="meal-calories">{meal.calories} cal</div>
                    </div>
                    
                    <div className="meal-actions">
                      <button
                        className="recipe-toggle-btn"
                        onClick={() => toggleMealExpansion(mealId)}
                      >
                        {isExpanded ? 'Hide Recipe' : 'Show Recipe'}
                      </button>
                    </div>

                    {/* Expanded Recipe Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="recipe-details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="recipe-section">
                            <h5>Ingredients:</h5>
                            <ul className="ingredients-list">
                              {meal.ingredients.map((ingredient, idx) => (
                                <li key={idx}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="recipe-section">
                            <h5>Instructions:</h5>
                            <ol className="instructions-list">
                              {meal.instructions.map((instruction, idx) => (
                                <li key={idx}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                          
                          <div className="recipe-section">
                            <h5>Tips:</h5>
                            <p className="recipe-tips">{meal.tips}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Meal Info Tooltip */}
      <AnimatePresence>
        {hoveredMeal && (
          <motion.div
            className="meal-tooltip"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <h4>{hoveredMeal.name}</h4>
            <div className="tooltip-section">
              <strong>Cuisine:</strong>
              <span>{hoveredMeal.cuisine}</span>
            </div>
            <div className="tooltip-section">
              <strong>Cook Time:</strong>
              <span>{hoveredMeal.cookTime}</span>
            </div>
            <div className="tooltip-section">
              <strong>Nutritional Benefits:</strong>
              <p>{hoveredMeal.nutrition}</p>
            </div>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{hoveredMeal.protein}</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{hoveredMeal.carbs}</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{hoveredMeal.fat}</span>
              </div>
            </div>
            <div className="tooltip-section">
              <strong>Quick Preview:</strong>
              <p>{hoveredMeal.ingredients.slice(0, 3).join(', ')}...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Meal Form */}
      <AnimatePresence>
        {showCustomForm && (
          <CustomMealForm
            onSubmit={handleCustomMeal}
            onClose={() => setShowCustomForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Custom Meal Form Component
const CustomMealForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    mealType: '',
    cookTime: '',
    nutrition: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: '',
    instructions: '',
    tips: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a meal name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.div
      className="custom-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="custom-form"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <h3>Add Custom Meal</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meal Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., My Special Pasta"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Cuisine</label>
              <select
                value={formData.cuisine}
                onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
              >
                <option value="">Select Cuisine</option>
                <option value="Western">Western</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Thai">Thai</option>
                <option value="Mexican">Mexican</option>
                <option value="Korean">Korean</option>
                <option value="Middle Eastern">Middle Eastern</option>
                <option value="British">British</option>
                <option value="American">American</option>
                <option value="Healthy">Healthy</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Meal Type</label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({...formData, mealType: e.target.value})}
              >
                <option value="">Select Type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Cook Time</label>
            <input
              type="text"
              value={formData.cookTime}
              onChange={(e) => setFormData({...formData, cookTime: e.target.value})}
              placeholder="e.g., 25 minutes"
            />
          </div>
          
          <div className="form-group">
            <label>Nutritional Benefits</label>
            <textarea
              value={formData.nutrition}
              onChange={(e) => setFormData({...formData, nutrition: e.target.value})}
              placeholder="Describe the nutritional benefits"
              rows="3"
            />
          </div>
          
          <div className="nutrition-inputs">
            <div className="form-row">
              <div className="form-group">
                <label>Calories</label>
                <input
                  type="text"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  placeholder="e.g., 350"
                />
              </div>
              
              <div className="form-group">
                <label>Protein (g)</label>
                <input
                  type="text"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  placeholder="e.g., 25g"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Carbs (g)</label>
                <input
                  type="text"
                  value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                  placeholder="e.g., 45g"
                />
              </div>
              
              <div className="form-group">
                <label>Fat (g)</label>
                <input
                  type="text"
                  value={formData.fat}
                  onChange={(e) => setFormData({...formData, fat: e.target.value})}
                  placeholder="e.g., 12g"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Ingredients (one per line)</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
              placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk"
              rows="5"
            />
          </div>
          
          <div className="form-group">
            <label>Instructions (one per line)</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              placeholder="Mix flour and eggs&#10;Add milk gradually&#10;Cook for 10 minutes"
              rows="5"
            />
          </div>
          
          <div className="form-group">
            <label>Cooking Tips</label>
            <textarea
              value={formData.tips}
              onChange={(e) => setFormData({...formData, tips: e.target.value})}
              placeholder="Share any helpful cooking tips"
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Meal
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MealSidebar;
