import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './CookieBanner.css';

const CookieBanner = ({ onConsent }) => {
  const [showHeart, setShowHeart] = useState(false);

  const handleAccept = () => {
    setShowHeart(true);
    onConsent('accepted');
    
    // Show heart animation
    setTimeout(() => {
      setShowHeart(false);
    }, 2000);
    
    toast.success('Cookies enabled! 💚');
  };

  const handleReject = () => {
    onConsent('rejected');
    toast('Cookies disabled');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="cookie-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="cookie-content">
          <div className="cookie-text">
            <h3>🍪 We use cookies</h3>
            <p>
              We use cookies to remember your preferences and provide a better experience. 
              This helps us personalize your workout plans and track your progress.
            </p>
          </div>
          
          <div className="cookie-actions">
            <motion.button
              className="cookie-btn reject"
              onClick={handleReject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reject
            </motion.button>
            
            <motion.button
              className="cookie-btn accept"
              onClick={handleAccept}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accept
            </motion.button>
          </div>
        </div>

        {/* Heart Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              className="heart-animation"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: -50 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              💚
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
