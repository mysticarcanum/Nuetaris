import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './WorkoutSidebar.css';

// Preloaded workout database
const workoutDatabase = [
  // Push Day Exercises
  {
    name: "Bench Press",
    category: "push",
    muscleGroups: ["chest", "triceps", "shoulders"],
    difficulty: "intermediate",
    estimatedTime: "45 minutes",
    benefits: ["Upper body strength", "Chest development", "Tricep activation"],
    instructions: [
      "Lie on bench with feet flat on ground",
      "Grip bar slightly wider than shoulder width",
      "Lower bar to chest with control",
      "Press bar back up to starting position"
    ],
    tips: "Keep your core tight and maintain proper form throughout the movement",
    youtubeUrl: "https://youtu.be/rT7DgCr-3pg",
    calories: 180,
    equipment: ["barbell", "bench"],
    variations: ["Dumbbell Bench Press", "Incline Bench Press", "Decline Bench Press"]
  },
  {
    name: "Overhead Press",
    category: "push",
    muscleGroups: ["shoulders", "triceps"],
    difficulty: "intermediate",
    estimatedTime: "30 minutes",
    benefits: ["Shoulder strength", "Core stability", "Upper body power"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold barbell at shoulder level",
      "Press bar overhead while keeping core tight",
      "Lower bar back to starting position"
    ],
    tips: "Keep your core engaged and avoid arching your back",
    youtubeUrl: "https://youtu.be/2yjwXTZQDDg",
    calories: 150,
    equipment: ["barbell"],
    variations: ["Dumbbell Press", "Push Press", "Arnold Press"]
  },
  {
    name: "Dumbbell Flyes",
    category: "push",
    muscleGroups: ["chest"],
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    benefits: ["Chest isolation", "Muscle definition", "Range of motion"],
    instructions: [
      "Lie on bench with dumbbells held above chest",
      "Lower dumbbells in arc motion",
      "Feel stretch in chest muscles",
      "Return to starting position"
    ],
    tips: "Keep slight bend in elbows throughout movement",
    youtubeUrl: "https://youtu.be/eozdVDA78K0",
    calories: 120,
    equipment: ["dumbbells", "bench"],
    variations: ["Cable Flyes", "Incline Flyes", "Decline Flyes"]
  },
  {
    name: "Tricep Dips",
    category: "push",
    muscleGroups: ["triceps", "chest"],
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    benefits: ["Tricep strength", "Bodyweight exercise", "Compound movement"],
    instructions: [
      "Grip parallel bars with arms extended",
      "Lower body by bending elbows",
      "Keep elbows close to body",
      "Push back up to starting position"
    ],
    tips: "Keep your body upright and avoid swinging",
    youtubeUrl: "https://youtu.be/2z8JmcrW-As",
    calories: 100,
    equipment: ["parallel bars"],
    variations: ["Ring Dips", "Assisted Dips", "Weighted Dips"]
  },

  // Pull Day Exercises
  {
    name: "Deadlift",
    category: "pull",
    muscleGroups: ["back", "legs", "core"],
    difficulty: "advanced",
    estimatedTime: "60 minutes",
    benefits: ["Full body strength", "Posture improvement", "Hip hinge pattern"],
    instructions: [
      "Stand with feet hip-width apart",
      "Grip bar with hands outside knees",
      "Keep chest up and back straight",
      "Lift bar by extending hips and knees"
    ],
    tips: "Focus on hip hinge movement, not squatting",
    youtubeUrl: "https://youtu.be/1ZXobu7JvvE",
    calories: 250,
    equipment: ["barbell"],
    variations: ["Romanian Deadlift", "Sumo Deadlift", "Trap Bar Deadlift"]
  },
  {
    name: "Pull-ups",
    category: "pull",
    muscleGroups: ["back", "biceps"],
    difficulty: "intermediate",
    estimatedTime: "30 minutes",
    benefits: ["Upper body strength", "Back development", "Bodyweight exercise"],
    instructions: [
      "Hang from pull-up bar with hands wider than shoulders",
      "Pull body up until chin over bar",
      "Lower body with control",
      "Repeat movement"
    ],
    tips: "Engage your lats and avoid swinging",
    youtubeUrl: "https://youtu.be/eGo4IYlbE5g",
    calories: 140,
    equipment: ["pull-up bar"],
    variations: ["Assisted Pull-ups", "Wide Grip Pull-ups", "Weighted Pull-ups"]
  },
  {
    name: "Barbell Rows",
    category: "pull",
    muscleGroups: ["back", "biceps"],
    difficulty: "intermediate",
    estimatedTime: "40 minutes",
    benefits: ["Back thickness", "Posture correction", "Compound movement"],
    instructions: [
      "Bend at hips and knees, chest parallel to ground",
      "Grip bar with hands shoulder-width apart",
      "Pull bar to lower chest",
      "Lower bar with control"
    ],
    tips: "Keep your back straight and squeeze shoulder blades",
    youtubeUrl: "https://youtu.be/9efgcAjQe7E",
    calories: 180,
    equipment: ["barbell"],
    variations: ["Dumbbell Rows", "T-Bar Rows", "Cable Rows"]
  },
  {
    name: "Bicep Curls",
    category: "pull",
    muscleGroups: ["biceps"],
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    benefits: ["Arm development", "Isolation exercise", "Muscle definition"],
    instructions: [
      "Stand with dumbbells at sides",
      "Curl dumbbells up to shoulders",
      "Lower dumbbells with control",
      "Repeat movement"
    ],
    tips: "Keep elbows at sides and avoid swinging",
    youtubeUrl: "https://youtu.be/ykJmrZ5v0Oo",
    calories: 100,
    equipment: ["dumbbells"],
    variations: ["Hammer Curls", "Preacher Curls", "Cable Curls"]
  },

  // Leg Day Exercises
  {
    name: "Squats",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    difficulty: "intermediate",
    estimatedTime: "50 minutes",
    benefits: ["Lower body strength", "Core stability", "Functional movement"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body as if sitting back",
      "Keep knees in line with toes",
      "Return to standing position"
    ],
    tips: "Keep chest up and weight in heels",
    youtubeUrl: "https://youtu.be/YaXPRqUwqQw",
    calories: 200,
    equipment: ["barbell"],
    variations: ["Bodyweight Squats", "Front Squats", "Goblet Squats"]
  },
  {
    name: "Romanian Deadlift",
    category: "legs",
    muscleGroups: ["hamstrings", "glutes", "lower back"],
    difficulty: "intermediate",
    estimatedTime: "35 minutes",
    benefits: ["Hamstring development", "Hip hinge pattern", "Posterior chain"],
    instructions: [
      "Stand with feet hip-width apart",
      "Hinge at hips, keeping legs straight",
      "Lower bar along legs",
      "Return to standing position"
    ],
    tips: "Feel stretch in hamstrings, not lower back",
    youtubeUrl: "https://youtu.be/1Tq3QdYUuHs",
    calories: 160,
    equipment: ["barbell"],
    variations: ["Dumbbell RDL", "Single Leg RDL", "Cable RDL"]
  },
  {
    name: "Leg Press",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes"],
    difficulty: "beginner",
    estimatedTime: "40 minutes",
    benefits: ["Leg strength", "Machine safety", "High volume potential"],
    instructions: [
      "Sit in leg press machine",
      "Place feet shoulder-width on platform",
      "Press platform away from body",
      "Return to starting position"
    ],
    tips: "Keep lower back pressed against seat",
    youtubeUrl: "https://youtu.be/IZxyjW7MPJQ",
    calories: 180,
    equipment: ["leg press machine"],
    variations: ["High Foot Placement", "Low Foot Placement", "Single Leg Press"]
  },
  {
    name: "Calf Raises",
    category: "legs",
    muscleGroups: ["calves"],
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    benefits: ["Calf development", "Ankle stability", "Lower leg strength"],
    instructions: [
      "Stand on edge of step or platform",
      "Raise heels as high as possible",
      "Lower heels below step level",
      "Repeat movement"
    ],
    tips: "Focus on full range of motion",
    youtubeUrl: "https://youtu.be/JbyjNymZOt0",
    calories: 80,
    equipment: ["step or platform"],
    variations: ["Seated Calf Raises", "Donkey Calf Raises", "Single Leg Raises"]
  },

  // Cardio Exercises
  {
    name: "Running",
    category: "cardio",
    muscleGroups: ["legs", "core"],
    difficulty: "beginner",
    estimatedTime: "30-60 minutes",
    benefits: ["Cardiovascular health", "Endurance", "Calorie burn"],
    instructions: [
      "Start with proper warm-up",
      "Maintain steady pace",
      "Focus on breathing rhythm",
      "Cool down properly"
    ],
    tips: "Start slow and gradually increase intensity",
    youtubeUrl: "https://youtu.be/5bEP0aJhxqY",
    calories: 300,
    equipment: ["running shoes"],
    variations: ["Sprint Intervals", "Long Distance", "Trail Running"]
  },
  {
    name: "Cycling",
    category: "cardio",
    muscleGroups: ["legs"],
    difficulty: "beginner",
    estimatedTime: "45-90 minutes",
    benefits: ["Low impact cardio", "Leg strength", "Endurance"],
    instructions: [
      "Adjust seat to proper height",
      "Maintain steady cadence",
      "Vary resistance levels",
      "Stay hydrated"
    ],
    tips: "Keep your core engaged and maintain good posture",
    youtubeUrl: "https://youtu.be/7yqJj7WqX7I",
    calories: 250,
    equipment: ["bicycle or stationary bike"],
    variations: ["Indoor Cycling", "Mountain Biking", "Road Cycling"]
  },
  {
    name: "Jump Rope",
    category: "cardio",
    muscleGroups: ["legs", "shoulders", "core"],
    difficulty: "beginner",
    estimatedTime: "15-30 minutes",
    benefits: ["Coordination", "Cardiovascular fitness", "Full body workout"],
    instructions: [
      "Hold rope handles at hip level",
      "Jump with both feet together",
      "Keep jumps small and controlled",
      "Maintain rhythm"
    ],
    tips: "Start slow and focus on form before speed",
    youtubeUrl: "https://youtu.be/1BZM2Vre5oc",
    calories: 200,
    equipment: ["jump rope"],
    variations: ["Single Leg Jumps", "High Knees", "Double Unders"]
  },

  // Modern Pilates
  {
    name: "Pilates Hundred",
    category: "pilates",
    muscleGroups: ["core", "shoulders"],
    difficulty: "beginner",
    estimatedTime: "10 minutes",
    benefits: ["Core strength", "Breathing control", "Mind-body connection"],
    instructions: [
      "Lie on back with knees bent",
      "Lift head and shoulders off mat",
      "Extend arms and legs",
      "Pump arms up and down 100 times"
    ],
    tips: "Keep your core engaged and maintain steady breathing",
    youtubeUrl: "https://youtu.be/8jqXqQqQqQ",
    calories: 60,
    equipment: ["mat"],
    variations: ["Modified Hundred", "Advanced Hundred", "Standing Hundred"]
  },
  {
    name: "Pilates Roll Up",
    category: "pilates",
    muscleGroups: ["core", "back"],
    difficulty: "intermediate",
    estimatedTime: "15 minutes",
    benefits: ["Spinal flexibility", "Core control", "Posture improvement"],
    instructions: [
      "Lie on back with arms overhead",
      "Roll up vertebra by vertebra",
      "Reach toward toes",
      "Roll back down with control"
    ],
    tips: "Move slowly and feel each vertebra",
    youtubeUrl: "https://youtu.be/9jqXqQqQqQ",
    calories: 80,
    equipment: ["mat"],
    variations: ["Modified Roll Up", "Roll Up with Twist", "Standing Roll Up"]
  },

  // Le Sserafim Style HIIT
  {
    name: "High Knees",
    category: "hiit",
    muscleGroups: ["legs", "core"],
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    benefits: ["Cardiovascular fitness", "Coordination", "High intensity"],
    instructions: [
      "Stand in place or jog slowly",
      "Drive knees up toward chest",
      "Pump arms in rhythm",
      "Maintain high tempo"
    ],
    tips: "Keep your core engaged and land softly",
    youtubeUrl: "https://youtu.be/7jqXqQqQqQ",
    calories: 150,
    equipment: ["none"],
    variations: ["High Knees with Twist", "High Knees with Punch", "High Knees Sprint"]
  },
  {
    name: "Burpees",
    category: "hiit",
    muscleGroups: ["full body"],
    difficulty: "intermediate",
    estimatedTime: "25 minutes",
    benefits: ["Full body workout", "High intensity", "Calorie burn"],
    instructions: [
      "Start standing, drop to plank",
      "Perform push-up",
      "Jump feet forward",
      "Jump up with arms overhead"
    ],
    tips: "Maintain good form even when tired",
    youtubeUrl: "https://youtu.be/8jqXqQqQqQ",
    calories: 180,
    equipment: ["none"],
    variations: ["Modified Burpees", "Burpee Pull-ups", "Burpee Box Jumps"]
  },
  {
    name: "Mountain Climbers",
    category: "hiit",
    muscleGroups: ["core", "shoulders", "legs"],
    difficulty: "beginner",
    estimatedTime: "15 minutes",
    benefits: ["Core strength", "Cardiovascular fitness", "Coordination"],
    instructions: [
      "Start in plank position",
      "Drive knees alternately toward chest",
      "Keep hips level",
      "Maintain steady pace"
    ],
    tips: "Keep your core tight and avoid hip movement",
    youtubeUrl: "https://youtu.be/9jqXqQqQqQ",
    calories: 120,
    equipment: ["none"],
    variations: ["Cross Body Climbers", "Spider Climbers", "Mountain Climber Twist"]
  },

  // Yoga/Meditation
  {
    name: "Sun Salutation",
    category: "yoga",
    muscleGroups: ["full body"],
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    benefits: ["Flexibility", "Mind-body connection", "Stress relief"],
    instructions: [
      "Start in mountain pose",
      "Forward fold",
      "Half lift",
      "Plank to chaturanga",
      "Upward dog",
      "Downward dog",
      "Return to standing"
    ],
    tips: "Move with your breath and focus on alignment",
    youtubeUrl: "https://youtu.be/10jqXqQqQq",
    calories: 100,
    equipment: ["mat"],
    variations: ["Modified Sun Salutation", "Power Sun Salutation", "Gentle Sun Salutation"]
  },
  {
    name: "Warrior Pose",
    category: "yoga",
    muscleGroups: ["legs", "core", "shoulders"],
    difficulty: "beginner",
    estimatedTime: "15 minutes",
    benefits: ["Leg strength", "Balance", "Focus"],
    instructions: [
      "Step one foot back",
      "Bend front knee to 90 degrees",
      "Arms overhead or at sides",
      "Hold pose with steady breath"
    ],
    tips: "Keep your back leg straight and front knee over ankle",
    youtubeUrl: "https://youtu.be/11jqXqQqQq",
    calories: 80,
    equipment: ["mat"],
    variations: ["Warrior I", "Warrior II", "Warrior III"]
  }
];

// AI-powered workout suggestion service
class WorkoutSuggestionService {
  static searchCache = new Map();
  
  static async getWorkoutSuggestions(query) {
    const searchTerm = query.toLowerCase();
    const cacheKey = `workout_suggestions_${searchTerm}`;
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }
    
    // Search in database
    const suggestions = workoutDatabase
      .filter(workout => 
        workout.name.toLowerCase().includes(searchTerm) ||
        workout.muscleGroups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm)
        ) ||
        workout.benefits.some(benefit => 
          benefit.toLowerCase().includes(searchTerm)
        )
      )
      .slice(0, 5)
      .map(workout => workout.name);
    
    this.searchCache.set(cacheKey, suggestions);
    return suggestions;
  }
  
  static estimateWorkoutFromName(workoutName) {
    const name = workoutName.toLowerCase();
    
    // Quick estimation based on workout characteristics
    if (name.includes('cardio') || name.includes('run') || name.includes('jog')) {
      return {
        name: workoutName,
        category: "cardio",
        muscleGroups: ["legs", "core"],
        difficulty: "beginner",
        estimatedTime: "30 minutes",
        benefits: ["Cardiovascular health", "Endurance", "Calorie burn"],
        instructions: ["Start with warm-up", "Maintain steady pace", "Focus on breathing", "Cool down properly"],
        tips: "Start slow and gradually increase intensity",
        youtubeUrl: "https://youtu.be/generic-cardio",
        calories: 250,
        equipment: ["comfortable shoes"],
        variations: ["Interval Training", "Long Distance", "Tempo Runs"]
      };
    }
    
    if (name.includes('strength') || name.includes('weight') || name.includes('lift')) {
      return {
        name: workoutName,
        category: "strength",
        muscleGroups: ["full body"],
        difficulty: "intermediate",
        estimatedTime: "45 minutes",
        benefits: ["Muscle building", "Strength gains", "Metabolic boost"],
        instructions: ["Warm up properly", "Focus on form", "Progressive overload", "Rest between sets"],
        tips: "Quality over quantity - proper form is key",
        youtubeUrl: "https://youtu.be/generic-strength",
        calories: 200,
        equipment: ["weights"],
        variations: ["Bodyweight", "Dumbbells", "Barbell"]
      };
    }
    
    if (name.includes('yoga') || name.includes('stretch') || name.includes('flexibility')) {
      return {
        name: workoutName,
        category: "yoga",
        muscleGroups: ["full body"],
        difficulty: "beginner",
        estimatedTime: "30 minutes",
        benefits: ["Flexibility", "Stress relief", "Mind-body connection"],
        instructions: ["Breathe deeply", "Move slowly", "Listen to your body", "Hold poses"],
        tips: "Don't force any movements - go to your edge, not beyond",
        youtubeUrl: "https://youtu.be/generic-yoga",
        calories: 120,
        equipment: ["mat"],
        variations: ["Gentle Yoga", "Power Yoga", "Restorative Yoga"]
      };
    }
    
    if (name.includes('hiit') || name.includes('interval') || name.includes('circuit')) {
      return {
        name: workoutName,
        category: "hiit",
        muscleGroups: ["full body"],
        difficulty: "intermediate",
        estimatedTime: "25 minutes",
        benefits: ["High intensity", "Calorie burn", "Metabolic boost"],
        instructions: ["Warm up thoroughly", "Work hard during intervals", "Rest between sets", "Cool down"],
        tips: "Push yourself but maintain good form",
        youtubeUrl: "https://youtu.be/generic-hiit",
        calories: 300,
        equipment: ["none"],
        variations: ["Tabata", "Circuit Training", "AMRAP"]
      };
    }
    
    // Default estimation
    return {
      name: workoutName,
      category: "general",
      muscleGroups: ["full body"],
      difficulty: "beginner",
      estimatedTime: "30 minutes",
      benefits: ["General fitness", "Health improvement", "Energy boost"],
      instructions: ["Start with warm-up", "Maintain steady pace", "Listen to your body", "Cool down"],
      tips: "Consistency is key - start where you're comfortable",
      youtubeUrl: "https://youtu.be/generic-workout",
      calories: 150,
      equipment: ["none"],
      variations: ["Beginner", "Intermediate", "Advanced"]
    };
  }
  
  static getAllWorkouts() {
    return workoutDatabase.map(workout => workout.name);
  }
  
  static getWorkoutsByCategory(category) {
    return workoutDatabase
      .filter(workout => workout.category === category)
      .map(workout => workout.name);
  }
  
  static getWorkoutByName(name) {
    return workoutDatabase.find(workout => 
      workout.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  static clearCache() {
    this.searchCache.clear();
  }
}

const WorkoutSidebar = ({ onWorkoutSelect, selectedWorkout }) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hoveredWorkout, setHoveredWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isEstimating, setIsEstimating] = useState(false);

  // Category filter options
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'push', label: 'Push Day' },
    { value: 'pull', label: 'Pull Day' },
    { value: 'legs', label: 'Leg Day' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'yoga', label: 'Yoga/Meditation' }
  ];

  // Difficulty filter options
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Enhanced search with AI suggestions
  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    
    if (value.length > 1) {
      try {
        const suggestions = await WorkoutSuggestionService.getWorkoutSuggestions(value);
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Search suggestions failed:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  // Filter workouts based on search and filters
  const filteredWorkouts = useMemo(() => {
    let workouts = WorkoutSuggestionService.getAllWorkouts();
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      workouts = WorkoutSuggestionService.getWorkoutsByCategory(selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      workouts = workouts.filter(workout => {
        const workoutData = WorkoutSuggestionService.getWorkoutByName(workout);
        return workoutData && workoutData.difficulty === selectedDifficulty;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      workouts = workouts.filter(workout => 
        workout.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return workouts.slice(0, 20); // Limit to 20 results
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const handleWorkoutDrag = (e, workout) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(workout));
  };

  const handleCustomWorkout = (customWorkout) => {
    toast.success('Custom workout added!');
    setShowCustomForm(false);
    if (onWorkoutSelect) {
      onWorkoutSelect(customWorkout);
    }
  };

  const toggleWorkoutExpansion = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const handleWorkoutClick = async (workoutName) => {
    try {
      setIsEstimating(true);
      let workoutData = WorkoutSuggestionService.getWorkoutByName(workoutName);
      
      if (!workoutData) {
        // AI estimation for custom workouts
        workoutData = WorkoutSuggestionService.estimateWorkoutFromName(workoutName);
      }
      
      if (workoutData) {
        toast.success(`${workoutName}: ${workoutData.estimatedTime}, ${workoutData.calories} calories`);
        setExpandedWorkout(expandedWorkout === workoutName ? null : workoutName);
        
        // Call the parent component's workout select handler
        if (onWorkoutSelect) {
          onWorkoutSelect(workoutData);
        }
      }
    } catch (error) {
      toast.error('Could not get workout info');
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <motion.div
      className="workout-sidebar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sidebar-header">
        <h3>Workout Plans</h3>
        <motion.button
          className="add-custom-btn"
          onClick={() => setShowCustomForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Custom
        </motion.button>
      </div>

      {/* Enhanced Search with AI Suggestions */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search workouts or type new workout name..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchSuggestions([]);
            }}
            className="clear-search-btn"
          >
            ×
          </button>
        )}
        
        {/* AI Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <div className="search-suggestions">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchTerm(suggestion);
                  setSearchSuggestions([]);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
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
            {difficulties.map(difficulty => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workouts List */}
      <div className="workouts-list">
        {filteredWorkouts.length === 0 ? (
          <div className="no-results">
            <p>No workouts found matching your criteria.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredWorkouts.map((workoutName, index) => {
            const workoutData = WorkoutSuggestionService.getWorkoutByName(workoutName);
            const isSelected = selectedWorkout && selectedWorkout.name === workoutName;
            
            return (
              <motion.div
                key={index}
                className={`workout-item ${isSelected ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleWorkoutDrag(e, workoutName)}
                onClick={() => handleWorkoutClick(workoutName)}
                onMouseEnter={() => setHoveredWorkout(workoutName)}
                onMouseLeave={() => setHoveredWorkout(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="workout-header">
                  <h4>{workoutName}</h4>
                  {workoutData && (
                    <span className="workout-time">{workoutData.estimatedTime}</span>
                  )}
                </div>
                
                {workoutData && (
                  <div className="workout-details">
                    <div className="workout-tags">
                      <span className="difficulty-tag">{workoutData.difficulty}</span>
                      <span className="category-tag">{workoutData.category}</span>
                    </div>
                    
                    <div className="muscle-groups">
                      {workoutData.muscleGroups.slice(0, 3).map((muscle, idx) => (
                        <span key={idx} className="muscle-tag">{muscle}</span>
                      ))}
                    </div>
                    
                    {expandedWorkout === workoutName && (
                      <motion.div
                        className="workout-expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="workout-info">
                          <div className="benefits-section">
                            <h5>Benefits:</h5>
                            <ul>
                              {workoutData.benefits.map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="instructions-section">
                            <h5>Instructions:</h5>
                            <ol>
                              {workoutData.instructions.map((instruction, idx) => (
                                <li key={idx}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                          
                          {workoutData.tips && (
                            <div className="tips-section">
                              <h5>Tips:</h5>
                              <p>{workoutData.tips}</p>
                            </div>
                          )}
                          
                          <div className="workout-meta">
                            <div className="meta-item">
                              <span className="meta-label">Calories:</span>
                              <span className="meta-value">{workoutData.calories}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Equipment:</span>
                              <span className="meta-value">{workoutData.equipment.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

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
    difficulty: '',
    estimatedTime: '',
    calories: '',
    muscleGroups: '',
    benefits: '',
    instructions: '',
    tips: '',
    equipment: '',
    youtubeUrl: ''
  });
  const [isEstimating, setIsEstimating] = useState(false);

  const handleWorkoutNameChange = async (workoutName) => {
    setFormData(prev => ({ ...prev, name: workoutName }));
    
    if (workoutName.length > 2) {
      setIsEstimating(true);
      try {
        const workout = WorkoutSuggestionService.estimateWorkoutFromName(workoutName);
        if (workout) {
          setFormData(prev => ({
            ...prev,
            name: workoutName,
            category: workout.category,
            difficulty: workout.difficulty,
            estimatedTime: workout.estimatedTime,
            calories: workout.calories,
            muscleGroups: Array.isArray(workout.muscleGroups) 
              ? workout.muscleGroups.join(', ') 
              : workout.muscleGroups,
            benefits: Array.isArray(workout.benefits) 
              ? workout.benefits.join('\n') 
              : workout.benefits,
            instructions: Array.isArray(workout.instructions) 
              ? workout.instructions.join('\n') 
              : workout.instructions,
            tips: workout.tips,
            equipment: Array.isArray(workout.equipment) 
              ? workout.equipment.join(', ') 
              : workout.equipment,
            youtubeUrl: workout.youtubeUrl
          }));
          toast.success('Workout estimated from name!');
        }
      } catch (error) {
        toast.error('Could not estimate workout');
      } finally {
        setIsEstimating(false);
      }
    }
  };

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
              onChange={(e) => handleWorkoutNameChange(e.target.value)}
              placeholder="e.g., My Custom HIIT"
              required
            />
            {isEstimating && (
              <div className="ai-estimation-indicator">
                <div className="ai-spinner"></div>
                <span>Analyzing "{formData.name}"...</span>
              </div>
            )}
          </div>
          
          {/* AI Estimation Status */}
          {formData.calories && (
            <div className="ai-estimation-success">
              <span>✓ Workout estimated</span>
              <button 
                type="button"
                onClick={() => setFormData({ name: formData.name })}
                className="clear-estimation-btn"
              >
                Clear & Start Over
              </button>
            </div>
          )}
          
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
