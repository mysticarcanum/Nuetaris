import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import AuthContainer from './components/Auth/AuthContainer';
import Dashboard from './components/Dashboard';
import CookieBanner from './components/CookieBanner';
import { API } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    checkCookieConsent();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedToken = Cookies.get('token');
      const savedUser = Cookies.get('user');

      if (savedToken && savedUser) {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Check for saved profile if cookies are accepted
        if (cookieConsent === 'accepted') {
          const savedProfile = Cookies.get('selectedProfile');
          if (savedProfile) {
            setSelectedProfile(JSON.parse(savedProfile));
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCookieConsent = () => {
    const consent = Cookies.get('cookieConsent');
    if (consent) {
      setCookieConsent(consent);
      setShowCookieBanner(false);
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    
    // Save to cookies if consent given
    if (cookieConsent === 'accepted') {
      Cookies.set('token', userToken, { expires: 30 });
      Cookies.set('user', JSON.stringify(userData), { expires: 30 });
    }
  };

  const handleSignup = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    
    // Save to cookies if consent given
    if (cookieConsent === 'accepted') {
      Cookies.set('token', userToken, { expires: 30 });
      Cookies.set('user', JSON.stringify(userData), { expires: 30 });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setSelectedProfile(null);
    
    // Clear cookies
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('selectedProfile');
    
    toast.success('Logged out successfully');
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    
    // Save profile to cookies if consent given
    if (cookieConsent === 'accepted') {
      Cookies.set('selectedProfile', JSON.stringify(profile), { expires: 30 });
    }
  };

  const handleCookieConsent = (consent) => {
    setCookieConsent(consent);
    setShowCookieBanner(false);
    Cookies.set('cookieConsent', consent, { expires: 365 });
    
    if (consent === 'accepted') {
      toast.success('Cookies enabled for better experience');
    } else {
      toast('Cookies disabled - some features may be limited');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="aurora-background">
          <div className="aurora-effect"></div>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora-effect"></div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthContainer 
              onLogin={handleLogin}
              onSignup={handleSignup}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              user={user}
              profile={selectedProfile}
              onLogout={handleLogout}
              onProfileSelect={handleProfileSelect}
              cookieConsent={cookieConsent}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <CookieBanner onConsent={handleCookieConsent} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
