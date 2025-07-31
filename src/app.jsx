import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProfileSelection from './components/ProfileSelection';
import CharacterCreation from './components/CharacterCreation';
import Dashboard from './components/Dashboard';
import CircularGallery from './components/CircularGallery';
import MealSidebar from './components/MealSidebar';
import { gsap } from 'gsap';

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showProfileSelection, setShowProfileSelection] = useState(true);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [galleryLink, setGalleryLink] = useState('');
  const [showMealSidebar, setShowMealSidebar] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  // Load profiles and settings from cookies on mount
  useEffect(() => {
    const savedProfiles = Cookies.get('neutaris_profiles');
    const savedCurrentProfile = Cookies.get('neutaris_current_profile');
    const savedGalleryLink = Cookies.get('neutaris_gallery_link');
    const savedDailyNutrition = Cookies.get('neutaris_daily_nutrition');

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
        Cookies.remove('neutaris_current_profile'); // Clear current profile cookie
        setShowProfileSelection(true);
      }
    }
    if (updatedProfiles.length === 0) {
        Cookies.remove('neutaris_profiles'); // Clear profiles cookie if none left
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

  // Welcome messages based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let timeOfDay;

    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const messages = {
      morning: [
        "Good morning! Ready to start your day strong?",
        "Rise and shine! Time to crush those goals!",
        "Morning motivation: You've got this!",
        "Good morning! Let's make today amazing!"
      ],
      afternoon: [
        "Afternoon energy! Keep pushing forward!",
        "Midday check-in: How's your progress?",
        "Afternoon motivation: Stay focused!",
        "Good afternoon! Time to refuel and recharge!"
      ],
      evening: [
        "Evening reflection: Great work today!",
        "Good evening! Planning tomorrow's success?",
        "Evening motivation: Finish strong!",
        "Good evening! Rest well and prepare for tomorrow!"
      ]
    };

    const timeMessages = messages[timeOfDay];
    return timeMessages[Math.floor(Math.random() * timeMessages.length)];
  };

  if (showProfileSelection) {
    return (
      <ProfileSelection
        profiles={profiles}
        onProfileSelect={handleProfileSelect}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    );
  }

  if (showCharacterCreation) {
    return (
      <CharacterCreation
        onProfileCreated={handleProfileCreated}
        onCancel={() => setShowCharacterCreation(false)}
      />
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <a href="#" className="logo">Neutaris</a>
          <div className="current-profile" onClick={handleSwitchProfile}>
            <img
              src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
              alt="Profile"
              className="profile-avatar"
            />
            <span className="profile-name">{currentProfile?.name || 'Select Profile'}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="welcome-section">
            <h1 className="welcome-message">
              {getWelcomeMessage().replace('!', `, ${currentProfile?.name?.split(' ')[0] || 'there'}!`)}
            </h1>
            <p className="welcome-subtitle">
              Ready to crush your {currentProfile?.goal?.replace('-', ' ') || 'fitness'} goals today?
            </p>
          </section>

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
            {/* Left Sidebar - Workout Sidebar (placeholder for future) */}
            <div className="left-sidebar">
              <div className="sidebar-placeholder">
                <h3>Workout Plans</h3>
                <p>Workout sidebar coming soon...</p>
              </div>
            </div>

            {/* Center Content - Dashboard */}
            <div className="center-content">
              <Dashboard
                currentProfile={currentProfile}
                galleryLink={galleryLink}
                onGalleryLinkChange={handleGalleryLinkChange}
                selectedMeal={selectedMeal}
                onMealSelect={handleMealSelect}
              />
            </div>

            {/* Right Sidebar - Meal Sidebar */}
            <div className="right-sidebar">
              <MealSidebar 
                onMealSelect={handleMealSelect}
                selectedMeal={selectedMeal}
              />
            </div>
          </div>

          {/* Selected Meal Details */}
          {selectedMeal && (
            <section className="selected-meal-details">
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
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
