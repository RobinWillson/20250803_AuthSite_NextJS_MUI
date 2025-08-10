'use client';

import { Box } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't need authentication and layout
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublicPage) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, isPublicPage]);

  // For public pages, render without layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Show loading only if we're still initializing and have no user
  if (loading && !user) {
    return <div>Loading...</div>;
  }

  // If not authenticated and not loading, redirect is handled by useEffect
  if (!loading && !isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  // For authenticated pages, render with layout
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: 3, 
            overflow: 'auto',
            height: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}