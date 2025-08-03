import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
  Stack,
} from '@mui/material';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login for a clear flow
  };

  // Fallback for avatar if user has no name
  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <Container maxWidth="sm">
      <Card sx={ { mt: 5 } }>
        <CardContent>
          <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } }>
            <Avatar
              src={ user?.photo }
              sx={ { width: 100, height: 100, mb: 2, bgcolor: 'primary.main', fontSize: '3rem' } }
            >
              { avatarInitial }
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, { user?.name || 'User' }!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={ { mb: 1 } }>
              You have successfully logged in.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
              { user?.email }
            </Typography>


            <Stack spacing={ 2 } sx={ { width: '100%', maxWidth: '300px' } }>
              <Button component={ RouterLink } to="/profile" variant="contained" color="primary">
                Edit Profile
              </Button>
              { user?.isAdmin && (
                <Button component={ RouterLink } to="/admin" variant="contained" color="secondary">
                  Admin Panel
                </Button>
              ) }
              <Button onClick={ handleLogout } variant="outlined" color="error">
                Logout
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;