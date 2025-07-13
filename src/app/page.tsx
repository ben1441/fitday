'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWorkoutData } from '@/hooks/use-workout-data';
import DailyWorkout from '@/components/dashboard/daily-workout';
import StatsCards from '@/components/dashboard/stats-cards';
import WorkoutCalendar from '@/components/dashboard/workout-calendar';
import WeightTrendChart from '@/components/dashboard/weight-trend-chart';
import { Dumbbell, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const {
    plan,
    completions,
    addCompletion,
    totalWorkouts,
    currentStreak,
    isLoaded,
  } = useWorkoutData();

  const today = new Date();
  const dayOfWeek = today
    .toLocaleString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof typeof plan;
  const todaysWorkout = plan[dayOfWeek];
  const todayFormatted = today.toISOString().split('T')[0];
  const isCompletedToday = completions[todayFormatted];

  const MainContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <DailyWorkout
          day={dayOfWeek}
          workout={todaysWorkout}
          isCompleted={isCompletedToday}
          onComplete={() => addCompletion(todayFormatted)}
        />
        <WeightTrendChart />
      </div>
      <div className="space-y-6">
        <StatsCards total={totalWorkouts} streak={currentStreak} />
        <WorkoutCalendar completions={completions} />
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-[365px] rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary-dark">FitDay</h1>
            </div>
            <Button asChild>
              <Link href="/edit-plan">
                <Pencil className="mr-2 h-4 w-4" /> Edit Plan
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoaded ? <MainContent /> : <SkeletonLoader />}
      </main>
    </div>
  );
}
