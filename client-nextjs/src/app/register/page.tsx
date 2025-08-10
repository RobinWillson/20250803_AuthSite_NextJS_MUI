'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';
import NextLink from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setErrors({});
        const { name, email, password } = formData;
        const response = await authService.registerWithEmail(name, email, password);
        
        // Check if registration requires email verification
        if (response?.emailSent) {
          // Show success message and redirect to login or verification notice page
          alert(response.message || 'Registration successful! Please check your email to verify your account before logging in.');
          router.replace('/login');
        } else if (response?.user && response?.token) {
          // Old flow - auto login (fallback)
          login(response.user, response.token);
          router.replace('/dashboard');
        } else {
          // Fallback - show generic success message
          alert('Registration successful! Please check your email if verification is required.');
          router.replace('/login');
        }
      } catch (error: unknown) {
        console.error('Registration failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
        setErrors({ form: errorMessage });
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/background_001.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: { xs: 2, sm: 4 },
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  size="small"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  autoFocus
                />
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  size="small"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  size="small"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Box>
              {errors.form && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.form}
                </Typography>
              )}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Link component={NextLink} href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}