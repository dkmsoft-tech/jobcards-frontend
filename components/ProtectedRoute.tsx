// components/ProtectedRoute.tsx
'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!user) {
    // If user is not logged in, redirect to login page
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null; // Return null while redirecting
  }

  if (!allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect to dashboard
    if (typeof window !== 'undefined') {
      router.push('/dashboard'); // Or a dedicated '/unauthorized' page
    }
    return null; // Return null while redirecting
  }

  // If user is authenticated and authorized, render the page
  return <>{children}</>;
}