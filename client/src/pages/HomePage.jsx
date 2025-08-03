import { Box, Button, Container, Typography, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import RainbowBackground from '../components/RainbowBackground-lightPurple';
import GoogleIcon from '../components/GoogleIcon';

function HomePage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    const { user, token } = await authService.googleLogin(tokenResponse.access_token);
    login(user, token);
    navigate('/dashboard');
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => console.error('Google Login Failed:', error),
  });

  return (
    <Box
      sx={ {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', // Prevents scrollbars from the background animation
      } }
    >
      <RainbowBackground />
      <Box
        sx={ {
          position: 'relative',
          zIndex: 1, // Ensures content is on top of the background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        } }
      >
        <Container component="main" maxWidth="sm">
          <Box
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            } }
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome to Our Site
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Join us to get started. You can log in if you already have an
              account, or register for a new one.
            </Typography>
          </Box>
          <Box
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              padding: { xs: 2, sm: 4 },
              borderRadius: 2,
              boxShadow: 3,
            } }
          >

            <Box
              sx={ {
                mt: 2,
                width: '100%',
                maxWidth: 360, // Set a max-width for better appearance on larger screens
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              } }
            >
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={ <GoogleIcon /> }
                onClick={ () => triggerGoogleLogin() }
              >
                Log in with Google
              </Button>

              <Divider>OR</Divider>

              <Button
                component={ Link }
                to="/login"
                variant="contained"
                size="large"
                fullWidth
              >
                Login with Email
              </Button>
              <Button
                component={ Link }
                to="/register"
                variant="outlined"
                size="large"
                fullWidth
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
