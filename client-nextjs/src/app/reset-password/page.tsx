'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import NextLink from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get('token');
  const { logout } = useAuth();

  useEffect(() => {
    if (!resetToken) {
      setError('Invalid reset link. No token provided.');
    }
  }, [resetToken]);

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!resetToken) {
      setError('Invalid reset token.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Note: This endpoint doesn't exist yet in the backend
      // We'll need to add it in the backend update step
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: resetToken, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message + ' Redirecting to login...');
        setTimeout(() => {
          // Clear authentication state and token to ensure clean login
          logout();
          router.replace('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. The link may be invalid or expired.');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
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
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <LockIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
              Enter your new password below.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                  {success}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!success}
                InputProps={{
                  startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Password must be at least 8 characters long"
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !!success}
                InputProps={{
                  startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || !!success || !resetToken}
                  size="large"
                >
                  Reset Password
                </Button>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      mt: '-12px',
                      ml: '-12px',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link
                  component={NextLink}
                  href="/login"
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <BackIcon fontSize="small" />
                  Back to Login
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}