'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar sx={{ minHeight: 24, '@media (min-width: 600px)': { minHeight: 24 } }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          Auth Site
        </Typography>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>Welcome, {user?.name}</Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;