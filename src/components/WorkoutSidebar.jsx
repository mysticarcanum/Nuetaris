import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './WorkoutSidebar.css';

const WorkoutSidebar = () => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredWorkout, setHoveredWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Body part filter options
  const bodyParts = [
    { value: 'all', label: 'All Body Parts' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' },
    { value: 'legs', label: 'Legs' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'full_body', label: 'Full Body' }
  ];

  // Difficulty levels
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Comprehensive workout database with realistic options
  const workoutCategories = {
    strength_training: {
      name: "Strength Training",
      workouts: [
        // Chest Exercises
        {
          name: "Bench Press",
          category: "Push",
          bodyParts: ["chest", "triceps", "shoulders"],
          difficulty: "intermediate",
          timeEstimate: "45 minutes",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell, Bench",
          description: "Compound movement for chest development and pressing strength",
          youtubeUrl: "https://youtu.be/rT7DgCr-3pg",
          benefits: "Builds chest strength and size, improves pressing power, develops triceps"
        },
        {
          name: "Incline Dumbbell Press",
          category: "Push",
          bodyParts: ["chest", "triceps", "shoulders"],
          difficulty: "intermediate",
          timeEstimate: "40 minutes",
          sets: "3",
          reps: "10-12",
          equipment: "Dumbbells, Bench",
          description: "Targets upper chest development with dumbbell variation",
          youtubeUrl: "https://youtu.be/8iNEnVn-8Qc",
          benefits: "Upper chest focus, shoulder stability, unilateral strength"
        },
        {
          name: "Decline Push-ups",
          category: "Push",
          bodyParts: ["chest", "triceps", "shoulders"],
          difficulty: "beginner",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "10-15",
          equipment: "None",
          description: "Bodyweight exercise targeting lower chest",
          youtubeUrl: "https://youtu.be/0PkyZ7ejg-o",
          benefits: "No equipment needed, chest development, core engagement"
        },
        // Back Exercises
        {
          name: "Pull-ups",
          category: "Pull",
          bodyParts: ["back", "biceps", "shoulders"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "3",
          reps: "8-12",
          equipment: "Pull-up Bar",
          description: "Compound back exercise for width and pulling strength",
          youtubeUrl: "https://youtu.be/eGo4IYlbE5g",
          benefits: "Back width, grip strength, bodyweight exercise"
        },
        {
          name: "Barbell Rows",
          category: "Pull",
          bodyParts: ["back", "biceps"],
          difficulty: "intermediate",
          timeEstimate: "35 minutes",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell",
          description: "Thickens middle back and improves posture",
          youtubeUrl: "https://youtu.be/9efgcAjQe7E",
          benefits: "Back thickness, posture improvement, compound movement"
        },
        {
          name: "Lat Pulldowns",
          category: "Pull",
          bodyParts: ["back", "biceps"],
          difficulty: "beginner",
          timeEstimate: "25 minutes",
          sets: "3",
          reps: "10-12",
          equipment: "Cable Machine",
          description: "Machine-based lat development exercise",
          youtubeUrl: "https://youtu.be/CAwf7n6Luuc",
          benefits: "Lat width, beginner friendly, controlled movement"
        },
        // Shoulder Exercises
        {
          name: "Overhead Press",
          category: "Push",
          bodyParts: ["shoulders", "triceps"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell",
          description: "Develops shoulder strength and stability",
          youtubeUrl: "https://youtu.be/2yjwXTZQDDg",
          benefits: "Shoulder strength, core stability, pressing power"
        },
        {
          name: "Lateral Raises",
          category: "Push",
          bodyParts: ["shoulders"],
          difficulty: "beginner",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "12-15",
          equipment: "Dumbbells",
          description: "Isolates lateral deltoids for shoulder width",
          youtubeUrl: "https://youtu.be/3VcKaXpzqRo",
          benefits: "Shoulder width, isolation exercise, light weight"
        },
        // Arm Exercises
        {
          name: "Bicep Curls",
          category: "Pull",
          bodyParts: ["arms"],
          difficulty: "beginner",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "12-15",
          equipment: "Dumbbells",
          description: "Classic bicep isolation exercise",
          youtubeUrl: "https://youtu.be/ykJmrZ5v0Oa",
          benefits: "Bicep development, simple movement, beginner friendly"
        },
        {
          name: "Tricep Dips",
          category: "Push",
          bodyParts: ["arms", "chest"],
          difficulty: "intermediate",
          timeEstimate: "25 minutes",
          sets: "3",
          reps: "8-12",
          equipment: "Dip Bars",
          description: "Compound movement for tricep development",
          youtubeUrl: "https://youtu.be/2z8JmcrW-As",
          benefits: "Tricep strength, chest involvement, bodyweight"
        },
        // Leg Exercises
        {
          name: "Squats",
          category: "Legs",
          bodyParts: ["legs", "glutes", "core"],
          difficulty: "intermediate",
          timeEstimate: "45 minutes",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell",
          description: "King of leg exercises, builds overall leg strength",
          youtubeUrl: "https://youtu.be/YaXPRqUwItQ",
          benefits: "Full leg development, core strength, compound movement"
        },
        {
          name: "Romanian Deadlifts",
          category: "Legs",
          bodyParts: ["legs", "glutes", "back"],
          difficulty: "intermediate",
          timeEstimate: "40 minutes",
          sets: "3-4",
          reps: "8-12",
          equipment: "Barbell",
          description: "Targets hamstrings and improves hip hinge",
          youtubeUrl: "https://youtu.be/1ED-obD0G0Y",
          benefits: "Hamstring development, hip mobility, posterior chain"
        },
        {
          name: "Leg Press",
          category: "Legs",
          bodyParts: ["legs", "glutes"],
          difficulty: "beginner",
          timeEstimate: "30 minutes",
          sets: "3",
          reps: "10-12",
          equipment: "Leg Press Machine",
          description: "Machine-based quad development",
          youtubeUrl: "https://youtu.be/IZxyjW7MP2Q",
          benefits: "Quad development, beginner friendly, controlled movement"
        }
      ]
    },
    pilates: {
      name: "Pilates",
      workouts: [
        {
          name: "Pilates Mat Workout",
          category: "Pilates",
          bodyParts: ["core", "full_body"],
          difficulty: "beginner",
          timeEstimate: "45 minutes",
          sets: "1",
          reps: "Full routine",
          equipment: "Mat",
          description: "Complete Pilates mat workout for core strength and flexibility",
          youtubeUrl: "https://youtu.be/0krBwqXgGtY",
          benefits: "Core strength, flexibility, mind-body connection, posture"
        },
        {
          name: "Pilates for Beginners",
          category: "Pilates",
          bodyParts: ["core", "full_body"],
          difficulty: "beginner",
          timeEstimate: "30 minutes",
          sets: "1",
          reps: "Full routine",
          equipment: "Mat",
          description: "Gentle introduction to Pilates fundamentals",
          youtubeUrl: "https://youtu.be/0krBwqXgGtY",
          benefits: "Core activation, breathing, basic movements"
        },
        {
          name: "Advanced Pilates",
          category: "Pilates",
          bodyParts: ["core", "full_body"],
          difficulty: "advanced",
          timeEstimate: "60 minutes",
          sets: "1",
          reps: "Full routine",
          equipment: "Mat",
          description: "Challenging Pilates workout for experienced practitioners",
          youtubeUrl: "https://youtu.be/0krBwqXgGtY",
          benefits: "Advanced core control, strength, flexibility"
        }
      ]
    },
    yoga: {
      name: "Yoga",
      workouts: [
        {
          name: "15 Minute Meditation",
          category: "Yoga",
          bodyParts: ["mind", "core"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "1",
          reps: "Guided session",
          equipment: "Mat",
          description: "Short meditation session for mindfulness and stress relief",
          youtubeUrl: "https://youtu.be/inpok4MKVLM",
          benefits: "Stress reduction, mental clarity, mindfulness"
        },
        {
          name: "30 Minute Meditation",
          category: "Yoga",
          bodyParts: ["mind", "core"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "1",
          reps: "Guided session",
          equipment: "Mat",
          description: "Extended meditation for deeper relaxation",
          youtubeUrl: "https://youtu.be/inpok4MKVLM",
          benefits: "Deep relaxation, mental focus, stress management"
        },
        {
          name: "45 Minute Meditation",
          category: "Yoga",
          bodyParts: ["mind", "core"],
          difficulty: "intermediate",
          timeEstimate: "45 minutes",
          sets: "1",
          reps: "Guided session",
          equipment: "Mat",
          description: "Longer meditation session for experienced practitioners",
          youtubeUrl: "https://youtu.be/inpok4MKVLM",
          benefits: "Deep mental clarity, extended relaxation"
        },
        {
          name: "1 Hour Meditation",
          category: "Yoga",
          bodyParts: ["mind", "core"],
          difficulty: "advanced",
          timeEstimate: "60 minutes",
          sets: "1",
          reps: "Guided session",
          equipment: "Mat",
          description: "Extended meditation for advanced practitioners",
          youtubeUrl: "https://youtu.be/inpok4MKVLM",
          benefits: "Deep mental state, advanced mindfulness"
        },
        {
          name: "Vinyasa Flow",
          category: "Yoga",
          bodyParts: ["full_body", "core"],
          difficulty: "intermediate",
          timeEstimate: "45 minutes",
          sets: "1",
          reps: "Full flow",
          equipment: "Mat",
          description: "Dynamic yoga flow connecting breath with movement",
          youtubeUrl: "https://youtu.be/9WzX7ODGI84",
          benefits: "Flexibility, strength, breath control, flow"
        },
        {
          name: "Hatha Yoga",
          category: "Yoga",
          bodyParts: ["full_body", "core"],
          difficulty: "beginner",
          timeEstimate: "30 minutes",
          sets: "1",
          reps: "Full session",
          equipment: "Mat",
          description: "Gentle yoga focusing on basic poses and breathing",
          youtubeUrl: "https://youtu.be/9WzX7ODGI84",
          benefits: "Flexibility, relaxation, basic poses, breathing"
        },
        {
          name: "Power Yoga",
          category: "Yoga",
          bodyParts: ["full_body", "core"],
          difficulty: "advanced",
          timeEstimate: "60 minutes",
          sets: "1",
          reps: "Full session",
          equipment: "Mat",
          description: "Intense yoga workout combining strength and flexibility",
          youtubeUrl: "https://youtu.be/9WzX7ODGI84",
          benefits: "Strength, flexibility, endurance, mental focus"
        }
      ]
    },
    hiit: {
      name: "HIIT & Cardio",
      workouts: [
        {
          name: "15 Minute HIIT",
          category: "HIIT",
          bodyParts: ["full_body", "cardio"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "1",
          reps: "Full session",
          equipment: "None",
          description: "High intensity interval training for quick cardio",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Quick cardio, fat burning, time efficient"
        },
        {
          name: "30 Minute HIIT",
          category: "HIIT",
          bodyParts: ["full_body", "cardio"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "1",
          reps: "Full session",
          equipment: "None",
          description: "Extended high intensity interval training",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Cardio endurance, fat burning, strength"
        },
        {
          name: "45 Minute HIIT",
          category: "HIIT",
          bodyParts: ["full_body", "cardio"],
          difficulty: "advanced",
          timeEstimate: "45 minutes",
          sets: "1",
          reps: "Full session",
          equipment: "None",
          description: "Longer high intensity interval training session",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Extended cardio, endurance, strength"
        },
        {
          name: "15 Minute Run",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "1",
          reps: "Steady pace",
          equipment: "Treadmill/Track",
          description: "Steady state cardio endurance",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Cardio fitness, leg strength, endurance"
        },
        {
          name: "30 Minute Run",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "1",
          reps: "Steady pace",
          equipment: "Treadmill/Track",
          description: "Extended cardio endurance",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Extended cardio, endurance building"
        },
        {
          name: "45 Minute Run",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "intermediate",
          timeEstimate: "45 minutes",
          sets: "1",
          reps: "Steady pace",
          equipment: "Treadmill/Track",
          description: "Long distance cardio training",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Long distance cardio, endurance"
        },
        {
          name: "1 Hour Run",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "advanced",
          timeEstimate: "60 minutes",
          sets: "1",
          reps: "Steady pace",
          equipment: "Treadmill/Track",
          description: "Endurance building and fat burning",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Endurance, fat burning, mental toughness"
        },
        {
          name: "2 Hour Run",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "advanced",
          timeEstimate: "120 minutes",
          sets: "1",
          reps: "Steady pace",
          equipment: "Treadmill/Track",
          description: "Ultra endurance training",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Ultra endurance, mental strength"
        },
        {
          name: "Cycling Intervals",
          category: "Cardio",
          bodyParts: ["legs", "cardio"],
          difficulty: "intermediate",
          timeEstimate: "30 minutes",
          sets: "6",
          reps: "2 minutes hard, 1 minute easy",
          equipment: "Stationary Bike",
          description: "Low impact high intensity cardio",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Low impact, high intensity, leg strength"
        },
        {
          name: "Rowing Intervals",
          category: "Cardio",
          bodyParts: ["full_body", "cardio"],
          difficulty: "intermediate",
          timeEstimate: "25 minutes",
          sets: "8",
          reps: "1 minute hard, 1 minute easy",
          equipment: "Rowing Machine",
          description: "Full body cardio exercise",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Full body cardio, low impact, strength"
        }
      ]
    },
    bodyweight: {
      name: "Bodyweight",
      workouts: [
        {
          name: "Push-ups",
          category: "Bodyweight",
          bodyParts: ["chest", "arms", "shoulders"],
          difficulty: "beginner",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "10-20",
          equipment: "None",
          description: "Classic upper body strength exercise",
          youtubeUrl: "https://youtu.be/IODxDxX7oi4",
          benefits: "Upper body strength, no equipment, scalable"
        },
        {
          name: "Pull-ups",
          category: "Bodyweight",
          bodyParts: ["back", "arms"],
          difficulty: "intermediate",
          timeEstimate: "25 minutes",
          sets: "3",
          reps: "5-15",
          equipment: "Pull-up Bar",
          description: "Upper body pulling strength",
          youtubeUrl: "https://youtu.be/eGo4IYlbE5g",
          benefits: "Back strength, grip strength, bodyweight"
        },
        {
          name: "Dips",
          category: "Bodyweight",
          bodyParts: ["arms", "chest"],
          difficulty: "intermediate",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "8-15",
          equipment: "Dip Bars",
          description: "Upper body pushing strength",
          youtubeUrl: "https://youtu.be/2z8JmcrW-As",
          benefits: "Tricep strength, chest involvement"
        },
        {
          name: "Squats",
          category: "Bodyweight",
          bodyParts: ["legs", "glutes"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "3",
          reps: "15-25",
          equipment: "None",
          description: "Lower body strength foundation",
          youtubeUrl: "https://youtu.be/YaXPRqUwItQ",
          benefits: "Leg strength, no equipment, scalable"
        },
        {
          name: "Lunges",
          category: "Bodyweight",
          bodyParts: ["legs", "glutes"],
          difficulty: "beginner",
          timeEstimate: "20 minutes",
          sets: "3",
          reps: "10-15 each leg",
          equipment: "None",
          description: "Unilateral leg strength",
          youtubeUrl: "https://youtu.be/3XDriUn0udo",
          benefits: "Unilateral strength, balance, leg development"
        },
        {
          name: "Plank",
          category: "Bodyweight",
          bodyParts: ["core"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "3",
          reps: "30-60 seconds",
          equipment: "None",
          description: "Core stability and endurance",
          youtubeUrl: "https://youtu.be/ASdvN_XEl_c",
          benefits: "Core strength, stability, no equipment"
        },
        {
          name: "Side Plank",
          category: "Bodyweight",
          bodyParts: ["core"],
          difficulty: "intermediate",
          timeEstimate: "15 minutes",
          sets: "3",
          reps: "30-45 seconds each side",
          equipment: "None",
          description: "Lateral core stability",
          youtubeUrl: "https://youtu.be/ASdvN_XEl_c",
          benefits: "Lateral core strength, balance"
        },
        {
          name: "Glute Bridges",
          category: "Bodyweight",
          bodyParts: ["glutes", "core"],
          difficulty: "beginner",
          timeEstimate: "15 minutes",
          sets: "3",
          reps: "15-20",
          equipment: "None",
          description: "Glute activation and strength",
          youtubeUrl: "https://youtu.be/OUgsJ8RpQqY",
          benefits: "Glute activation, core engagement"
        },
        {
          name: "Wall Sit",
          category: "Bodyweight",
          bodyParts: ["legs", "glutes"],
          difficulty: "beginner",
          timeEstimate: "10 minutes",
          sets: "3",
          reps: "30-60 seconds",
          equipment: "Wall",
          description: "Isometric leg strength",
          youtubeUrl: "https://youtu.be/YaXPRqUwItQ",
          benefits: "Isometric strength, endurance"
        },
        {
          name: "Handstand Hold",
          category: "Bodyweight",
          bodyParts: ["shoulders", "core"],
          difficulty: "advanced",
          timeEstimate: "30 minutes",
          sets: "3",
          reps: "10-30 seconds",
          equipment: "Wall",
          description: "Advanced shoulder strength and balance",
          youtubeUrl: "https://youtu.be/0WxPvV8y5t4",
          benefits: "Shoulder strength, balance, advanced skill"
        }
      ]
    }
  };

  // Search and filter functionality
  const filteredWorkouts = useMemo(() => {
    let filtered = {};
    
    Object.entries(workoutCategories).forEach(([key, category]) => {
      const filteredWorkouts = category.workouts.filter(workout => {
        const matchesSearch = !searchTerm || 
          workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workout.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workout.bodyParts.some(part => 
            part.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          workout.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBodyPart = selectedBodyPart === 'all' || 
          workout.bodyParts.includes(selectedBodyPart);
        
        const matchesDifficulty = selectedDifficulty === 'all' || 
          workout.difficulty === selectedDifficulty;
        
        return matchesSearch && matchesBodyPart && matchesDifficulty;
      });
      
      if (filteredWorkouts.length > 0) {
        filtered[key] = {
          ...category,
          workouts: filteredWorkouts
        };
      }
    });
    
    return filtered;
  }, [searchTerm, selectedBodyPart, selectedDifficulty]);

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
            X
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Body Part:</label>
          <select
            value={selectedBodyPart}
            onChange={(e) => setSelectedBodyPart(e.target.value)}
            className="filter-select"
          >
            {bodyParts.map(part => (
              <option key={part.value} value={part.value}>
                {part.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>
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
                  <div className="exercise-time">{workout.timeEstimate}</div>
                  <div className="exercise-difficulty">{workout.difficulty}</div>
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
              <strong>Body Parts:</strong>
              <div className="body-part-tags">
                {hoveredWorkout.bodyParts.map(part => (
                  <span key={part} className="body-part-tag">{part}</span>
                ))}
              </div>
            </div>
            <div className="tooltip-section">
              <strong>Difficulty:</strong>
              <span>{hoveredWorkout.difficulty}</span>
            </div>
            <div className="tooltip-section">
              <strong>Time:</strong>
              <span>{hoveredWorkout.timeEstimate}</span>
            </div>
            <div className="tooltip-section">
              <strong>Equipment:</strong>
              <span>{workout.equipment}</span>
            </div>
            <div className="tooltip-section">
              <strong>Description:</strong>
              <p>{hoveredWorkout.description}</p>
            </div>
            <div className="tooltip-section">
              <strong>Benefits:</strong>
              <p>{hoveredWorkout.benefits}</p>
            </div>
            <div className="tooltip-section">
              <strong>Video:</strong>
              <a href={hoveredWorkout.youtubeUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                Watch Tutorial
              </a>
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
    bodyParts: '',
    difficulty: '',
    timeEstimate: '',
    sets: '',
    reps: '',
    equipment: '',
    description: '',
    benefits: '',
    youtubeUrl: ''
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
              <option value="Yoga">Yoga</option>
              <option value="HIIT">HIIT</option>
              <option value="Cardio">Cardio</option>
              <option value="Bodyweight">Bodyweight</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Body Parts (comma separated)</label>
            <input
              type="text"
              value={formData.bodyParts}
              onChange={(e) => setFormData({...formData, bodyParts: e.target.value})}
              placeholder="e.g., chest, triceps, shoulders"
            />
          </div>
          
          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            >
              <option value="">Select Difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Time Estimate</label>
            <input
              type="text"
              value={formData.timeEstimate}
              onChange={(e) => setFormData({...formData, timeEstimate: e.target.value})}
              placeholder="e.g., 30 minutes"
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
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the exercise"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Benefits</label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              placeholder="Describe the benefits"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>YouTube URL (optional)</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
              placeholder="https://youtu.be/..."
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
