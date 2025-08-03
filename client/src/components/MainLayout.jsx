import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';

/**
 * Provides the main structure for the application (header, content area).
 * This component ensures a consistent look and feel across all pages.
 * The navigation bar dynamically changes based on the user's authentication status.
 */
const MainLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout for a clear user flow.
  };

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', minHeight: '100vh' } }>
      {/* The top navigation bar */ }
      <AppBar position="static" elevation={ 1 }>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={ RouterLink }
              to="/"
              sx={ { flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 'bold' } }
            >
              My Awesome Site
            </Typography>

            {/* Navigation links change depending on if the user is logged in */ }
            <Box>
              { isAuthenticated ? (
                <>
                  <Button component={ RouterLink } to="/dashboard" sx={ { color: 'white' } }>Dashboard</Button>
                  <Button component={ RouterLink } to="/profile" sx={ { color: 'white' } }>Profile</Button>
                  { user?.isAdmin && (
                    <Button component={ RouterLink } to="/admin" sx={ { color: 'white' } }>Admin</Button>
                  ) }
                  <Button onClick={ handleLogout } variant="outlined" sx={ { color: 'white', borderColor: 'white', ml: 1 } }>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={ RouterLink } to="/login" sx={ { color: 'white' } }>Login</Button>
                  <Button component={ RouterLink } to="/register" variant="outlined" sx={ { color: 'white', borderColor: 'white', ml: 1 } }>
                    Register
                  </Button>
                </>
              ) }
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* The main content area where page components will be rendered */ }
      <Container component="main" maxWidth="lg" sx={ { mt: 4, mb: 4, flexGrow: 1 } }>
        <Outlet /> {/* Renders the active child route's component */ }
      </Container>
    </Box>
  );
};

export default MainLayout;