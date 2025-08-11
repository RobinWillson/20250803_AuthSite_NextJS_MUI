'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Email as EmailIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill email from query params
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Note: This endpoint doesn't exist yet in the backend
      // We'll need to add it in the backend update step
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Password reset link has been sent to your email address.');
      } else {
        // Check if this is a Google user error
        if (data.isGoogleUser) {
          setError(data.message || 'This account is registered by Google. Login with your Google Account');
        } else {
          setError(data.message || 'Failed to send reset link. Please try again.');
        }
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
            <EmailIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!success}
                InputProps={{
                  startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                }}
              />

              <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || !!success}
                  size="large"
                >
                  Send Reset Link
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