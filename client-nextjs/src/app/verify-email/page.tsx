'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${verificationToken}`);
      
      setStatus('success');
      setMessage(response.data.message);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
      
    } catch (error: any) {
      setStatus('error');
      if (error.response?.status === 400 && error.response?.data?.message?.includes('expired')) {
        setStatus('expired');
        setMessage('Verification link has expired. Please request a new one.');
      } else {
        setMessage(error.response?.data?.message || 'Email verification failed. Please try again.');
      }
    }
  };

  const handleResendEmail = async () => {
    // For resending, we would need the email address
    // This is a simplified version - in a real app, you might store email in localStorage
    // or require user to enter their email
    setIsResending(true);
    try {
      // This would need to be implemented with actual email
      // For now, just redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Failed to resend verification email');
    }
    setIsResending(false);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Verifying your email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address.
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              Email Verified Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting you to the login page in 3 seconds...
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => router.replace('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login Now
            </Button>
          </Box>
        );

      case 'expired':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Error sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="warning.main">
              Link Expired
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {message}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleResendEmail}
              disabled={isResending}
              sx={{ mt: 2 }}
            >
              {isResending ? 'Redirecting...' : 'Get New Verification Link'}
            </Button>
          </Box>
        );

      case 'error':
      default:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error.main">
              Verification Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
              <Button 
                variant="contained" 
                onClick={handleResendEmail}
                disabled={isResending}
              >
                {isResending ? 'Redirecting...' : 'Get New Link'}
              </Button>
            </Box>
          </Box>
        );
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
        <Container component="main" maxWidth="sm">
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {renderContent()}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}