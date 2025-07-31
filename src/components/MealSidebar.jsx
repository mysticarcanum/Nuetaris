import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import FastNutritionService from '../services/fastNutrition.js';
import './MealSidebar.css';

const MealSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredMeal, setHoveredMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isEstimating, setIsEstimating] = useState(false);

  // Cuisine filter options
  const cuisines = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'Western', label: 'Western' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Italian', label: 'Italian' },
    { value: 'British', label: 'British' },
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

  // Enhanced search with AI suggestions
  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    
    if (value.length > 1) {
      try {
        const suggestions = await FastNutritionService.getMealSuggestions(value);
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Search suggestions failed:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  // Filter meals based on search and filters
  const filteredMeals = useMemo(() => {
    let meals = FastNutritionService.getAllMeals();
    
    // Apply cuisine filter
    if (selectedCuisine !== 'all') {
      meals = FastNutritionService.getMealsByCategory(selectedCuisine);
    }
    
    // Apply meal type filter
    if (selectedMealType !== 'all') {
      meals = meals.filter(meal => {
        const mealData = FastNutritionService.fuzzySearch(meal);
        return mealData && mealData.category === selectedMealType;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      meals = meals.filter(meal => 
        meal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return meals.slice(0, 20); // Limit to 20 results
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

  const handleMealClick = async (mealName) => {
    try {
      setIsEstimating(true);
      const nutrition = await FastNutritionService.estimateNutritionFromName(mealName);
      if (nutrition) {
        toast.success(`${mealName}: ${nutrition.calories} calories, ${nutrition.protein}g protein`);
        setExpandedMeal(expandedMeal === mealName ? null : mealName);
      }
    } catch (error) {
      toast.error('Could not get nutrition info');
    } finally {
      setIsEstimating(false);
    }
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

      {/* Enhanced Search with AI Suggestions */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search meals or type new meal name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchSuggestions([]);
            }}
            className="clear-search-btn"
          >
            X
          </button>
        )}
        
        {/* AI Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <div className="search-suggestions">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchTerm(suggestion);
                  setSearchSuggestions([]);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
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

      {/* Meals List */}
      <div className="meals-list">
        {filteredMeals.map((mealName, index) => {
          const mealData = FastNutritionService.fuzzySearch(mealName);
          return (
            <motion.div
              key={index}
              className="meal-item"
              draggable
              onDragStart={(e) => handleMealDrag(e, mealName)}
              onClick={() => handleMealClick(mealName)}
              onMouseEnter={() => setHoveredMeal(mealName)}
              onMouseLeave={() => setHoveredMeal(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="meal-header">
                <h4>{mealName}</h4>
                {mealData && (
                  <span className="meal-calories">{mealData.calories} cal</span>
                )}
              </div>
              
              {mealData && (
                <div className="meal-details">
                  <div className="nutrition-brief">
                    <span>P: {mealData.protein}g</span>
                    <span>C: {mealData.carbs}g</span>
                    <span>F: {mealData.fat}g</span>
                  </div>
                  
                  {expandedMeal === mealName && (
                    <motion.div
                      className="meal-expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="nutrition-details">
                        <div className="macro-breakdown">
                          <div className="macro-item">
                            <span className="macro-label">Protein</span>
                            <span className="macro-value">{mealData.protein}g</span>
                          </div>
                          <div className="macro-item">
                            <span className="macro-label">Carbs</span>
                            <span className="macro-value">{mealData.carbs}g</span>
                          </div>
                          <div className="macro-item">
                            <span className="macro-label">Fat</span>
                            <span className="macro-value">{mealData.fat}g</span>
                          </div>
                          <div className="macro-item">
                            <span className="macro-label">Fiber</span>
                            <span className="macro-value">{mealData.fiber}g</span>
                          </div>
                        </div>
                        
                        <div className="meal-info">
                          <p><strong>Cook Time:</strong> {mealData.cookTime}</p>
                          <p><strong>Nutrition:</strong> {mealData.nutrition}</p>
                        </div>
                        
                        {mealData.tips && (
                          <div className="meal-tips">
                            <p><strong>Tips:</strong> {mealData.tips}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

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
    sugar: '',
    fiber: '',
    sodium: '',
    saturatedFat: '',
    cholesterol: '',
    potassium: '',
    vitaminC: '',
    calcium: '',
    iron: '',
    ingredients: '',
    instructions: '',
    tips: ''
  });
  const [isEstimating, setIsEstimating] = useState(false);

  const handleMealNameChange = async (mealName) => {
    setFormData(prev => ({ ...prev, name: mealName }));
    
    if (mealName.length > 2) {
      setIsEstimating(true);
      try {
        const nutrition = await FastNutritionService.estimateNutritionFromName(mealName);
        if (nutrition) {
          setFormData(prev => ({
            ...prev,
            name: mealName,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            sugar: nutrition.sugar,
            fiber: nutrition.fiber,
            sodium: nutrition.sodium,
            saturatedFat: nutrition.saturatedFat,
            cholesterol: nutrition.cholesterol,
            potassium: nutrition.potassium,
            vitaminC: nutrition.vitaminC,
            calcium: nutrition.calcium,
            iron: nutrition.iron,
            ingredients: Array.isArray(nutrition.ingredients) 
              ? nutrition.ingredients.join('\n') 
              : nutrition.ingredients,
            instructions: Array.isArray(nutrition.instructions) 
              ? nutrition.instructions.join('\n') 
              : nutrition.instructions,
            tips: nutrition.tips,
            cookTime: nutrition.cookTime,
            nutrition: nutrition.nutrition
          }));
          toast.success('Nutrition estimated from meal name!');
        }
      } catch (error) {
        toast.error('Could not estimate nutrition');
      } finally {
        setIsEstimating(false);
      }
    }
  };

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
              onChange={(e) => handleMealNameChange(e.target.value)}
              placeholder="e.g., My Special Pasta"
              required
            />
            {isEstimating && (
              <div className="ai-estimation-indicator">
                <div className="ai-spinner"></div>
                <span>Analyzing "{formData.name}"...</span>
              </div>
            )}
          </div>
          
          {/* AI Estimation Status */}
          {formData.calories && (
            <div className="ai-estimation-success">
              <span>✓ Nutrition estimated</span>
              <button 
                type="button"
                onClick={() => setFormData({ name: formData.name })}
                className="clear-estimation-btn"
              >
                Clear & Start Over
              </button>
            </div>
          )}
          
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
