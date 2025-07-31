import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './WorkoutSidebar.css';

const WorkoutSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredWorkout, setHoveredWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive workout database
  const workoutCategories = {
    strength_training: {
      name: "Strength Training",
      workouts: [
        // Push Day
        {
          name: "Bench Press",
          category: "Push",
          muscleGroups: ["Chest", "Triceps", "Anterior Deltoids"],
          benefits: "Builds chest strength and size, improves pressing power",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell, Bench"
        },
        {
          name: "Overhead Press",
          category: "Push",
          muscleGroups: ["Shoulders", "Triceps"],
          benefits: "Develops shoulder strength and stability",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell"
        },
        {
          name: "Incline Dumbbell Press",
          category: "Push",
          muscleGroups: ["Upper Chest", "Triceps"],
          benefits: "Targets upper chest development",
          sets: "3",
          reps: "10-12",
          equipment: "Dumbbells, Bench"
        },
        {
          name: "Dips",
          category: "Push",
          muscleGroups: ["Chest", "Triceps", "Shoulders"],
          benefits: "Compound movement for upper body strength",
          sets: "3",
          reps: "8-12",
          equipment: "Dip Bars"
        },
        {
          name: "Lateral Raises",
          category: "Push",
          muscleGroups: ["Lateral Deltoids"],
          benefits: "Isolates lateral deltoids for shoulder width",
          sets: "3",
          reps: "12-15",
          equipment: "Dumbbells"
        },
        {
          name: "Tricep Extensions",
          category: "Push",
          muscleGroups: ["Triceps"],
          benefits: "Isolates tricep development",
          sets: "3",
          reps: "12-15",
          equipment: "Cable Machine"
        },
        // Pull Day
        {
          name: "Deadlifts",
          category: "Pull",
          muscleGroups: ["Back", "Hamstrings", "Glutes", "Core"],
          benefits: "Full body compound movement, builds overall strength",
          sets: "3-4",
          reps: "6-8",
          equipment: "Barbell"
        },
        {
          name: "Pull-ups",
          category: "Pull",
          muscleGroups: ["Lats", "Biceps", "Upper Back"],
          benefits: "Develops back width and pulling strength",
          sets: "3",
          reps: "8-12",
          equipment: "Pull-up Bar"
        },
        {
          name: "Barbell Rows",
          category: "Pull",
          muscleGroups: ["Middle Back", "Biceps"],
          benefits: "Thickens middle back and improves posture",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell"
        },
        {
          name: "Lat Pulldowns",
          category: "Pull",
          muscleGroups: ["Lats", "Biceps"],
          benefits: "Alternative to pull-ups, targets lat width",
          sets: "3",
          reps: "10-12",
          equipment: "Cable Machine"
        },
        {
          name: "Face Pulls",
          category: "Pull",
          muscleGroups: ["Rear Deltoids", "Upper Back"],
          benefits: "Improves shoulder health and posture",
          sets: "3",
          reps: "12-15",
          equipment: "Cable Machine"
        },
        {
          name: "Bicep Curls",
          category: "Pull",
          muscleGroups: ["Biceps"],
          benefits: "Isolates bicep development",
          sets: "3",
          reps: "12-15",
          equipment: "Dumbbells"
        },
        // Legs Day
        {
          name: "Squats",
          category: "Legs",
          muscleGroups: ["Quadriceps", "Glutes", "Core"],
          benefits: "King of leg exercises, builds overall leg strength",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell"
        },
        {
          name: "Romanian Deadlifts",
          category: "Legs",
          muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
          benefits: "Targets hamstrings and improves hip hinge",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell"
        },
        {
          name: "Leg Press",
          category: "Legs",
          muscleGroups: ["Quadriceps", "Glutes"],
          benefits: "Machine-based quad development",
          sets: "3",
          reps: "10-12",
          equipment: "Leg Press Machine"
        },
        {
          name: "Leg Extensions",
          category: "Legs",
          muscleGroups: ["Quadriceps"],
          benefits: "Isolates quadriceps development",
          sets: "3",
          reps: "12-15",
          equipment: "Leg Extension Machine"
        },
        {
          name: "Leg Curls",
          category: "Legs",
          muscleGroups: ["Hamstrings"],
          benefits: "Isolates hamstring development",
          sets: "3",
          reps: "12-15",
          equipment: "Leg Curl Machine"
        },
        {
          name: "Calf Raises",
          category: "Legs",
          muscleGroups: ["Calves"],
          benefits: "Develops calf strength and size",
          sets: "4",
          reps: "15-20",
          equipment: "Calf Raise Machine"
        }
      ]
    },
    pilates: {
      name: "Pilates",
      workouts: [
        {
          name: "Hundred",
          category: "Pilates",
          muscleGroups: ["Core", "Shoulders"],
          benefits: "Improves breathing, core strength, and circulation",
          sets: "1",
          reps: "100 breaths",
          equipment: "Mat"
        },
        {
          name: "Roll Up",
          category: "Pilates",
          muscleGroups: ["Core", "Spine"],
          benefits: "Spinal articulation and core control",
          sets: "3",
          reps: "6-8",
          equipment: "Mat"
        },
        {
          name: "Single Leg Stretch",
          category: "Pilates",
          muscleGroups: ["Core", "Hip Flexors"],
          benefits: "Core stability and hip mobility",
          sets: "3",
          reps: "8-10 each side",
          equipment: "Mat"
        },
        {
          name: "Double Leg Stretch",
          category: "Pilates",
          muscleGroups: ["Core", "Shoulders"],
          benefits: "Full body coordination and control",
          sets: "3",
          reps: "8-10",
          equipment: "Mat"
        },
        {
          name: "Scissors",
          category: "Pilates",
          muscleGroups: ["Core", "Hip Flexors"],
          benefits: "Core strength and hip flexibility",
          sets: "3",
          reps: "8-10 each side",
          equipment: "Mat"
        },
        {
          name: "Teaser",
          category: "Pilates",
          muscleGroups: ["Core", "Hip Flexors"],
          benefits: "Advanced core control and balance",
          sets: "3",
          reps: "5-8",
          equipment: "Mat"
        },
        {
          name: "Swan Dive",
          category: "Pilates",
          muscleGroups: ["Back", "Shoulders"],
          benefits: "Back extension and shoulder mobility",
          sets: "3",
          reps: "6-8",
          equipment: "Mat"
        },
        {
          name: "Side Kick Series",
          category: "Pilates",
          muscleGroups: ["Hip Abductors", "Core"],
          benefits: "Hip strength and lateral movement",
          sets: "3",
          reps: "8-10 each side",
          equipment: "Mat"
        },
        {
          name: "Spine Twist",
          category: "Pilates",
          muscleGroups: ["Core", "Spine"],
          benefits: "Spinal rotation and core control",
          sets: "3",
          reps: "6-8 each side",
          equipment: "Mat"
        },
        {
          name: "Leg Pull Front",
          category: "Pilates",
          muscleGroups: ["Core", "Shoulders"],
          benefits: "Plank progression and core stability",
          sets: "3",
          reps: "6-8",
          equipment: "Mat"
        }
      ]
    },
    hiit: {
      name: "HIIT & Cardio",
      workouts: [
        {
          name: "Burpees",
          category: "HIIT",
          muscleGroups: ["Full Body", "Cardio"],
          benefits: "High intensity full body exercise",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "Mountain Climbers",
          category: "HIIT",
          muscleGroups: ["Core", "Cardio"],
          benefits: "Dynamic core exercise with cardio",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "Jump Squats",
          category: "HIIT",
          muscleGroups: ["Legs", "Cardio"],
          benefits: "Explosive leg power and cardio",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "High Knees",
          category: "HIIT",
          muscleGroups: ["Cardio", "Core"],
          benefits: "High intensity cardio exercise",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "Jumping Jacks",
          category: "HIIT",
          muscleGroups: ["Cardio", "Full Body"],
          benefits: "Classic cardio exercise",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "Plank Jacks",
          category: "HIIT",
          muscleGroups: ["Core", "Cardio"],
          benefits: "Core stability with cardio",
          sets: "4",
          reps: "30 seconds",
          equipment: "None"
        },
        {
          name: "Sprint Intervals",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "High intensity sprint training",
          sets: "8",
          reps: "30 seconds sprint, 90 seconds rest",
          equipment: "Treadmill/Track"
        },
        {
          name: "15 Minute Run",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Steady state cardio endurance",
          sets: "1",
          reps: "15 minutes",
          equipment: "Treadmill/Track"
        },
        {
          name: "30 Minute Run",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Extended cardio endurance",
          sets: "1",
          reps: "30 minutes",
          equipment: "Treadmill/Track"
        },
        {
          name: "45 Minute Run",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Long distance cardio training",
          sets: "1",
          reps: "45 minutes",
          equipment: "Treadmill/Track"
        },
        {
          name: "1 Hour Run",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Endurance building and fat burning",
          sets: "1",
          reps: "60 minutes",
          equipment: "Treadmill/Track"
        },
        {
          name: "2 Hour Run",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Ultra endurance training",
          sets: "1",
          reps: "120 minutes",
          equipment: "Treadmill/Track"
        },
        {
          name: "Cycling Intervals",
          category: "Cardio",
          muscleGroups: ["Cardio", "Legs"],
          benefits: "Low impact high intensity cardio",
          sets: "6",
          reps: "2 minutes hard, 1 minute easy",
          equipment: "Stationary Bike"
        },
        {
          name: "Rowing Intervals",
          category: "Cardio",
          muscleGroups: ["Cardio", "Full Body"],
          benefits: "Full body cardio exercise",
          sets: "8",
          reps: "1 minute hard, 1 minute easy",
          equipment: "Rowing Machine"
        }
      ]
    },
    bodyweight: {
      name: "Bodyweight",
      workouts: [
        {
          name: "Push-ups",
          category: "Bodyweight",
          muscleGroups: ["Chest", "Triceps", "Shoulders"],
          benefits: "Classic upper body strength exercise",
          sets: "3",
          reps: "10-20",
          equipment: "None"
        },
        {
          name: "Pull-ups",
          category: "Bodyweight",
          muscleGroups: ["Back", "Biceps"],
          benefits: "Upper body pulling strength",
          sets: "3",
          reps: "5-15",
          equipment: "Pull-up Bar"
        },
        {
          name: "Dips",
          category: "Bodyweight",
          muscleGroups: ["Chest", "Triceps"],
          benefits: "Upper body pushing strength",
          sets: "3",
          reps: "8-15",
          equipment: "Dip Bars"
        },
        {
          name: "Squats",
          category: "Bodyweight",
          muscleGroups: ["Legs", "Glutes"],
          benefits: "Lower body strength foundation",
          sets: "3",
          reps: "15-25",
          equipment: "None"
        },
        {
          name: "Lunges",
          category: "Bodyweight",
          muscleGroups: ["Legs", "Glutes"],
          benefits: "Unilateral leg strength",
          sets: "3",
          reps: "10-15 each leg",
          equipment: "None"
        },
        {
          name: "Plank",
          category: "Bodyweight",
          muscleGroups: ["Core"],
          benefits: "Core stability and endurance",
          sets: "3",
          reps: "30-60 seconds",
          equipment: "None"
        },
        {
          name: "Side Plank",
          category: "Bodyweight",
          muscleGroups: ["Core", "Obliques"],
          benefits: "Lateral core stability",
          sets: "3",
          reps: "30-45 seconds each side",
          equipment: "None"
        },
        {
          name: "Glute Bridges",
          category: "Bodyweight",
          muscleGroups: ["Glutes", "Core"],
          benefits: "Glute activation and strength",
          sets: "3",
          reps: "15-20",
          equipment: "None"
        },
        {
          name: "Wall Sit",
          category: "Bodyweight",
          muscleGroups: ["Legs", "Glutes"],
          benefits: "Isometric leg strength",
          sets: "3",
          reps: "30-60 seconds",
          equipment: "Wall"
        },
        {
          name: "Handstand Hold",
          category: "Bodyweight",
          muscleGroups: ["Shoulders", "Core"],
          benefits: "Advanced shoulder strength and balance",
          sets: "3",
          reps: "10-30 seconds",
          equipment: "Wall"
        }
      ]
    }
  };

  // Search functionality
  const filteredWorkouts = useMemo(() => {
    if (!searchTerm) return workoutCategories;
    
    const filtered = {};
    Object.entries(workoutCategories).forEach(([key, category]) => {
      const filteredWorkouts = category.workouts.filter(workout =>
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.muscleGroups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      if (filteredWorkouts.length > 0) {
        filtered[key] = {
          ...category,
          workouts: filteredWorkouts
        };
      }
    });
    
    return filtered;
  }, [searchTerm]);

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

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="clear-search-btn"
          >
            ✕
          </button>
        )}
      </div>

      <div className="workout-plans">
        {Object.entries(filteredWorkouts).map(([key, category]) => (
          <div key={key} className="workout-plan">
            <h4 className="plan-title">{category.name}</h4>
            <div className="exercises-list">
              {category.workouts.map((workout, index) => (
                <motion.div
                  key={index}
                  className="exercise-item"
                  draggable
                  onDragStart={(e) => handleWorkoutDrag(e, workout)}
                  onMouseEnter={() => setHoveredWorkout(workout)}
                  onMouseLeave={() => setHoveredWorkout(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="exercise-name">{workout.name}</div>
                  <div className="exercise-category">{workout.category}</div>
                  <div className="exercise-details">
                    {workout.sets} sets × {workout.reps}
                  </div>
                  <div className="exercise-equipment">{workout.equipment}</div>
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
              <strong>Category:</strong>
              <span>{hoveredWorkout.category}</span>
            </div>
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
            <div className="tooltip-section">
              <strong>Equipment:</strong>
              <span>{hoveredWorkout.equipment}</span>
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
    category: '',
    muscleGroups: '',
    benefits: '',
    sets: '',
    reps: '',
    equipment: ''
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
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Pilates">Pilates</option>
              <option value="HIIT">HIIT</option>
              <option value="Cardio">Cardio</option>
              <option value="Bodyweight">Bodyweight</option>
            </select>
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
          
          <div className="form-group">
            <label>Equipment</label>
            <input
              type="text"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
              placeholder="e.g., Dumbbells, None"
            />
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
