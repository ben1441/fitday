'use client';

import * as React from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google: ', error);
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
