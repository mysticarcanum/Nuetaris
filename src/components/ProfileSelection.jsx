import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProfileSelection.css';

const ProfileSelection = ({ profiles, onProfileSelect, onCreateProfile }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="profile-selection-container">
      <motion.div
        className="profile-selection-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "power3.out" }}
      >
        <div className="welcome-header">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="welcome-title"
          >
            Welcome to Neutaris
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="welcome-subtitle"
          >
            Choose your profile or create a new one to get started
          </motion.p>
        </div>

        <div className="profiles-grid">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              className="profile-card"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProfileSelect(profile)}
            >
              <div className="profile-avatar">
                <img 
                  src={profile.avatar || '/default-avatar.png'} 
                  alt={profile.name}
                  className="avatar-image"
                />
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{profile.name}</h3>
                <p className="profile-stats">
                  {profile.weight}kg • {profile.height}ft • {profile.gender}
                </p>
                <p className="profile-goal">{profile.goal}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="create-profile-card"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            <div className="create-icon">
              <span>+</span>
            </div>
            <h3>Create New Profile</h3>
            <p>Start your fitness journey</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Create New Profile</h2>
                <p>Let's create your unique character!</p>
                <div className="modal-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setShowCreateModal(false);
                      onCreateProfile();
                    }}
                  >
                    Start Creating
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfileSelection;
2. Create src/components/CharacterCreation.jsx (Retro Wii Sports Style)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import './CharacterCreation.css';

const CharacterCreation = ({ onProfileCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: 'build-strength',
    weight: '',
    height: '',
    gender: ''
  });

  const [character, setCharacter] = useState({
    eyes: 0,
    hair: 0,
    body: 0,
    face: 0,
    clothing: 0,
    skinTone: 0
  });

  const [currentCategory, setCurrentCategory] = useState('eyes');
  const [isValid, setIsValid] = useState(false);

  // Character customization options
  const characterOptions = {
    eyes: Array.from({ length: 10 }, (_, i) => `eye-${i + 1}`),
    hair: Array.from({ length: 20 }, (_, i) => `hair-${i + 1}`),
    body: Array.from({ length: 20 }, (_, i) => `body-${i + 1}`),
    face: Array.from({ length: 20 }, (_, i) => `face-${i + 1}`),
    clothing: Array.from({ length: 10 }, (_, i) => `clothing-${i + 1}`),
    skinTone: ['pale', 'light', 'medium', 'tan', 'dark', 'very-dark']
  };

  const bodyTypes = {
    'body-1': { name: 'Slim', description: 'Lean and athletic' },
    'body-2': { name: 'Athletic', description: 'Muscular and fit' },
    'body-3': { name: 'Average', description: 'Balanced build' },
    'body-4': { name: 'Curvy', description: 'Fuller figure' },
    'body-5': { name: 'Plus Size', description: 'Larger build' },
    'body-6': { name: 'Strong', description: 'Powerful build' },
    'body-7': { name: 'Petite', description: 'Small frame' },
    'body-8': { name: 'Tall', description: 'Long limbs' },
    'body-9': { name: 'Stocky', description: 'Solid build' },
    'body-10': { name: 'Broad', description: 'Wide shoulders' },
    'body-11': { name: 'Lean', description: 'Naturally thin' },
    'body-12': { name: 'Toned', description: 'Defined muscles' },
    'body-13': { name: 'Full', description: 'Rounded figure' },
    'body-14': { name: 'Robust', description: 'Strong frame' },
    'body-15': { name: 'Slender', description: 'Graceful build' },
    'body-16': { name: 'Brawny', description: 'Heavy muscle' },
    'body-17': { name: 'Compact', description: 'Short and solid' },
    'body-18': { name: 'Lanky', description: 'Tall and thin' },
    'body-19': { name: 'Stout', description: 'Short and strong' },
    'body-20': { name: 'Voluptuous', description: 'Curvaceous build' }
  };

  const goals = [
    { value: 'build-strength', label: 'Build Strength', icon: '💪' },
    { value: 'lose-weight', label: 'Lose Weight', icon: '⚖️' },
    { value: 'build-muscle', label: 'Build Muscle', icon: '🏋️' },
    { value: 'improve-fitness', label: 'Improve Fitness', icon: '🏃' },
    { value: 'maintain-health', label: 'Maintain Health', icon: '❤️' }
  ];

  // Load saved character from cookies
  useEffect(() => {
    const savedCharacter = Cookies.get('neutaris_character');
    if (savedCharacter) {
      try {
        setCharacter(JSON.parse(savedCharacter));
      } catch (error) {
        console.error('Error loading saved character:', error);
      }
    }
  }, []);

  // Save character to cookies whenever it changes
  useEffect(() => {
    Cookies.set('neutaris_character', JSON.stringify(character), { expires: 365 });
  }, [character]);

  // Validate form
  useEffect(() => {
    const isValidForm = formData.name && formData.email && formData.weight && 
                       formData.height && formData.gender;
    setIsValid(isValidForm);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCharacterChange = (category, direction) => {
    setCharacter(prev => {
      const currentIndex = prev[category];
      const maxIndex = characterOptions[category].length - 1;
      let newIndex;
      
      if (direction === 'next') {
        newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      }
      
      return { ...prev, [category]: newIndex };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const newProfile = {
      ...formData,
      character: character,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    onProfileCreated(newProfile);
  };

  const getCharacterImage = () => {
    const skinTone = characterOptions.skinTone[character.skinTone];
    const bodyType = characterOptions.body[character.body];
    const clothing = characterOptions.clothing[character.clothing];
    
    // Return a composite character image based on selections
    return `/character-assets/${skinTone}/${bodyType}/${clothing}.png`;
  };

  return (
    <div className="character-creation-container">
      <motion.div
        className="character-creation-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="creation-header">
          <h1>Create Your Character</h1>
          <p>Have fun creating your unique fitness avatar!</p>
        </div>

        <div className="creation-layout">
          {/* Character Preview */}
          <div className="character-preview">
            <div className="character-display">
              <img 
                src={getCharacterImage()} 
                alt="Your character"
                className="character-image"
                onError={(e) => {
                  e.target.src = '/character-assets/default-character.png';
                }}
              />
            </div>
            <div className="character-info">
              <h3>Your Character</h3>
              <p>Body Type: {bodyTypes[`body-${character.body + 1}`]?.name || 'Custom'}</p>
              <p>Skin Tone: {characterOptions.skinTone[character.skinTone]}</p>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="customization-panel">
            <div className="customization-tabs">
              {Object.keys(characterOptions).map((category) => (
                <button
                  key={category}
                  className={`customization-tab ${currentCategory === category ? 'active' : ''}`}
                  onClick={() => setCurrentCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="customization-content">
              <div className="customization-controls">
                <button
                  className="nav-btn prev"
                  onClick={() => handleCharacterChange(currentCategory, 'prev')}
                >
                  ←
                </button>
                
                <div className="current-selection">
                  <h4>{currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h4>
                  <p>Option {character[currentCategory] + 1} of {characterOptions[currentCategory].length}</p>
                </div>
                
                <button
                  className="nav-btn next"
                  onClick={() => handleCharacterChange(currentCategory, 'next')}
                >
                  →
                </button>
              </div>

              {currentCategory === 'body' && (
                <div className="body-description">
                  <p>{bodyTypes[`body-${character.body + 1}`]?.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form">
            <h3>Profile Information</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg) *</label>
                  <input
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="e.g., 70"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height (ft) *</label>
                  <input
                    type="number"
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="e.g., 5.7"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fitness Goal *</label>
                <div className="goal-options">
                  {goals.map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      className={`goal-option ${formData.goal === goal.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('goal', goal.value)}
                    >
                      <span className="goal-icon">{goal.icon}</span>
                      <span className="goal-label">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!isValid}
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterCreation;
