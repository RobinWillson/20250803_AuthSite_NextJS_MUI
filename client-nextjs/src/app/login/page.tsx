'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, TextField, Button, Divider, Link } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';
import RainbowBackground from '@/components/RainbowBackground';
import GoogleIcon from '@/components/GoogleIcon';
import NextLink from 'next/link';

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Ensure component is mounted before accessing auth state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [mounted, isAuthenticated, router]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setErrors({});
        const { user, token } = await authService.loginWithEmail(email, password);
        login(user, token);
        router.replace('/dashboard');
      } catch (error) {
        console.error('Email/Password login failed:', error);
        setErrors({ form: 'Invalid credentials. Please try again.' });
      }
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: { access_token: string }) => {
    try {
      const { user, token } = await authService.googleLogin(tokenResponse.access_token);
      login(user, token);
      // Use replace instead of push for faster navigation
      router.replace('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      setErrors({ form: 'Google login failed. Please try again.' });
    }
  };

  const handleGoogleLoginError = (error: unknown) => {
    console.error('Google Login Failed:', error);
    setErrors({ form: 'Google login failed. Please try again.' });
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  // Show loading state during SSR/hydration
  if (!mounted) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f4f6f8',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <RainbowBackground />
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
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  size="small"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  autoComplete="current-password"
                />
              </Box>
              {errors.form && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.form}
                </Typography>
              )}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Divider sx={{ my: 2 }}>OR</Divider>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => triggerGoogleLogin()}
                startIcon={<GoogleIcon />}
                sx={{ mb: 2 }}
              >
                Sign in with Google
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link component={NextLink} href="/register" variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}