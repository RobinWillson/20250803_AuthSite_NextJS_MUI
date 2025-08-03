import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import RainbowBackground from '../components/RainbowBackground-lightPurple';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setErrors({});
        const { name, email, password } = formData;
        const { user, token } = await authService.registerWithEmail(name, email, password);
        login(user, token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    }
  };

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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={ handleSubmit } sx={ { mt: 3, width: '100%' } }>
              <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
                <TextField size="small" name="name" required fullWidth id="name" label="Name" value={ formData.name } onChange={ handleChange } error={ !!errors.name } helperText={ errors.name } autoFocus />
                <TextField size="small" required fullWidth id="email" label="Email Address" name="email" value={ formData.email } onChange={ handleChange } error={ !!errors.email } helperText={ errors.email } />
                <TextField size="small" required fullWidth name="password" label="Password" type="password" id="password" value={ formData.password } onChange={ handleChange } error={ !!errors.password } helperText={ errors.password } />
                <TextField size="small" required fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword" value={ formData.confirmPassword } onChange={ handleChange } error={ !!errors.confirmPassword } helperText={ errors.confirmPassword } />
              </Box>
              { errors.form && (
                <Typography color="error" variant="body2" sx={ { mt: 2 } }>{ errors.form }</Typography>
              ) }
              <Button type="submit" fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={ RouterLink } to="/login" variant="body2">
                    Already have an account? Sign in
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

export default RegisterPage;
