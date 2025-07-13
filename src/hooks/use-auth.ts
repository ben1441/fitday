'use client';

import * as React from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  type Auth,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = React.useState<AuthContextType>({
    user: null,
    loading: true,
  });
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!firebaseAuth) {
      setAuth({ user: null, loading: false });
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setAuth({ user, loading: false });
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseAuth) {
        console.error("Firebase auth is not initialized.");
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Firebase is not configured correctly. Please check the setup.",
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      router.push('/');
    } catch (error: any) {
      console.error('Error signing in with Google: ', error);
      if (error.code === 'auth/configuration-not-found') {
        toast({
            variant: "destructive",
            title: "Configuration Needed",
            description: "Google Sign-In is not enabled for this project. Please enable it in the Firebase console.",
        });
      } else {
        toast({
            variant: "destructive",
            title: "Sign-In Failed",
            description: "Could not sign in with Google. Please try again.",
        });
      }
    }
  };

  const signOut = async () => {
    if (!firebaseAuth) {
        console.error("Firebase auth is not initialized.");
        return;
    }
    try {
      await firebaseSignOut(firebaseAuth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return { auth, signInWithGoogle, signOut };
};
