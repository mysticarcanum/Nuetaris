import React from 'react';
import { motion } from 'framer-motion';
import './ProfileDock.css';

const ProfileDock = ({ user, profile, onProfileClick, onAccountClick, onLogout }) => {
  const dockItems = [
    {
      id: 'profile',
      icon: '👤',
      label: 'Profiles',
      action: onProfileClick,
      active: true
    },
    {
      id: 'calendar',
      icon: '📅',
      label: 'Calendar',
      action: () => {},
      active: false
    },
    {
      id: 'workouts',
      icon: '💪',
      label: 'Workouts',
      action: () => {},
      active: false
    },
    {
      id: 'meals',
      icon: '🍽️',
      label: 'Meals',
      action: () => {},
      active: false
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      action: onAccountClick,
      active: false
    }
  ];

  return (
    <motion.div
      className="profile-dock"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="dock-container">
        {dockItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`dock-item ${item.active ? 'active' : ''}`}
            onClick={item.action}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <div className="dock-icon">{item.icon}</div>
            <div className="dock-label">{item.label}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Current Profile Display */}
      {profile && (
        <motion.div
          className="current-profile"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="profile-avatar">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} />
            ) : (
              <div className="default-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">{profile.name}</div>
            <div className="profile-goal">{profile.goal.replace('_', ' ')}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileDock;
