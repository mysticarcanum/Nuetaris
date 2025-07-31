import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './WorkoutSidebar.css';

const WorkoutSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredWorkout, setHoveredWorkout] = useState(null);

  // Push Pull Legs Workout Split
  const workoutPlans = {
    push: {
      name: "Push Day",
      exercises: [
        {
          name: "Bench Press",
          muscleGroups: ["Chest", "Triceps", "Anterior Deltoids"],
          benefits: "Builds chest strength and size, improves pressing power",
          sets: "3-4",
          reps: "8-12"
        },
        {
          name: "Overhead Press",
          muscleGroups: ["Shoulders", "Triceps"],
          benefits: "Develops shoulder strength and stability",
          sets: "3-4",
          reps: "8-12"
        },
        {
          name: "Incline Dumbbell Press",
          muscleGroups: ["Upper Chest", "Triceps"],
          benefits: "Targets upper chest development",
          sets: "3",
          reps: "10-12"
        },
        {
          name: "Dips",
          muscleGroups: ["Chest", "Triceps", "Shoulders"],
          benefits: "Compound movement for upper body strength",
          sets: "3",
          reps: "8-12"
        },
        {
          name: "Lateral Raises",
          muscleGroups: ["Lateral Deltoids"],
          benefits: "Isolates lateral deltoids for shoulder width",
          sets: "3",
          reps: "12-15"
        },
        {
          name: "Tricep Extensions",
          muscleGroups: ["Triceps"],
          benefits: "Isolates tricep development",
          sets: "3",
          reps: "12-15"
        }
      ]
    },
    pull: {
      name: "Pull Day",
      exercises: [
        {
          name: "Deadlifts",
          muscleGroups: ["Back", "Hamstrings", "Glutes", "Core"],
          benefits: "Full body compound movement, builds overall strength",
          sets: "3-4",
          reps: "6-8"
        },
        {
          name: "Pull-ups",
          muscleGroups: ["Lats", "Biceps", "Upper Back"],
          benefits: "Develops back width and pulling strength",
          sets: "3",
          reps: "8-12"
        },
        {
          name: "Barbell Rows",
          muscleGroups: ["Middle Back", "Biceps"],
          benefits: "Thickens middle back and improves posture",
          sets: "3-4",
          reps: "8-12"
        },
        {
          name: "Lat Pulldowns",
          muscleGroups: ["Lats", "Biceps"],
          benefits: "Alternative to pull-ups, targets lat width",
          sets: "3",
          reps: "10-12"
        },
        {
          name: "Face Pulls",
          muscleGroups: ["Rear Deltoids", "Upper Back"],
          benefits: "Improves shoulder health and posture",
          sets: "3",
          reps: "12-15"
        },
        {
          name: "Bicep Curls",
          muscleGroups: ["Biceps"],
          benefits: "Isolates bicep development",
          sets: "3",
          reps: "12-15"
        }
      ]
    },
    legs: {
      name: "Legs Day",
      exercises: [
        {
          name: "Squats",
          muscleGroups: ["Quadriceps", "Glutes", "Core"],
          benefits: "King of leg exercises, builds overall leg strength",
          sets: "3-4",
          reps: "8-12"
        },
        {
          name: "Romanian Deadlifts",
          muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
          benefits: "Targets hamstrings and improves hip hinge",
          sets: "3-4",
          reps: "8-12"
        },
        {
          name: "Leg Press",
          muscleGroups: ["Quadriceps", "Glutes"],
          benefits: "Machine-based quad development",
          sets: "3",
          reps: "10-12"
        },
        {
          name: "Leg Extensions",
          muscleGroups: ["Quadriceps"],
          benefits: "Isolates quadriceps development",
          sets: "3",
          reps: "12-15"
        },
        {
          name: "Leg Curls",
          muscleGroups: ["Hamstrings"],
          benefits: "Isolates hamstring development",
          sets: "3",
          reps: "12-15"
        },
        {
          name: "Calf Raises",
          muscleGroups: ["Calves"],
          benefits: "Develops calf strength and size",
          sets: "4",
          reps: "15-20"
        }
      ]
    }
  };

  const handleWorkoutDrag = (e, workout) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(workout));
  };

  const handleCustomWorkout = (customWorkout) => {
    toast.success('Custom workout added!');
    setShowCustomForm(false);
  };

  return (
    <motion.div
      className="workout-sidebar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sidebar-header">
        <h3>Suggested Workouts</h3>
        <motion.button
          className="add-custom-btn"
          onClick={() => setShowCustomForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Custom
        </motion.button>
      </div>

      <div className="workout-plans">
        {Object.entries(workoutPlans).map(([key, plan]) => (
          <div key={key} className="workout-plan">
            <h4 className="plan-title">{plan.name}</h4>
            <div className="exercises-list">
              {plan.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className="exercise-item"
                  draggable
                  onDragStart={(e) => handleWorkoutDrag(e, exercise)}
                  onMouseEnter={() => setHoveredWorkout(exercise)}
                  onMouseLeave={() => setHoveredWorkout(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="exercise-name">{exercise.name}</div>
                  <div className="exercise-details">
                    {exercise.sets} sets × {exercise.reps} reps
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Info Tooltip */}
      <AnimatePresence>
        {hoveredWorkout && (
          <motion.div
            className="exercise-tooltip"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <h4>{hoveredWorkout.name}</h4>
            <div className="tooltip-section">
              <strong>Muscle Groups:</strong>
              <div className="muscle-tags">
                {hoveredWorkout.muscleGroups.map(muscle => (
                  <span key={muscle} className="muscle-tag">{muscle}</span>
                ))}
              </div>
            </div>
            <div className="tooltip-section">
              <strong>Benefits:</strong>
              <p>{hoveredWorkout.benefits}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Workout Form */}
      <AnimatePresence>
        {showCustomForm && (
          <CustomWorkoutForm
            onSubmit={handleCustomWorkout}
            onClose={() => setShowCustomForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Custom Workout Form Component
const CustomWorkoutForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    muscleGroups: '',
    benefits: '',
    sets: '',
    reps: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a workout name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.div
      className="custom-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="custom-form"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <h3>Add Custom Workout</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Workout Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Custom Squat Variation"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Muscle Groups</label>
            <input
              type="text"
              value={formData.muscleGroups}
              onChange={(e) => setFormData({...formData, muscleGroups: e.target.value})}
              placeholder="e.g., Quadriceps, Glutes"
            />
          </div>
          
          <div className="form-group">
            <label>Benefits</label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              placeholder="Describe the benefits of this exercise"
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Sets</label>
              <input
                type="text"
                value={formData.sets}
                onChange={(e) => setFormData({...formData, sets: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
            
            <div className="form-group">
              <label>Reps</label>
              <input
                type="text"
                value={formData.reps}
                onChange={(e) => setFormData({...formData, reps: e.target.value})}
                placeholder="e.g., 8-12"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Workout
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutSidebar;
