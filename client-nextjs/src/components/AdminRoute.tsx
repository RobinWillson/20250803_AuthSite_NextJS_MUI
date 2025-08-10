'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * A component that checks if a user is authenticated and has admin privileges
 * before rendering content. If the user is not an admin, it redirects them.
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not authenticated - redirect to login
        router.replace('/login');
      } else if (!user?.isAdmin) {
        // Authenticated but not admin - redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f4f6f8',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  // If authenticated and admin, render the children
  return <>{children}</>;
}