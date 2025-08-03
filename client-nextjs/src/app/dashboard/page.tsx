'use client';

import { Typography, Box } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome, {user?.name || 'User'}!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This is your protected dashboard page.
      </Typography>
    </Box>
  );
}