import React from 'react'
import ReactDOM from 'react-dom/client'
import { gsap } from 'gsap'
import App from './App.jsx'
import './index.css'

// GSAP SplitText animation component
const SplitText = ({ 
  text, 
  className = "", 
  delay = 0, 
  duration = 0.6, 
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete
}) => {
  const textRef = React.useRef(null);

  React.useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.textContent.split('');
    textRef.current.innerHTML = '';
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = from.opacity;
      span.style.transform = `translateY(${from.y}px)`;
      textRef.current.appendChild(span);
    });

    const spans = textRef.current.querySelectorAll('span');
    
    gsap.to(spans, {
      opacity: to.opacity,
      y: to.y,
      duration: duration,
      delay: delay,
      ease: ease,
      stagger: 0.05,
      onComplete: onLetterAnimationComplete
    });
  }, [text, delay, duration, ease, from, to, onLetterAnimationComplete]);

  return (
    <div 
      ref={textRef} 
      className={className}
      style={{ textAlign }}
    >
      {text}
    </div>
  );
};

// Loading screen with GSAP animation
const LoadingScreen = ({ onComplete }) => {
  const loadingRef = React.useRef(null);

  React.useEffect(() => {
    if (!loadingRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    tl.fromTo(loadingRef.current, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
    )
    .to(loadingRef.current, 
      { opacity: 0, scale: 1.1, duration: 0.5, ease: "power2.in" },
      "+=1"
    );
  }, [onComplete]);

  return (
    <div className="loading-screen" ref={loadingRef}>
      <SplitText
        text="Neutaris"
        className="app-title"
        delay={0.5}
        duration={1.2}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 60 }}
        to={{ opacity: 1, y: 0 }}
        onLetterAnimationComplete={() => console.log('Neutaris animation complete!')}
      />
      <div className="loading-subtitle">
        Your fitness journey starts here
      </div>
    </div>
  );
};

// Main app wrapper with loading screen
const AppWrapper = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  React.useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return <App />;
};

// Error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Neutaris App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'Manrope, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ color: '#ff8c00', marginBottom: '16px' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            We're sorry, but something unexpected happened. Please refresh the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #ff8c00, #ff6b35)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring
const PerformanceMonitor = ({ children }) => {
  React.useEffect(() => {
    // Monitor app performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Neutaris App Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      });
    }
  }, []);

  return children;
};

// Initialize React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PerformanceMonitor>
        <AppWrapper />
      </PerformanceMonitor>
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for potential external use
export { SplitText, LoadingScreen };
