'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkoutPlan, CompletionData } from '@/lib/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

export const useWorkoutData = (userId?: string) => {
  const [plan, setPlan] = useState<WorkoutPlan>(defaultPlan);
  const [completions, setCompletions] = useState<CompletionData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only fetch data if we have a userId and a db connection.
    if (!userId || !db) {
      // If there's no user, we're "loaded" with default data.
      // The auth provider will redirect to login if this is a protected route.
      setIsLoaded(true);
      return;
    }

    const fetchData = async () => {
      setIsLoaded(false);
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setPlan(data.plan || defaultPlan);
          setCompletions(data.completions || {});
        } else {
          // If the user document doesn't exist, create it with the default plan
          await setDoc(userDocRef, { plan: defaultPlan, completions: {} });
          setPlan(defaultPlan);
          setCompletions({});
        }
      } catch (error: any) {
        console.error("Failed to load data from Firestore:", error);
        // On error, fall back to default data to prevent app crash
        setPlan(defaultPlan);
        setCompletions({});
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, [userId]);

  const updatePlan = useCallback(async (newPlan: WorkoutPlan) => {
    if (!userId || !db) return;
    setPlan(newPlan);
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { plan: newPlan, completions }, { merge: true });
    } catch (error) {
      console.error("Failed to save plan to Firestore", error);
    }
  }, [userId, completions]);

  const addCompletion = useCallback(async (date: string) => {
    if (!userId || !db) return;
    const newCompletions = { ...completions, [date]: true };
    setCompletions(newCompletions);
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { plan, completions: newCompletions }, { merge: true });
    } catch (error) {
      console.error("Failed to save completions to Firestore", error);
    }
  }, [userId, plan, completions]);
  
  const totalWorkouts = Object.keys(completions).length;

  const currentStreak = useMemo(() => {
    if (Object.keys(completions).length === 0) return 0;

    let streak = 0;
    let today = new Date();
    
    if (completions[format(today, 'yyyy-MM-dd')]) {
      streak = 1;
      let yesterday = subDays(today, 1);
      while (completions[format(yesterday, 'yyyy-MM-dd')]) {
        streak++;
        yesterday = subDays(yesterday, 1);
      }
    } else {
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
