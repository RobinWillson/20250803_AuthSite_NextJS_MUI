import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Divider, Grid, Link } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import RainbowBackground from '../components/RainbowBackground-lightPurple';
import GoogleIcon from '../components/GoogleIcon';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setErrors({});
        const { user, token } = await authService.loginWithEmail(email, password);
        login(user, token);
        navigate(from, { replace: true });
      } catch (error) {
        console.error('Email/Password login failed:', error);
        setErrors({ form: 'Invalid credentials. Please try again.' }); // Example of a form-level error
      }
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      const { user, token } = await authService.googleLogin(tokenResponse.access_token);
      login(user, token);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login failed:', error);
      // Optionally, set an error state to show a message to the user
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error('Google Login Failed:', error);
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  return (
    <Box
      sx={ {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      } }
    >
      <RainbowBackground />
      <Box
        sx={ {
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        } }
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: { xs: 2, sm: 4 },
              borderRadius: 2,
              boxShadow: 3,
            } }
          >
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={ handleSubmit } noValidate sx={ { mt: 3, width: '100%' } }>
              <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
                <TextField size="small" required fullWidth id="email" label="Email Address" name="email" value={ email } onChange={ (e) => setEmail(e.target.value) } error={ !!errors.email } helperText={ errors.email } autoComplete="email" autoFocus />
                <TextField size="small" required fullWidth name="password" label="Password" type="password" id="password" value={ password } onChange={ (e) => setPassword(e.target.value) } error={ !!errors.password } helperText={ errors.password } autoComplete="current-password" />
              </Box>
              { errors.form && (
                <Typography color="error" variant="body2" sx={ { mt: 1 } }>{ errors.form }</Typography>
              ) }
              <Button type="submit" fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }>
                Sign In
              </Button>
              <Divider sx={ { my: 2 } }>OR</Divider>
              <Button
                fullWidth
                variant="outlined"
                onClick={ () => triggerGoogleLogin() }
                startIcon={ <GoogleIcon /> }
                sx={ { mb: 2 } }
              >
                Sign in with Google
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link component={ RouterLink } to="/register" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LoginPage;