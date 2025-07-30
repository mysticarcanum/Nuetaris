import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProfileDock from './ProfileDock';
import Calendar from './Calendar';
import WorkoutSidebar from './WorkoutSidebar';
import MealSidebar from './MealSidebar';
import AccountSettings from './AccountSettings';
import ProfileSelection from './ProfileSelection';
import { API } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, profile, onLogout, onProfileSelect, cookieConsent }) => {
  const [activeView, setActiveView] = useState('calendar');
  const [showProfileSelection, setShowProfileSelection] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [greeting, setGreeting] = useState('Hello');
  const [weeklyCalories, setWeeklyCalories] = useState(0);

  useEffect(() => {
    if (profile && cookieConsent === 'accepted') {
      setGreeting(`Hello ${profile.name}`);
    } else {
      setGreeting('Hello');
    }
    loadWeeklyCalories();
  }, [profile, cookieConsent]);

  const loadWeeklyCalories = async () => {
    if (!profile) return;
    
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const week = Math.ceil(now.getDate() / 7);
      
      const response = await API.getWeeklyCalories(year, month, week);
      if (response.success) {
        setWeeklyCalories(response.calories);
      }
    } catch (error) {
      console.error('Error loading weekly calories:', error);
    }
  };

  const handleProfileClick = () => {
    setShowProfileSelection(true);
  };

  const handleAccountClick = () => {
    setShowAccountSettings(true);
  };

  const handleBackdropClick = () => {
    setShowProfileSelection(false);
    setShowAccountSettings(false);
  };

  const handleProfileSelected = (selectedProfile) => {
    onProfileSelect(selectedProfile);
    setShowProfileSelection(false);
    toast.success(`Switched to ${selectedProfile.name}`);
  };

  return (
    <div className="dashboard">
      {/* Greeting Animation */}
      <motion.div
        className="greeting-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="greeting">{greeting}</h1>
        {weeklyCalories > 0 && (
          <motion.div
            className="weekly-calories"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="calories-icon">🔥</span>
            <span className="calories-text">{weeklyCalories} calories this week</span>
          </motion.div>
        )}
      </motion.div>

      {/* Profile Dock */}
      <ProfileDock
        user={user}
        profile={profile}
        onProfileClick={handleProfileClick}
        onAccountClick={handleAccountClick}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Workout Sidebar */}
        <WorkoutSidebar />

        {/* Calendar */}
        <Calendar profile={profile} />

        {/* Meal Sidebar */}
        <MealSidebar />
      </div>

      {/* Modal Overlays */}
      <AnimatePresence>
        {(showProfileSelection || showAccountSettings) && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {showProfileSelection && (
                <ProfileSelection
                  onProfileSelect={handleProfileSelected}
                  onClose={() => setShowProfileSelection(false)}
                />
              )}
              
              {showAccountSettings && (
                <AccountSettings
                  user={user}
                  onClose={() => setShowAccountSettings(false)}
                  onLogout={onLogout}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
