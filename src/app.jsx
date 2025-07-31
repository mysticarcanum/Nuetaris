import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProfileSelection from './components/ProfileSelection';
import CharacterCreation from './components/CharacterCreation';
import Dashboard from './components/Dashboard';
import CircularGallery from './components/CircularGallery';
import MealSidebar from './components/MealSidebar';
import WorkoutSidebar from './components/WorkoutSidebar';
import { gsap } from 'gsap';

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showProfileSelection, setShowProfileSelection] = useState(true);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [galleryLink, setGalleryLink] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [dailyWorkouts, setDailyWorkouts] = useState([]);
  const [showMealSidebar, setShowMealSidebar] = useState(true);
  const [showWorkoutSidebar, setShowWorkoutSidebar] = useState(true);

  // Load profiles and settings from cookies on mount
  useEffect(() => {
    const savedProfiles = Cookies.get('neutaris_profiles');
    const savedCurrentProfile = Cookies.get('neutaris_current_profile');
    const savedGalleryLink = Cookies.get('neutaris_gallery_link');
    const savedDailyNutrition = Cookies.get('neutaris_daily_nutrition');
    const savedDailyWorkouts = Cookies.get('neutaris_daily_workouts');

    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Error parsing saved profiles:', error);
      }
    }

    if (savedCurrentProfile) {
      try {
        const profile = JSON.parse(savedCurrentProfile);
        setCurrentProfile(profile);
        setShowProfileSelection(false);
      } catch (error) {
        console.error('Error parsing current profile:', error);
      }
    }

    if (savedGalleryLink) {
      setGalleryLink(savedGalleryLink);
    }

    if (savedDailyNutrition) {
      try {
        setDailyNutrition(JSON.parse(savedDailyNutrition));
      } catch (error) {
        console.error('Error parsing daily nutrition:', error);
      }
    }

    if (savedDailyWorkouts) {
      try {
        setDailyWorkouts(JSON.parse(savedDailyWorkouts));
      } catch (error) {
        console.error('Error parsing daily workouts:', error);
      }
    }
  }, []);

  // Save profiles to cookies whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      Cookies.set('neutaris_profiles', JSON.stringify(profiles), { expires: 365 });
    }
  }, [profiles]);

  // Save current profile to cookies whenever it changes
  useEffect(() => {
    if (currentProfile) {
      Cookies.set('neutaris_current_profile', JSON.stringify(currentProfile), { expires: 365 });
    }
  }, [currentProfile]);

  // Save gallery link to cookies whenever it changes
  useEffect(() => {
    if (galleryLink) {
      Cookies.set('neutaris_gallery_link', galleryLink, { expires: 365 });
    }
  }, [galleryLink]);

  // Save daily nutrition to cookies whenever it changes
  useEffect(() => {
    if (dailyNutrition.calories > 0) {
      Cookies.set('neutaris_daily_nutrition', JSON.stringify(dailyNutrition), { expires: 1 });
    }
  }, [dailyNutrition]);

  // Save daily workouts to cookies whenever they change
  useEffect(() => {
    if (dailyWorkouts.length > 0) {
      Cookies.set('neutaris_daily_workouts', JSON.stringify(dailyWorkouts), { expires: 1 });
    }
  }, [dailyWorkouts]);

  const handleProfileSelect = (profile) => {
    setCurrentProfile(profile);
    setShowProfileSelection(false);

    // Animate the transition
    gsap.fromTo('.main-content',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  };

  const handleCreateProfile = () => {
    setShowCharacterCreation(true);
  };

  const handleProfileCreated = (newProfile) => {
    const profileWithId = {
      ...newProfile,
      id: Date.now().toString()
    };

    setProfiles([...profiles, profileWithId]);
    setCurrentProfile(profileWithId);
    setShowCharacterCreation(false);
    setShowProfileSelection(false);
  };

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);

    // If the deleted profile was the current one, switch to another or show selection
    if (currentProfile && currentProfile.id === profileId) {
      if (updatedProfiles.length > 0) {
        setCurrentProfile(updatedProfiles[0]);
      } else {
        setCurrentProfile(null);
        setShowProfileSelection(true);
      }
    }
  };

  const handleSwitchProfile = () => {
    setShowProfileSelection(true);
  };

  const handleGalleryLinkChange = (link) => {
    setGalleryLink(link);
  };

  // Handle meal selection from MealSidebar
  const handleMealSelect = (mealData) => {
    setSelectedMeal(mealData);
    
    // Update daily nutrition totals
    setDailyNutrition(prev => ({
      calories: prev.calories + (mealData.calories || 0),
      protein: prev.protein + (mealData.protein || 0),
      carbs: prev.carbs + (mealData.carbs || 0),
      fat: prev.fat + (mealData.fat || 0),
      fiber: prev.fiber + (mealData.fiber || 0)
    }));
  };

  // Handle workout selection from WorkoutSidebar
  const handleWorkoutSelect = (workoutData) => {
    setSelectedWorkout(workoutData);
    
    // Add workout to daily workouts if not already present
    const workoutExists = dailyWorkouts.some(workout => workout.name === workoutData.name);
    if (!workoutExists) {
      setDailyWorkouts(prev => [...prev, {
        ...workoutData,
        completed: false,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Toggle workout completion
  const toggleWorkoutCompletion = (workoutName) => {
    setDailyWorkouts(prev => 
      prev.map(workout => 
        workout.name === workoutName 
          ? { ...workout, completed: !workout.completed }
          : workout
      )
    );
  };

  // Reset daily nutrition (call this at midnight or when needed)
  const resetDailyNutrition = () => {
    setDailyNutrition({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
    Cookies.remove('neutaris_daily_nutrition');
  };

  // Reset daily workouts
  const resetDailyWorkouts = () => {
    setDailyWorkouts([]);
    Cookies.remove('neutaris_daily_workouts');
  };

  // Get welcome message based on profile
  const getWelcomeMessage = () => {
    if (currentProfile) {
      const remembered = Cookies.get('neutaris_remembered_user');
      if (remembered) {
        return `Hello ${currentProfile.name}!`;
      }
      return `Hello ${currentProfile.name}`;
    }
    return "Hello";
  };

  // Calculate total calories burned from completed workouts
  const getTotalCaloriesBurned = () => {
    return dailyWorkouts
      .filter(workout => workout.completed)
      .reduce((total, workout) => total + (workout.calories || 0), 0);
  };

  // Calculate net calories (consumed - burned)
  const getNetCalories = () => {
    return dailyNutrition.calories - getTotalCaloriesBurned();
  };

  if (showProfileSelection) {
    return (
      <div className="app">
        <ProfileSelection
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      </div>
    );
  }

  if (showCharacterCreation) {
    return (
      <div className="app">
        <CharacterCreation onProfileCreated={handleProfileCreated} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="welcome-section">
            <motion.h1 
              className="welcome-message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "power3.out" }}
            >
              {getWelcomeMessage()}
            </motion.h1>
            <motion.button
              className="switch-profile-btn"
              onClick={handleSwitchProfile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Switch Profile
            </motion.button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Daily Summary Section */}
          {(dailyNutrition.calories > 0 || dailyWorkouts.length > 0) && (
            <section className="daily-summary">
              <h3>Today's Summary</h3>
              
              {/* Nutrition Summary */}
              {dailyNutrition.calories > 0 && (
                <div className="nutrition-summary">
                  <h4>Nutrition</h4>
                  <div className="nutrition-stats">
                    <div className="nutrition-stat">
                      <span className="stat-label">Calories</span>
                      <span className="stat-value">{dailyNutrition.calories}</span>
                    </div>
                    <div className="nutrition-stat">
                      <span className="stat-label">Protein</span>
                      <span className="stat-value">{dailyNutrition.protein}g</span>
                    </div>
                    <div className="nutrition-stat">
                      <span className="stat-label">Carbs</span>
                      <span className="stat-value">{dailyNutrition.carbs}g</span>
                    </div>
                    <div className="nutrition-stat">
                      <span className="stat-label">Fat</span>
                      <span className="stat-value">{dailyNutrition.fat}g</span>
                    </div>
                    <div className="nutrition-stat">
                      <span className="stat-label">Fiber</span>
                      <span className="stat-value">{dailyNutrition.fiber}g</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Workout Summary */}
              {dailyWorkouts.length > 0 && (
                <div className="workout-summary">
                  <h4>Workouts</h4>
                  <div className="workout-stats">
                    <div className="workout-stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">
                        {dailyWorkouts.filter(w => w.completed).length}/{dailyWorkouts.length}
                      </span>
                    </div>
                    <div className="workout-stat">
                      <span className="stat-label">Calories Burned</span>
                      <span className="stat-value">{getTotalCaloriesBurned()}</span>
                    </div>
                    <div className="workout-stat">
                      <span className="stat-label">Net Calories</span>
                      <span className={`stat-value ${getNetCalories() < 0 ? 'negative' : 'positive'}`}>
                        {getNetCalories()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset Buttons */}
              <div className="reset-buttons">
                <button 
                  className="reset-btn"
                  onClick={resetDailyNutrition}
                >
                  Reset Nutrition
                </button>
                <button 
                  className="reset-btn"
                  onClick={resetDailyWorkouts}
                >
                  Reset Workouts
                </button>
              </div>
            </section>
          )}

          {/* Main Content Layout */}
          <div className="main-layout">
            {/* Left Sidebar - Workout Sidebar */}
            <div className="left-sidebar">
              {showWorkoutSidebar && (
                <WorkoutSidebar 
                  onWorkoutSelect={handleWorkoutSelect}
                  selectedWorkout={selectedWorkout}
                />
              )}
            </div>

            {/* Center Content - Dashboard */}
            <div className="center-content">
              <Dashboard
                currentProfile={currentProfile}
                galleryLink={galleryLink}
                onGalleryLinkChange={handleGalleryLinkChange}
                selectedMeal={selectedMeal}
                selectedWorkout={selectedWorkout}
                dailyWorkouts={dailyWorkouts}
                onToggleWorkoutCompletion={toggleWorkoutCompletion}
              />
            </div>

            {/* Right Sidebar - Meal Sidebar */}
            <div className="right-sidebar">
              {showMealSidebar && (
                <MealSidebar 
                  onMealSelect={handleMealSelect}
                  selectedMeal={selectedMeal}
                />
              )}
            </div>
          </div>

          {/* Selected Items Details */}
          {(selectedMeal || selectedWorkout) && (
            <section className="selected-items-details">
              {selectedMeal && (
                <div className="selected-meal-details">
                  <h3>Selected Meal: {selectedMeal.name}</h3>
                  <div className="meal-details-grid">
                    <div className="meal-nutrition">
                      <h4>Nutrition</h4>
                      <div className="nutrition-grid">
                        <span>Calories: {selectedMeal.calories}</span>
                        <span>Protein: {selectedMeal.protein}g</span>
                        <span>Carbs: {selectedMeal.carbs}g</span>
                        <span>Fat: {selectedMeal.fat}g</span>
                        <span>Fiber: {selectedMeal.fiber}g</span>
                      </div>
                    </div>
                    {selectedMeal.ingredients && (
                      <div className="meal-ingredients">
                        <h4>Ingredients</h4>
                        <ul>
                          {Array.isArray(selectedMeal.ingredients) 
                            ? selectedMeal.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                              ))
                            : <li>{selectedMeal.ingredients}</li>
                          }
                        </ul>
                      </div>
                    )}
                    {selectedMeal.instructions && (
                      <div className="meal-instructions">
                        <h4>Instructions</h4>
                        <ol>
                          {Array.isArray(selectedMeal.instructions)
                            ? selectedMeal.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                              ))
                            : <li>{selectedMeal.instructions}</li>
                          }
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedWorkout && (
                <div className="selected-workout-details">
                  <h3>Selected Workout: {selectedWorkout.name}</h3>
                  <div className="workout-details-grid">
                    <div className="workout-info">
                      <h4>Workout Info</h4>
                      <div className="workout-meta">
                        <span>Time: {selectedWorkout.estimatedTime}</span>
                        <span>Difficulty: {selectedWorkout.difficulty}</span>
                        <span>Calories: {selectedWorkout.calories}</span>
                        <span>Category: {selectedWorkout.category}</span>
                      </div>
                    </div>
                    {selectedWorkout.benefits && (
                      <div className="workout-benefits">
                        <h4>Benefits</h4>
                        <ul>
                          {Array.isArray(selectedWorkout.benefits)
                            ? selectedWorkout.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))
                            : <li>{selectedWorkout.benefits}</li>
                          }
                        </ul>
                      </div>
                    )}
                    {selectedWorkout.instructions && (
                      <div className="workout-instructions">
                        <h4>Instructions</h4>
                        <ol>
                          {Array.isArray(selectedWorkout.instructions)
                            ? selectedWorkout.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                              ))
                            : <li>{selectedWorkout.instructions}</li>
                          }
                        </ol>
                      </div>
                    )}
                    {selectedWorkout.tips && (
                      <div className="workout-tips">
                        <h4>Tips</h4>
                        <p>{selectedWorkout.tips}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Daily Workouts List */}
          {dailyWorkouts.length > 0 && (
            <section className="daily-workouts-list">
              <h3>Today's Workouts</h3>
              <div className="workouts-grid">
                {dailyWorkouts.map((workout, index) => (
                  <div 
                    key={index} 
                    className={`workout-item ${workout.completed ? 'completed' : ''}`}
                  >
                    <div className="workout-header">
                      <h4>{workout.name}</h4>
                      <span className="workout-time">{workout.estimatedTime}</span>
                    </div>
                    <div className="workout-meta">
                      <span className="difficulty">{workout.difficulty}</span>
                      <span className="calories">{workout.calories} cal</span>
                    </div>
                    <button
                      className={`completion-btn ${workout.completed ? 'completed' : ''}`}
                      onClick={() => toggleWorkoutCompletion(workout.name)}
                    >
                      {workout.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
