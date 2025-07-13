'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestExercises } from '@/ai/flows/suggest-exercises';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const suggestionSchema = z.object({
  userPreferences: z.string().min(10, 'Please describe your preferences in a bit more detail.'),
  workoutHistory: z.string().min(10, 'Please describe your workout history in a bit more detail.'),
  userType: z.string().min(5, 'Please describe your user type (e.g., age, gender, goals).'),
});

type SuggestionFormInputs = z.infer<typeof suggestionSchema>;

interface AiSuggestionsProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ isOpen, onOpenChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SuggestionFormInputs>({
    resolver: zodResolver(suggestionSchema),
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<SuggestionFormInputs> = async (data) => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestExercises(data);
      setSuggestion(result.suggestedExercises);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate AI suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot /> AI Workout Suggestions
          </SheetTitle>
          <SheetDescription>
            Tell us about yourself and get personalized exercise suggestions to spice up your routine.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="userType">About You</Label>
            <Input
              id="userType"
              placeholder="e.g., 30yo male, advanced, focus on strength"
              {...register('userType')}
            />
            {errors.userType && <p className="text-sm text-destructive">{errors.userType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPreferences">Preferences & Goals</Label>
            <Textarea
              id="userPreferences"
              placeholder="e.g., I prefer free weights, want to build muscle, and I have 1 hour per session."
              {...register('userPreferences')}
            />
             {errors.userPreferences && <p className="text-sm text-destructive">{errors.userPreferences.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workoutHistory">Recent Workout History</Label>
            <Textarea
              id="workoutHistory"
              placeholder="e.g., I've been doing a 3-day split (push/pull/legs) for the last 6 months. My bench press is stuck."
              {...register('workoutHistory')}
            />
            {errors.workoutHistory && <p className="text-sm text-destructive">{errors.workoutHistory.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
                <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </form>

        {suggestion && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Here are your suggestions:</h3>
            <Card className="bg-muted/50">
                <CardContent className="p-4">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{suggestion}</pre>
                </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AiSuggestions;
