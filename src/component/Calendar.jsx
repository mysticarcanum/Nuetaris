import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { API } from '../services/api';
import './Calendar.css';

const Calendar = ({ profile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (profile) {
      loadWorkouts();
    }
  }, [profile, currentDate]);

  const loadWorkouts = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await API.getMonthlyCalendar(year, month);
      if (response.success) {
        setWorkouts(response.workouts);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast.error('Failed to load workout data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleWorkoutToggle = async (date, workoutId) => {
    try {
      const response = await API.completeWorkout({
        date,
        workoutId,
        profileId: profile.id
      });
      
      if (response.success) {
        loadWorkouts(); // Reload to update UI
        toast.success('Workout updated!');
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      toast.error('Failed to update workout');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  return (
    <motion.div
      className="calendar-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="calendar-header">
        <motion.button
          className="nav-btn"
          onClick={() => navigateMonth(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ‹
        </motion.button>
        
        <h2 className="month-title">{getMonthName(currentDate)}</h2>
        
        <motion.button
          className="nav-btn"
          onClick={() => navigateMonth(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ›
        </motion.button>
      </div>

      <div className="calendar-grid">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDay }, (_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateString = date.toISOString().split('T')[0];
          const dayWorkouts = workouts[dateString] || [];
          
          return (
            <motion.div
              key={day}
              className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="day-number">{day}</div>
              
              {dayWorkouts.length > 0 && (
                <div className="workout-indicators">
                  {dayWorkouts.map((workout, index) => (
                    <div
                      key={workout.id}
                      className={`workout-indicator ${workout.is_completed ? 'completed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkoutToggle(dateString, workout.id);
                      }}
                      title={workout.workout_plan}
                    >
                      {workout.is_completed ? '✓' : '○'}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedDate && (
        <motion.div
          className="selected-date-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
          
          {workouts[selectedDate.toISOString().split('T')[0]]?.length > 0 ? (
            <div className="workout-list">
              {workouts[selectedDate.toISOString().split('T')[0]].map(workout => (
                <div key={workout.id} className="workout-item">
                  <span className="workout-name">{workout.workout_plan}</span>
                  <span className="workout-calories">{workout.calories_burned} cal</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-workouts">No workouts scheduled</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Calendar;
