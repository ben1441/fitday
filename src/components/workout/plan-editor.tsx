'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkoutData } from '@/hooks/use-workout-data';
import type { Day, Exercise, WorkoutPlan } from '@/lib/types';
import { weekDays } from '@/lib/types';
import { Plus, Trash2, Save, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AiSuggestions from './ai-suggestions';

export default function PlanEditor() {
  const { plan: initialPlan, updatePlan, isLoaded } = useWorkoutData();
  const [editedPlan, setEditedPlan] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();
  const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);

  if (!isLoaded) {
    // Or a proper skeleton loader
    return <div>Loading plan...</div>;
  }

  const currentPlan = editedPlan || initialPlan;

  const handleExerciseChange = (day: Day, exerciseId: string, field: keyof Omit<Exercise, 'id'>, value: string) => {
    const planToUpdate = editedPlan || initialPlan;
    const newPlan = { ...planToUpdate };
    const dayExercises = newPlan[day].map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, [field]: value };
      }
      return ex;
    });
    setEditedPlan({ ...newPlan, [day]: dayExercises });
  };

  const addExercise = (day: Day) => {
    const planToUpdate = editedPlan || initialPlan;
    const newPlan = { ...planToUpdate };
    const newExercise: Exercise = {
      id: new Date().toISOString(),
      name: '',
      sets: '',
      notes: '',
    };
    setEditedPlan({ ...newPlan, [day]: [...newPlan[day], newExercise] });
  };

  const removeExercise = (day: Day, exerciseId: string) => {
    const planToUpdate = editedPlan || initialPlan;
    const newPlan = { ...planToUpdate };
    const dayExercises = newPlan[day].filter(ex => ex.id !== exerciseId);
    setEditedPlan({ ...newPlan, [day]: dayExercises });
  };

  const handleSave = () => {
    if (editedPlan) {
      updatePlan(editedPlan);
      toast({
        title: 'Plan Saved!',
        description: 'Your workout plan has been updated successfully.',
      });
      setEditedPlan(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Click on a day to view and edit its workout.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAiSheetOpen(true)}>
                <Bot className="mr-2 h-4 w-4" /> Get AI Suggestions
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monday" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7">
            {weekDays.map(day => (
              <TabsTrigger key={day} value={day} className="capitalize">
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          {weekDays.map(day => (
            <TabsContent key={day} value={day}>
              <div className="space-y-4 pt-4">
                {currentPlan[day].length > 0 ? (
                  currentPlan[day].map(exercise => (
                    <div
                      key={exercise.id}
                      className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center p-3 border rounded-lg"
                    >
                      <Input
                        placeholder="Exercise Name"
                        value={exercise.name}
                        onChange={e => handleExerciseChange(day, exercise.id, 'name', e.target.value)}
                        className="md:col-span-3"
                      />
                      <Input
                        placeholder="Sets x Reps"
                        value={exercise.sets}
                        onChange={e => handleExerciseChange(day, exercise.id, 'sets', e.target.value)}
                        className="md:col-span-2"
                      />
                      <Textarea
                        placeholder="Notes (e.g., focus on form)"
                        value={exercise.notes}
                        onChange={e => handleExerciseChange(day, exercise.id, 'notes', e.target.value)}
                        className="md:col-span-2 h-10 resize-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(day, exercise.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">Rest day. No exercises scheduled.</p>
                )}
                <Button variant="outline" onClick={() => addExercise(day)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={!editedPlan}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </CardContent>
      <AiSuggestions isOpen={isAiSheetOpen} onOpenChange={setIsAiSheetOpen} />
    </Card>
  );
}
