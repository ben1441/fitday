'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Exercise } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Check, Info } from 'lucide-react';
import { format, isToday } from 'date-fns';

interface DailyWorkoutProps {
  date: Date;
  workout: Exercise[];
  isCompleted: boolean;
  onComplete: () => void;
}

const DailyWorkout: FC<DailyWorkoutProps> = ({ date, workout, isCompleted, onComplete }) => {
  const dayOfWeek = format(date, 'eeee');
  const title = isToday(date) ? "Today's Workout" : `${dayOfWeek}'s Workout`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="capitalize text-2xl">
          {title}
        </CardTitle>
        <CardDescription>
            {format(date, "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {workout.length > 0 ? (
          <div className="space-y-4">
            {workout.map((exercise, index) => (
              <div key={exercise.id}>
                <div className="grid grid-cols-3 gap-4 items-start">
                  <p className="font-semibold col-span-3 sm:col-span-1">{exercise.name}</p>
                  <p className="text-muted-foreground col-span-3 sm:col-span-1 sm:text-center">{exercise.sets}</p>
                  <p className="text-sm text-muted-foreground italic col-span-3 sm:col-span-1 sm:text-right">{exercise.notes}</p>
                </div>
                {index < workout.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full p-8 bg-muted/50 rounded-lg">
            <Info className="w-12 h-12 text-muted-foreground mb-4"/>
            <p className="font-semibold">Rest Day!</p>
            <p className="text-muted-foreground text-sm">No workout scheduled for today. Enjoy your rest!</p>
          </div>
        )}
      </CardContent>
      {workout.length > 0 && (
        <CardFooter className="bg-muted/50 p-4 border-t mt-auto">
          {isCompleted ? (
            <div className="flex items-center text-green-600 font-semibold w-full justify-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Workout completed for this day. Great job!</span>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-semibold">Did you complete this workout?</p>
              <Button onClick={onComplete} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white" disabled={new Date(date) > new Date()}>
                <Check className="mr-2 h-4 w-4" /> Yes, I did!
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyWorkout;
