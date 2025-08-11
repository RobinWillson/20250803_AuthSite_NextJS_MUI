'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, TextField, Button, Divider, Link, CircularProgress } from '@mui/material';
import { GoogleLogin, GoogleCredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const googleLoginRef = useRef<HTMLDivElement>(null);

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
        setIsLoading(true);
        setErrors({});
        const { user, token } = await authService.loginWithEmail(email, password);
        login(user, token);
        router.replace('/dashboard');
      } catch (error) {
        console.error('Email/Password login failed:', error);
        setErrors({ form: 'Invalid credentials. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      setIsGoogleLoading(true);
      setErrors({});
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      const { user, token } = await authService.googleLogin(credentialResponse.credential);
      login(user, token);
      // Use replace instead of push for faster navigation
      router.replace('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      setErrors({ form: 'Google login failed. Please try again.' });
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLoginError = (error: unknown) => {
    console.error('Google Login Failed:', error);
    setErrors({ form: 'Google login failed. Please try again.' });
    setIsGoogleLoading(false);
  };

  const triggerGoogleLogin = () => {
    if (googleLoginRef.current) {
      // Find the Google button inside the ref and click it
      const googleButton = googleLoginRef.current.querySelector('div[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      } else {
        // Try clicking any clickable element
        const clickableElement = googleLoginRef.current.querySelector('[data-testid], iframe, div') as HTMLElement;
        if (clickableElement) {
          clickableElement.click();
        }
      }
    }
  };

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
                  disabled={isLoading || isGoogleLoading}
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
                  disabled={isLoading || isGoogleLoading}
                />
              </Box>
              {errors.form && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.form}
                </Typography>
              )}
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2, position: 'relative' }}
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <Divider sx={{ my: 2 }}>OR</Divider>
              {/* Hidden GoogleLogin component for ID token functionality */}
              <Box ref={googleLoginRef} sx={{ display: 'none' }}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  data-testid="google-login-button"
                />
              </Box>
              
              {/* Custom styled Google button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={triggerGoogleLogin}
                startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                sx={{ mb: 2, position: 'relative' }}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', mt: 2 }}>
                <Link 
                  component={NextLink} 
                  href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`} 
                  variant="body2"
                >
                  Forgot your password?
                </Link>
                <Link component={NextLink} href="/register" variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Global loading overlay for Google authentication */}
      {isGoogleLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              boxShadow: 3,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="h6" color="primary">
              Signing in with Google...
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Please wait while we authenticate your account
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}