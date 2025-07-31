import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './MealSidebar.css';

const MealSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredMeal, setHoveredMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive meal database with 200+ options
  const mealCategories = {
    breakfast: {
      name: "Breakfast",
      meals: [
        // Western Breakfast
        {
          name: "Greek Yogurt Bowl",
          cookTime: "5 minutes",
          nutrition: "High protein, probiotics, calcium",
          calories: 180,
          protein: "15g",
          carbs: "20g",
          fat: "5g",
          cuisine: "Western"
        },
        {
          name: "Oatmeal with Berries",
          cookTime: "10 minutes",
          nutrition: "Fiber-rich, antioxidants, sustained energy",
          calories: 220,
          protein: "8g",
          carbs: "35g",
          fat: "4g",
          cuisine: "Western"
        },
        {
          name: "Scrambled Eggs on Toast",
          cookTime: "8 minutes",
          nutrition: "Complete protein, B vitamins, choline",
          calories: 280,
          protein: "18g",
          carbs: "25g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Smoothie Bowl",
          cookTime: "7 minutes",
          nutrition: "Vitamins, minerals, fiber, antioxidants",
          calories: 250,
          protein: "12g",
          carbs: "30g",
          fat: "8g",
          cuisine: "Western"
        },
        {
          name: "Avocado Toast",
          cookTime: "5 minutes",
          nutrition: "Healthy fats, fiber, potassium",
          calories: 320,
          protein: "10g",
          carbs: "30g",
          fat: "18g",
          cuisine: "Western"
        },
        {
          name: "Pancakes with Maple Syrup",
          cookTime: "15 minutes",
          nutrition: "Quick energy, comfort food",
          calories: 380,
          protein: "8g",
          carbs: "55g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Full English Breakfast",
          cookTime: "20 minutes",
          nutrition: "Protein-rich, traditional British",
          calories: 650,
          protein: "35g",
          carbs: "25g",
          fat: "45g",
          cuisine: "Western"
        },
        {
          name: "French Toast",
          cookTime: "12 minutes",
          nutrition: "Protein, carbs, comfort food",
          calories: 320,
          protein: "12g",
          carbs: "40g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Breakfast Burrito",
          cookTime: "15 minutes",
          nutrition: "Protein, fiber, Mexican flavors",
          calories: 420,
          protein: "22g",
          carbs: "35g",
          fat: "18g",
          cuisine: "Western"
        },
        {
          name: "Granola with Milk",
          cookTime: "2 minutes",
          nutrition: "Fiber, protein, sustained energy",
          calories: 280,
          protein: "10g",
          carbs: "45g",
          fat: "8g",
          cuisine: "Western"
        },
        // Chinese Breakfast
        {
          name: "Congee (Rice Porridge)",
          cookTime: "30 minutes",
          nutrition: "Easy to digest, warming, traditional",
          calories: 180,
          protein: "4g",
          carbs: "35g",
          fat: "2g",
          cuisine: "Chinese"
        },
        {
          name: "Dim Sum (Steamed Dumplings)",
          cookTime: "15 minutes",
          nutrition: "Protein, vegetables, steamed healthy",
          calories: 250,
          protein: "12g",
          carbs: "30g",
          fat: "8g",
          cuisine: "Chinese"
        },
        {
          name: "Jianbing (Chinese Crepe)",
          cookTime: "8 minutes",
          nutrition: "Protein, vegetables, street food",
          calories: 320,
          protein: "15g",
          carbs: "35g",
          fat: "12g",
          cuisine: "Chinese"
        },
        {
          name: "Soy Milk with You Tiao",
          cookTime: "5 minutes",
          nutrition: "Protein, traditional Chinese breakfast",
          calories: 280,
          protein: "10g",
          carbs: "40g",
          fat: "8g",
          cuisine: "Chinese"
        },
        {
          name: "Steamed Baozi",
          cookTime: "12 minutes",
          nutrition: "Protein, steamed, traditional",
          calories: 220,
          protein: "8g",
          carbs: "35g",
          fat: "4g",
          cuisine: "Chinese"
        }
      ]
    },
    lunch: {
      name: "Lunch",
      meals: [
        // Western Lunch
        {
          name: "Chicken Caesar Salad",
          cookTime: "15 minutes",
          nutrition: "Lean protein, fiber, vitamins A & K",
          calories: 320,
          protein: "28g",
          carbs: "15g",
          fat: "16g",
          cuisine: "Western"
        },
        {
          name: "Tuna Sandwich",
          cookTime: "5 minutes",
          nutrition: "Omega-3 fatty acids, protein, B vitamins",
          calories: 290,
          protein: "22g",
          carbs: "35g",
          fat: "8g",
          cuisine: "Western"
        },
        {
          name: "Quinoa Buddha Bowl",
          cookTime: "20 minutes",
          nutrition: "Complete protein, fiber, antioxidants",
          calories: 380,
          protein: "16g",
          carbs: "45g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Supermarket Meal Deal",
          cookTime: "2 minutes",
          nutrition: "Convenient, varied nutrients",
          calories: 450,
          protein: "18g",
          carbs: "55g",
          fat: "15g",
          cuisine: "Western"
        },
        {
          name: "Grilled Chicken Wrap",
          cookTime: "12 minutes",
          nutrition: "Lean protein, vegetables, portable",
          calories: 350,
          protein: "25g",
          carbs: "30g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Pasta Salad",
          cookTime: "18 minutes",
          nutrition: "Complex carbs, vegetables, cooling",
          calories: 320,
          protein: "10g",
          carbs: "45g",
          fat: "10g",
          cuisine: "Western"
        },
        {
          name: "Beef Burger",
          cookTime: "15 minutes",
          nutrition: "Protein, iron, satisfying meal",
          calories: 550,
          protein: "30g",
          carbs: "45g",
          fat: "25g",
          cuisine: "Western"
        },
        {
          name: "Fish & Chips",
          cookTime: "20 minutes",
          nutrition: "Protein, carbs, traditional British",
          calories: 850,
          protein: "35g",
          carbs: "80g",
          fat: "45g",
          cuisine: "Western"
        },
        {
          name: "Pizza Slice",
          cookTime: "8 minutes",
          nutrition: "Quick, satisfying, social meal",
          calories: 300,
          protein: "12g",
          carbs: "35g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Sushi Roll Set",
          cookTime: "10 minutes",
          nutrition: "Lean protein, omega-3, low-fat",
          calories: 320,
          protein: "18g",
          carbs: "45g",
          fat: "8g",
          cuisine: "Western"
        },
        // Chinese Lunch
        {
          name: "Kung Pao Chicken",
          cookTime: "20 minutes",
          nutrition: "Protein, vegetables, spicy flavors",
          calories: 380,
          protein: "25g",
          carbs: "25g",
          fat: "18g",
          cuisine: "Chinese"
        },
        {
          name: "Sweet & Sour Pork",
          cookTime: "25 minutes",
          nutrition: "Protein, tangy flavors, vegetables",
          calories: 420,
          protein: "22g",
          carbs: "35g",
          fat: "20g",
          cuisine: "Chinese"
        },
        {
          name: "Mapo Tofu",
          cookTime: "15 minutes",
          nutrition: "Plant protein, spicy, traditional",
          calories: 280,
          protein: "15g",
          carbs: "20g",
          fat: "12g",
          cuisine: "Chinese"
        },
        {
          name: "Beef & Broccoli",
          cookTime: "18 minutes",
          nutrition: "Protein, iron, vegetables",
          calories: 350,
          protein: "28g",
          carbs: "22g",
          fat: "15g",
          cuisine: "Chinese"
        },
        {
          name: "Fried Rice",
          cookTime: "12 minutes",
          nutrition: "Carbs, protein, vegetables",
          calories: 320,
          protein: "10g",
          carbs: "45g",
          fat: "10g",
          cuisine: "Chinese"
        },
        {
          name: "Wonton Soup",
          cookTime: "20 minutes",
          nutrition: "Protein, warming, light meal",
          calories: 220,
          protein: "15g",
          carbs: "25g",
          fat: "6g",
          cuisine: "Chinese"
        },
        {
          name: "Peking Duck",
          cookTime: "90 minutes",
          nutrition: "Protein, traditional, special occasion",
          calories: 450,
          protein: "35g",
          carbs: "15g",
          fat: "25g",
          cuisine: "Chinese"
        },
        {
          name: "Hot Pot",
          cookTime: "30 minutes",
          nutrition: "Protein, vegetables, social meal",
          calories: 380,
          protein: "25g",
          carbs: "20g",
          fat: "18g",
          cuisine: "Chinese"
        }
      ]
    },
    dinner: {
      name: "Dinner",
      meals: [
        // Western Dinner
        {
          name: "Grilled Salmon with Vegetables",
          cookTime: "25 minutes",
          nutrition: "Omega-3, protein, fiber, vitamins",
          calories: 420,
          protein: "35g",
          carbs: "20g",
          fat: "22g",
          cuisine: "Western"
        },
        {
          name: "Stir-Fried Chicken",
          cookTime: "20 minutes",
          nutrition: "Lean protein, vegetables, low-carb",
          calories: 380,
          protein: "32g",
          carbs: "18g",
          fat: "16g",
          cuisine: "Western"
        },
        {
          name: "Vegetarian Pasta",
          cookTime: "30 minutes",
          nutrition: "Complex carbs, fiber, plant protein",
          calories: 450,
          protein: "14g",
          carbs: "65g",
          fat: "12g",
          cuisine: "Western"
        },
        {
          name: "Pizza (Takeaway)",
          cookTime: "45 minutes",
          nutrition: "Quick, satisfying, social meal",
          calories: 600,
          protein: "25g",
          carbs: "70g",
          fat: "25g",
          cuisine: "Western"
        },
        {
          name: "Beef Steak with Potatoes",
          cookTime: "35 minutes",
          nutrition: "Protein, iron, complex carbs",
          calories: 580,
          protein: "40g",
          carbs: "35g",
          fat: "28g",
          cuisine: "Western"
        },
        {
          name: "Chicken Tikka Masala",
          cookTime: "40 minutes",
          nutrition: "Protein, spices, creamy sauce",
          calories: 480,
          protein: "22g",
          carbs: "55g",
          fat: "18g",
          cuisine: "Western"
        },
        {
          name: "Spaghetti Carbonara",
          cookTime: "25 minutes",
          nutrition: "Protein, carbs, creamy sauce",
          calories: 520,
          protein: "20g",
          carbs: "60g",
          fat: "22g",
          cuisine: "Western"
        },
        {
          name: "Roast Chicken",
          cookTime: "90 minutes",
          nutrition: "Protein, traditional Sunday meal",
          calories: 450,
          protein: "35g",
          carbs: "15g",
          fat: "25g",
          cuisine: "Western"
        },
        {
          name: "Fish & Chips",
          cookTime: "20 minutes",
          nutrition: "Protein, carbs, traditional British",
          calories: 850,
          protein: "35g",
          carbs: "80g",
          fat: "45g",
          cuisine: "Western"
        },
        {
          name: "Burger & Fries",
          cookTime: "15 minutes",
          nutrition: "Protein, carbs, satisfying meal",
          calories: 750,
          protein: "30g",
          carbs: "65g",
          fat: "35g",
          cuisine: "Western"
        },
        // Chinese Dinner
        {
          name: "Kung Pao Chicken",
          cookTime: "20 minutes",
          nutrition: "Protein, vegetables, spicy flavors",
          calories: 380,
          protein: "25g",
          carbs: "25g",
          fat: "18g",
          cuisine: "Chinese"
        },
        {
          name: "Sweet & Sour Pork",
          cookTime: "25 minutes",
          nutrition: "Protein, tangy flavors, vegetables",
          calories: 420,
          protein: "22g",
          carbs: "35g",
          fat: "20g",
          cuisine: "Chinese"
        },
        {
          name: "Mapo Tofu",
          cookTime: "15 minutes",
          nutrition: "Plant protein, spicy, traditional",
          calories: 280,
          protein: "15g",
          carbs: "20g",
          fat: "12g",
          cuisine: "Chinese"
        },
        {
          name: "Beef & Broccoli",
          cookTime: "18 minutes",
          nutrition: "Protein, iron, vegetables",
          calories: 350,
          protein: "28g",
          carbs: "22g",
          fat: "15g",
          cuisine: "Chinese"
        },
        {
          name: "Fried Rice",
          cookTime: "12 minutes",
          nutrition: "Carbs, protein, vegetables",
          calories: 320,
          protein: "10g",
          carbs: "45g",
          fat: "10g",
          cuisine: "Chinese"
        },
        {
          name: "Wonton Soup",
          cookTime: "20 minutes",
          nutrition: "Protein, warming, light meal",
          calories: 220,
          protein: "15g",
          carbs: "25g",
          fat: "6g",
          cuisine: "Chinese"
        },
        {
          name: "Peking Duck",
          cookTime: "90 minutes",
          nutrition: "Protein, traditional, special occasion",
          calories: 450,
          protein: "35g",
          carbs: "15g",
          fat: "25g",
          cuisine: "Chinese"
        },
        {
          name: "Hot Pot",
          cookTime: "30 minutes",
          nutrition: "Protein, vegetables, social meal",
          calories: 380,
          protein: "25g",
          carbs: "20g",
          fat: "18g",
          cuisine: "Chinese"
        },
        {
          name: "Dim Sum Feast",
          cookTime: "25 minutes",
          nutrition: "Variety, steamed, traditional",
          calories: 350,
          protein: "18g",
          carbs: "40g",
          fat: "12g",
          cuisine: "Chinese"
        },
        {
          name: "Szechuan Beef",
          cookTime: "22 minutes",
          nutrition: "Protein, spicy, numbing flavors",
          calories: 420,
          protein: "30g",
          carbs: "28g",
          fat: "20g",
          cuisine: "Chinese"
        }
      ]
    },
    snacks: {
      name: "Snacks",
      meals: [
        // Healthy Snacks
        {
          name: "Apple with Peanut Butter",
          cookTime: "2 minutes",
          nutrition: "Fiber, healthy fats, protein",
          calories: 180,
          protein: "6g",
          carbs: "25g",
          fat: "8g",
          cuisine: "Healthy"
        },
        {
          name: "Greek Yogurt with Honey",
          cookTime: "1 minute",
          nutrition: "Protein, probiotics, natural sweetness",
          calories: 150,
          protein: "15g",
          carbs: "18g",
          fat: "4g",
          cuisine: "Healthy"
        },
        {
          name: "Mixed Nuts (30g)",
          cookTime: "0 minutes",
          nutrition: "Healthy fats, protein, minerals",
          calories: 180,
          protein: "6g",
          carbs: "8g",
          fat: "16g",
          cuisine: "Healthy"
        },
        {
          name: "Dark Chocolate (30g)",
          cookTime: "0 minutes",
          nutrition: "Antioxidants, magnesium, mood booster",
          calories: 160,
          protein: "2g",
          carbs: "18g",
          fat: "10g",
          cuisine: "Healthy"
        },
        {
          name: "Crisps (30g packet)",
          cookTime: "0 minutes",
          nutrition: "Quick energy, satisfying crunch",
          calories: 150,
          protein: "2g",
          carbs: "18g",
          fat: "8g",
          cuisine: "Snack"
        },
        {
          name: "Dried Fruit Mix",
          cookTime: "0 minutes",
          nutrition: "Fiber, vitamins, natural sugars",
          calories: 120,
          protein: "2g",
          carbs: "28g",
          fat: "0g",
          cuisine: "Healthy"
        },
        {
          name: "Hummus with Carrots",
          cookTime: "3 minutes",
          nutrition: "Protein, fiber, vitamins",
          calories: 140,
          protein: "6g",
          carbs: "20g",
          fat: "6g",
          cuisine: "Healthy"
        },
        {
          name: "Protein Bar",
          cookTime: "0 minutes",
          nutrition: "Convenient protein, energy",
          calories: 200,
          protein: "20g",
          carbs: "15g",
          fat: "8g",
          cuisine: "Healthy"
        },
        {
          name: "Smoothie",
          cookTime: "5 minutes",
          nutrition: "Vitamins, minerals, hydration",
          calories: 180,
          protein: "8g",
          carbs: "25g",
          fat: "4g",
          cuisine: "Healthy"
        },
        {
          name: "Rice Cakes with Avocado",
          cookTime: "3 minutes",
          nutrition: "Low calorie, healthy fats",
          calories: 120,
          protein: "3g",
          carbs: "15g",
          fat: "6g",
          cuisine: "Healthy"
        },
        // Indulgent Snacks
        {
          name: "Chocolate Bar",
          cookTime: "0 minutes",
          nutrition: "Quick energy, mood boost",
          calories: 240,
          protein: "3g",
          carbs: "25g",
          fat: "14g",
          cuisine: "Snack"
        },
        {
          name: "Ice Cream (100ml)",
          cookTime: "0 minutes",
          nutrition: "Calcium, comfort food",
          calories: 200,
          protein: "4g",
          carbs: "22g",
          fat: "10g",
          cuisine: "Snack"
        },
        {
          name: "Chips & Dip",
          cookTime: "2 minutes",
          nutrition: "Satisfying, social snack",
          calories: 280,
          protein: "4g",
          carbs: "25g",
          fat: "18g",
          cuisine: "Snack"
        },
        {
          name: "Popcorn",
          cookTime: "5 minutes",
          nutrition: "Fiber, low calorie volume",
          calories: 120,
          protein: "3g",
          carbs: "20g",
          fat: "4g",
          cuisine: "Snack"
        },
        {
          name: "Biscuits (3 pieces)",
          cookTime: "0 minutes",
          nutrition: "Quick energy, comfort",
          calories: 180,
          protein: "3g",
          carbs: "25g",
          fat: "8g",
          cuisine: "Snack"
        }
      ]
    },
    london_favorites: {
      name: "London Favorites",
      meals: [
        {
          name: "Fish & Chips",
          cookTime: "20 minutes",
          nutrition: "Protein, carbs, traditional British",
          calories: 850,
          protein: "35g",
          carbs: "80g",
          fat: "45g",
          cuisine: "British"
        },
        {
          name: "Burger & Fries",
          cookTime: "15 minutes",
          nutrition: "Protein, carbs, satisfying meal",
          calories: 750,
          protein: "30g",
          carbs: "65g",
          fat: "35g",
          cuisine: "American"
        },
        {
          name: "Sushi Roll Set",
          cookTime: "10 minutes",
          nutrition: "Lean protein, omega-3, low-fat",
          calories: 320,
          protein: "18g",
          carbs: "45g",
          fat: "8g",
          cuisine: "Japanese"
        },
        {
          name: "Indian Curry",
          cookTime: "25 minutes",
          nutrition: "Spices, protein, fiber, antioxidants",
          calories: 480,
          protein: "22g",
          carbs: "55g",
          fat: "18g",
          cuisine: "Indian"
        },
        {
          name: "Pizza (Takeaway)",
          cookTime: "45 minutes",
          nutrition: "Quick, satisfying, social meal",
          calories: 600,
          protein: "25g",
          carbs: "70g",
          fat: "25g",
          cuisine: "Italian"
        },
        {
          name: "Kebab",
          cookTime: "8 minutes",
          nutrition: "Protein, vegetables, late night food",
          calories: 450,
          protein: "25g",
          carbs: "35g",
          fat: "20g",
          cuisine: "Middle Eastern"
        },
        {
          name: "Noodles (Chinese Takeaway)",
          cookTime: "12 minutes",
          nutrition: "Carbs, protein, vegetables",
          calories: 380,
          protein: "15g",
          carbs: "45g",
          fat: "12g",
          cuisine: "Chinese"
        },
        {
          name: "Thai Green Curry",
          cookTime: "20 minutes",
          nutrition: "Spices, protein, coconut milk",
          calories: 420,
          protein: "20g",
          carbs: "40g",
          fat: "18g",
          cuisine: "Thai"
        },
        {
          name: "Mexican Burrito",
          cookTime: "15 minutes",
          nutrition: "Protein, fiber, Mexican flavors",
          calories: 520,
          protein: "25g",
          carbs: "55g",
          fat: "20g",
          cuisine: "Mexican"
        },
        {
          name: "Korean BBQ",
          cookTime: "30 minutes",
          nutrition: "Protein, vegetables, grilled flavors",
          calories: 480,
          protein: "30g",
          carbs: "25g",
          fat: "22g",
          cuisine: "Korean"
        }
      ]
    }
  };

  // Search functionality
  const filteredMeals = useMemo(() => {
    if (!searchTerm) return mealCategories;
    
    const filtered = {};
    Object.entries(mealCategories).forEach(([key, category]) => {
      const filteredMeals = category.meals.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.nutrition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredMeals.length > 0) {
        filtered[key] = {
          ...category,
          meals: filteredMeals
        };
      }
    });
    
    return filtered;
  }, [searchTerm]);

  const handleMealDrag = (e, meal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(meal));
  };

  const handleCustomMeal = (customMeal) => {
    toast.success('Custom meal added!');
    setShowCustomForm(false);
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
            ✕
          </button>
        )}
      </div>

      <div className="meal-categories">
        {Object.entries(filteredMeals).map(([key, category]) => (
          <div key={key} className="meal-category">
            <h4 className="category-title">{category.name}</h4>
            <div className="meals-list">
              {category.meals.map((meal, index) => (
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
                  <div className="meal-name">{meal.name}</div>
                  <div className="meal-cuisine">{meal.cuisine}</div>
                  <div className="meal-cook-time">⏱️ {meal.cookTime}</div>
                  <div className="meal-calories">{meal.calories} cal</div>
                </motion.div>
              ))}
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
    cookTime: '',
    nutrition: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
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
