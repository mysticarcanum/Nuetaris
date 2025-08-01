import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProfileSelection from './components/ProfileSelection';
import CharacterCreation from './components/CharacterCreation';
import Dashboard from './components/Dashboard';
import CircularGallery from './components/CircularGallery';
import MealSidebar from './components/MealSidebar';
import WorkoutSidebar from './components/WorkoutSidebar';
import CharacterDisplay from './components/CharacterDisplay';
import CharacterEditor from './components/CharacterEditor';
import { gsap } from 'gsap';

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showProfileSelection, setShowProfileSelection] = useState(true);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [galleryLink, setGalleryLink] = useState('');
  const [showMealSidebar, setShowMealSidebar] = useState(true);
  const [showWorkoutSidebar, setShowWorkoutSidebar] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [calendarSchedule, setCalendarSchedule] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCharacterEditor, setShowCharacterEditor] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  // Load all data from cookies on mount
  useEffect(() => {
    const savedProfiles = Cookies.get('neutaris_profiles');
    const savedCurrentProfile = Cookies.get('neutaris_current_profile');
    const savedGalleryLink = Cookies.get('neutaris_gallery_link');
    const savedShowMealSidebar = Cookies.get('neutaris_show_meal_sidebar');
    const savedShowWorkoutSidebar = Cookies.get('neutaris_show_workout_sidebar');
    const savedDailyNutrition = Cookies.get('neutaris_daily_nutrition');
    const savedCalendarSchedule = Cookies.get('neutaris_calendar_schedule');
    const savedCharacter = Cookies.get('neutaris_character');

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

    if (savedShowMealSidebar !== undefined) {
      setShowMealSidebar(savedShowMealSidebar === 'true');
    }

    if (savedShowWorkoutSidebar !== undefined) {
      setShowWorkoutSidebar(savedShowWorkoutSidebar === 'true');
    }

    if (savedDailyNutrition) {
      try {
        setDailyNutrition(JSON.parse(savedDailyNutrition));
      } catch (error) {
        console.error('Error parsing daily nutrition:', error);
      }
    }

    if (savedCalendarSchedule) {
      try {
        setCalendarSchedule(JSON.parse(savedCalendarSchedule));
      } catch (error) {
        console.error('Error parsing calendar schedule:', error);
      }
    }

    if (savedCharacter) {
      try {
        setCurrentCharacter(JSON.parse(savedCharacter));
      } catch (error) {
        console.error('Error loading saved character:', error);
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

  // Save sidebar visibility preferences
  useEffect(() => {
    Cookies.set('neutaris_show_meal_sidebar', showMealSidebar.toString(), { expires: 365 });
  }, [showMealSidebar]);

  useEffect(() => {
    Cookies.set('neutaris_show_workout_sidebar', showWorkoutSidebar.toString(), { expires: 365 });
  }, [showWorkoutSidebar]);

  // Save daily nutrition to cookies whenever it changes
  useEffect(() => {
    if (dailyNutrition.calories > 0) {
      Cookies.set('neutaris_daily_nutrition', JSON.stringify(dailyNutrition), { expires: 1 });
    }
  }, [dailyNutrition]);

  // Save calendar schedule to cookies whenever it changes
  useEffect(() => {
    if (Object.keys(calendarSchedule).length > 0) {
      Cookies.set('neutaris_calendar_schedule', JSON.stringify(calendarSchedule), { expires: 365 });
    }
  }, [calendarSchedule]);

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
  };

  // Handle drag and drop to calendar
  const handleCalendarDrop = (date, item, type) => {
    const dateKey = date.toISOString().split('T')[0];
    setCalendarSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [type]: item
      }
    }));
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

  // Clear calendar schedule
  const clearCalendarSchedule = () => {
    setCalendarSchedule({});
    Cookies.remove('neutaris_calendar_schedule');
  };

  // Handle character save
  const handleCharacterSave = (updatedCharacter) => {
    setCurrentCharacter(updatedCharacter);
    Cookies.set('neutaris_character', JSON.stringify(updatedCharacter), { expires: 365 });
  };

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
        Cookies.remove('neutaris_current_profile');
        setShowProfileSelection(true);
      }
    }
    if (updatedProfiles.length === 0) {
      Cookies.remove('neutaris_profiles');
    }
  };

  const handleSwitchProfile = () => {
    setShowProfileSelection(true);
  };

  const handleGalleryLinkChange = (link) => {
    setGalleryLink(link);
  };

  // Get welcome message based on profile
  const getWelcomeMessage = () => {
    if (currentProfile) {
      return `Hello ${currentProfile.name}!`;
    }
    return "Hello!";
  };

  // Fade-in animation for welcome message
  useEffect(() => {
    if (currentProfile) {
      gsap.fromTo('.welcome-message',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, [currentProfile]);

  if (showProfileSelection) {
    return (
      <div className="app">
        <ProfileSelection
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          onCreateProfile={handleCreateProfile}
        />
        {showCharacterCreation && (
          <CharacterCreation
            onProfileCreated={handleProfileCreated}
            onCancel={() => setShowCharacterCreation(false)}
          />
        )}
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
              transition={{ duration: 1, ease: "power2.out" }}
            >
              {getWelcomeMessage()}
            </motion.h1>
          </div>
          
          <div className="header-actions">
            <button 
              className="switch-profile-btn"
              onClick={handleSwitchProfile}
            >
              Switch Profile
            </button>
            <button 
              className="character-edit-btn"
              onClick={() => setShowCharacterEditor(true)}
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Daily Nutrition Summary */}
          {dailyNutrition.calories > 0 && (
            <section className="nutrition-summary">
              <h3>Today's Nutrition</h3>
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
              <button 
                className="reset-nutrition-btn"
                onClick={resetDailyNutrition}
              >
                Reset Daily
              </button>
            </section>
          )}

          {/* Main Content Layout */}
          <div className="main-layout">
            {/* Left Sidebar - Workout Sidebar */}
            {showWorkoutSidebar && (
              <div className="left-sidebar">
                <WorkoutSidebar 
                  onWorkoutSelect={handleWorkoutSelect}
                  selectedWorkout={selectedWorkout}
                  onCalendarDrop={handleCalendarDrop}
                  currentDate={currentDate}
                />
              </div>
            )}

            {/* Center Content - Dashboard with Calendar */}
            <div className="center-content">
              <Dashboard
                currentProfile={currentProfile}
                galleryLink={galleryLink}
                onGalleryLinkChange={handleGalleryLinkChange}
                selectedMeal={selectedMeal}
                selectedWorkout={selectedWorkout}
                onMealSelect={handleMealSelect}
                onWorkoutSelect={handleWorkoutSelect}
                calendarSchedule={calendarSchedule}
                onCalendarDrop={handleCalendarDrop}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onClearSchedule={clearCalendarSchedule}
              />
            </div>

            {/* Right Sidebar - Meal Sidebar */}
            {showMealSidebar && (
              <div className="right-sidebar">
                <MealSidebar 
                  onMealSelect={handleMealSelect}
                  selectedMeal={selectedMeal}
                  onCalendarDrop={handleCalendarDrop}
                  currentDate={currentDate}
                />
              </div>
            )}
          </div>

          {/* Sidebar Toggle Controls */}
          <div className="sidebar-controls">
            <button 
              className={`sidebar-toggle ${showWorkoutSidebar ? 'active' : ''}`}
              onClick={() => setShowWorkoutSidebar(!showWorkoutSidebar)}
            >
              {showWorkoutSidebar ? 'Hide' : 'Show'} Workouts
            </button>
            <button 
              className={`sidebar-toggle ${showMealSidebar ? 'active' : ''}`}
              onClick={() => setShowMealSidebar(!showMealSidebar)}
            >
              {showMealSidebar ? 'Hide' : 'Show'} Meals
            </button>
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
                      <div className="info-grid">
                        <span>Difficulty: {selectedWorkout.difficulty}</span>
                        <span>Time: {selectedWorkout.estimatedTime}</span>
                        <span>Muscle Groups: {selectedWorkout.muscleGroups.join(', ')}</span>
                      </div>
                    </div>
                    {selectedWorkout.benefits && (
                      <div className="workout-benefits">
                        <h4>Benefits</h4>
                        <ul>
                          {selectedWorkout.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedWorkout.instructions && (
                      <div className="workout-instructions">
                        <h4>Instructions</h4>
                        <ol>
                          {selectedWorkout.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Character Display */}
      {currentCharacter && (
        <CharacterDisplay 
          character={currentCharacter}
          onCharacterClick={() => console.log('Character clicked')}
        />
      )}

      {/* Character Editor Modal */}
      {showCharacterEditor && (
        <CharacterEditor
          character={currentCharacter}
          onSave={handleCharacterSave}
          onClose={() => setShowCharacterEditor(false)}
        />
      )}
    </div>
  );
}

export default App;
