'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { CompletionData } from '@/lib/types';

interface WorkoutCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  completions: CompletionData;
}

const WorkoutCalendar: FC<WorkoutCalendarProps> = ({ selectedDate, onDateSelect, completions }) => {
  const completedDays = Object.keys(completions).map(dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Calendar</CardTitle>
        <CardDescription>Green dots show completed workout days.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-0 sm:p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          modifiers={{
            completed: completedDays,
          }}
          modifiersClassNames={{
            completed: 'bg-green-500/20 text-green-600 rounded-full',
          }}
          className="p-0"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          }}
          disabled={{ after: new Date() }}
        />
      </CardContent>
    </Card>
  );
};

export default WorkoutCalendar;
