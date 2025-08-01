import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import './CharacterEditor.css';

const CharacterEditor = ({ character, onSave, onClose }) => {
  const [currentCharacter, setCurrentCharacter] = useState(character || {});
  const [currentCategory, setCurrentCategory] = useState('eyes');

  const characterOptions = {
    eyes: Array.from({ length: 10 }, (_, i) => `eye-${i + 1}`),
    hair: Array.from({ length: 20 }, (_, i) => `hair-${i + 1}`),
    body: Array.from({ length: 20 }, (_, i) => `body-${i + 1}`),
    face: Array.from({ length: 20 }, (_, i) => `face-${i + 1}`),
    clothing: Array.from({ length: 10 }, (_, i) => `clothing-${i + 1}`),
    skinTone: ['pale', 'light', 'medium', 'tan', 'dark', 'very-dark']
  };

  const handleCharacterChange = (category, direction) => {
    setCurrentCharacter(prev => {
      const currentIndex = prev[category] || 0;
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

  const handleSave = () => {
    Cookies.set('neutaris_character', JSON.stringify(currentCharacter), { expires: 365 });
    onSave(currentCharacter);
    onClose();
  };

  const getCharacterImage = () => {
    const skinTone = characterOptions.skinTone[currentCharacter.skinTone || 0];
    const bodyType = characterOptions.body[currentCharacter.body || 0];
    const clothing = characterOptions.clothing[currentCharacter.clothing || 0];
    
    return `/character-assets/${skinTone}/${bodyType}/${clothing}.png`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="character-editor-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="character-editor-modal"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="editor-header">
            <h2>Edit Your Character</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="editor-content">
            <div className="character-preview">
              <img 
                src={getCharacterImage()} 
                alt="Your character"
                className="preview-image"
                onError={(e) => {
                  e.target.src = '/character-assets/default-character.png';
                }}
              />
            </div>

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

              <div className="customization-controls">
                <button
                  className="nav-btn prev"
                  onClick={() => handleCharacterChange(currentCategory, 'prev')}
                >
                  ←
                </button>
                
                <div className="current-selection">
                  <h4>{currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h4>
                  <p>Option {(currentCharacter[currentCategory] || 0) + 1} of {characterOptions[currentCategory].length}</p>
                </div>
                
                <button
                  className="nav-btn next"
                  onClick={() => handleCharacterChange(currentCategory, 'next')}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CharacterEditor;
