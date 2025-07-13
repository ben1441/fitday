'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkoutPlan, CompletionData, Day, weekDays } from '@/lib/types';
import { format, subDays } from 'date-fns';

const defaultPlan: WorkoutPlan = {
  sunday: [],
  monday: [
    { id: '1', name: 'Bench Press', sets: '3x5', notes: 'Focus on form' },
    { id: '2', name: 'Squat', sets: '3x5', notes: 'Go deep' },
    { id: '3', name: 'Barbell Row', sets: '3x5', notes: 'Squeeze the back' },
  ],
  tuesday: [],
  wednesday: [
    { id: '1', name: 'Overhead Press', sets: '3x5', notes: '' },
    { id: '2', name: 'Deadlift', sets: '1x5', notes: 'Keep back straight' },
    { id: '3', name: 'Pull-ups', sets: '3xAMRAP', notes: 'As many reps as possible' },
  ],
  thursday: [],
  friday: [
    { id: '1', name: 'Bench Press', sets: '3x5', notes: '' },
    { id: '2', name: 'Squat', sets: '3x5', notes: '' },
    { id: '3', name: 'Barbell Row', sets: '3x5', notes: '' },
  ],
  saturday: [],
};

const WORKOUT_PLAN_KEY = 'fitday_workout_plan';
const COMPLETION_DATA_KEY = 'fitday_completion_data';

export const useWorkoutData = () => {
  const [plan, setPlan] = useState<WorkoutPlan>(defaultPlan);
  const [completions, setCompletions] = useState<CompletionData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(WORKOUT_PLAN_KEY);
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      }

      const savedCompletions = localStorage.getItem(COMPLETION_DATA_KEY);
      if (savedCompletions) {
        setCompletions(JSON.parse(savedCompletions));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updatePlan = useCallback((newPlan: WorkoutPlan) => {
    setPlan(newPlan);
    try {
      localStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(newPlan));
    } catch (error) {
      console.error("Failed to save plan to localStorage", error);
    }
  }, []);

  const addCompletion = useCallback((date: string) => {
    setCompletions(prev => {
      const newCompletions = { ...prev, [date]: true };
      try {
        localStorage.setItem(COMPLETION_DATA_KEY, JSON.stringify(newCompletions));
      } catch (error) {
        console.error("Failed to save completions to localStorage", error);
      }
      return newCompletions;
    });
  }, []);
  
  const totalWorkouts = Object.keys(completions).length;

  const currentStreak = useMemo(() => {
    if (Object.keys(completions).length === 0) return 0;

    let streak = 0;
    let today = new Date();
    
    // check if today is completed, if so, start streak from 1
    if (completions[format(today, 'yyyy-MM-dd')]) {
      streak = 1;
      let yesterday = subDays(today, 1);
      // check previous days
      while (completions[format(yesterday, 'yyyy-MM-dd')]) {
        streak++;
        yesterday = subDays(yesterday, 1);
      }
    } else {
       // if today is not completed, check if yesterday was completed
       let yesterday = subDays(today, 1);
       if(completions[format(yesterday, 'yyyy-MM-dd')]) {
         streak = 1;
         let dayBeforeYesterday = subDays(yesterday, 1);
         while (completions[format(dayBeforeYesterday, 'yyyy-MM-dd')]) {
           streak++;
           dayBeforeYesterday = subDays(dayBeforeYesterday, 1);
         }
       }
    }

    return streak;
  }, [completions]);


  return { plan, updatePlan, completions, addCompletion, totalWorkouts, currentStreak, isLoaded };
};
