import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from "gsap";
import { Toaster } from 'react-hot-toast';
import App from "./App.jsx";
import "./index.css";

const SplitText = ({
  text,
  children,
  className = "",
  style = {},
  onComplete = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(true);
        onComplete();
      },
    });

    tl.fromTo(
      ".split-text",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [onComplete]);

  return (
    <div className={`split-text-container ${className}`} style={style}>
      {text.split("").map((char, index) => (
        <span key={index} className="split-text">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {isVisible && children}
    </div>
  );
};

const LoadingScreen = ({ onComplete }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <SplitText text="NEUTARIS" onComplete={onComplete}>
          <div className="loading-subtitle">
            Your Personal Fitness Companion
          </div>
          <div className="loading-spinner"></div>
        </SplitText>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {!isLoading && <App />}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            fontFamily: 'Manrope, sans-serif',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
