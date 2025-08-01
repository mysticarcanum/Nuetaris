import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import './CharacterDisplay.css';

const CharacterDisplay = ({ character, onCharacterClick }) => {
  const [opacity, setOpacity] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const savedOpacity = Cookies.get('neutaris_character_opacity');
    if (savedOpacity) {
      setOpacity(parseInt(savedOpacity));
    }
  }, []);

  const handleClick = () => {
    let newOpacity;
    if (opacity === 100) {
      newOpacity = 50;
    } else if (opacity === 50) {
      newOpacity = 10;
    } else {
      newOpacity = 100;
    }
    
    setOpacity(newOpacity);
    Cookies.set('neutaris_character_opacity', newOpacity.toString(), { expires: 365 });
    
    if (onCharacterClick) {
      onCharacterClick();
    }
  };

  const getCharacterImage = () => {
    if (!character) return '/character-assets/default-character.png';
    
    const skinTone = character.skinTone || 0;
    const bodyType = character.body || 0;
    const clothing = character.clothing || 0;
    
    const skinTones = ['pale', 'light', 'medium', 'tan', 'dark', 'very-dark'];
    const currentSkinTone = skinTones[skinTone];
    
    return `/character-assets/${currentSkinTone}/body-${bodyType + 1}/clothing-${clothing + 1}.png`;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="character-display-mini"
      style={{ opacity: opacity / 100 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
    >
      <img 
        src={getCharacterImage()} 
        alt="Your character"
        className="mini-character-image"
        onError={(e) => {
          e.target.src = '/character-assets/default-character.png';
        }}
      />
      <div className="character-edit-hint">
        <span>Click to adjust visibility</span>
      </div>
    </motion.div>
  );
};

export default CharacterDisplay;
