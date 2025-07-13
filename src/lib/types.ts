export type Exercise = {
  id: string;
  name: string;
  sets: string;
  notes: string;
};

export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export const weekDays: Day[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export type WorkoutPlan = Record<Day, Exercise[]>;

export type CompletionData = Record<string, boolean>; // "YYYY-MM-DD": true
