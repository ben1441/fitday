'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PlanEditor from '@/components/workout/plan-editor';
import { ArrowLeft, Dumbbell } from 'lucide-react';

export default function EditPlanPage() {
  return (
    <div className="min-h-screen bg-background">
       <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary-dark">FitDay</h1>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Workout Plan Editor</h2>
            <p className="text-muted-foreground">
              Customize your weekly workout schedule. Add, remove, and edit exercises for each day.
            </p>
          </div>
          <PlanEditor />
        </div>
      </main>
    </div>
  );
}
