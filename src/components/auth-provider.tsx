'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, type AuthContextType } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';

const protectedRoutes = ['/', '/edit-plan'];
const publicRoutes = ['/login'];

const FullPageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (auth.loading) return;

    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!auth.user && isProtectedRoute) {
      router.push('/login');
    }

    if (auth.user && isPublicRoute) {
      router.push('/');
    }
  }, [auth, pathname, router]);

  if (auth.loading || (!auth.user && protectedRoutes.includes(pathname))) {
    return <FullPageLoader />;
  }
  
  return <>{children}</>;
};
