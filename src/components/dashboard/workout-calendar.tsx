'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { CompletionData } from '@/lib/types';
import { subDays } from 'date-fns';

interface WorkoutCalendarProps {
  completions: CompletionData;
}

const WorkoutCalendar: FC<WorkoutCalendarProps> = ({ completions }) => {
  const completedDays = Object.keys(completions).map(dateStr => new Date(dateStr));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Calendar</CardTitle>
        <CardDescription>Green dots show completed workout days.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={completedDays}
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
          month={subDays(new Date(), 0)}
        />
      </CardContent>
    </Card>
  );
};

export default WorkoutCalendar;
