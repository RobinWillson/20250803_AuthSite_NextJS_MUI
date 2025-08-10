'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Google as GoogleIcon,
  CheckCircle as VerifiedIcon,
  Warning as UnverifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import userService from '@/services/userService';
import authService from '@/services/authService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileFunction1, setProfileFunction1] = useState('');
  const [profileFunction2, setProfileFunction2] = useState('');
  const [profileFunction3, setProfileFunction3] = useState('');
  const [profileFunction4, setProfileFunction4] = useState('');
  const [profileFunction5, setProfileFunction5] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Template for future profile functions
      // await userService.updateProfileFunctions({ profileFunction1, profileFunction2, ... }, token);
      setSuccess('Profile functions updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile functions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setResetPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.forgotPassword(user.email);
      setSuccess('Password reset email has been sent to your email address.');
      setResetPasswordDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email.');
      setResetPasswordDialogOpen(false);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const hasGoogleId = (user as User & { googleId?: string }).googleId;
  const isEmailVerified = user.emailVerified;

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          My Profile
        </Typography>

        <Stack spacing={2}>
          {/* Profile Overview Card */}
          <Paper elevation={3} sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Avatar
                src={user.photo}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.main', 
                  fontSize: '1.5rem'
                }}
              >
                {avatarInitial}
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {user.isAdmin && (
                    <Chip
                      icon={<AdminIcon />}
                      label="Admin"
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {hasGoogleId && (
                    <Chip
                      icon={<GoogleIcon />}
                      label="Google"
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  <Chip
                    icon={isEmailVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                    label={isEmailVerified ? 'Verified' : 'Unverified'}
                    color={isEmailVerified ? 'success' : 'warning'}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Box>
            </Box>
          </Paper>

          {/* User Info - Combined Card */}
          <Card elevation={3}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Info
              </Typography>
              
              <Divider sx={{ mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  {error && <Alert severity="error">{error}</Alert>}
                  {success && <Alert severity="success">{success}</Alert>}
                  
                  {/* Account Type */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Account Type
                    </Typography>
                    <Typography variant="body2">
                      {user.isAdmin ? 'Administrator Account' : 'Standard User Account'}
                    </Typography>
                  </Box>

                  {/* Login Method */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Login Method
                    </Typography>
                    <Typography variant="body2">
                      {hasGoogleId ? 'Google OAuth + Email/Password' : 'Email/Password'}
                    </Typography>
                  </Box>

                  {/* User Name */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      User Name
                    </Typography>
                    <Typography variant="body2">
                      {user.name}
                    </Typography>
                  </Box>

                  {/* Password */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Password
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        ************************
                      </Typography>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => setResetPasswordDialogOpen(true)}
                        sx={{ 
                          minWidth: 'auto', 
                          px: 1, 
                          py: 0.25,
                          height: 'auto',
                          fontSize: '0.75rem'
                        }}
                      >
                        Reset Password 
                      </Button>
                    </Box>
                  </Box>

                  {/* Profile Functions */}
                  <TextField
                    label="Profile Function 1"
                    value={profileFunction1}
                    onChange={(e) => setProfileFunction1(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                    size="small"
                    placeholder="Function 1 placeholder"
                  />
                  
                  <TextField
                    label="Profile Function 2"
                    value={profileFunction2}
                    onChange={(e) => setProfileFunction2(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                    size="small"
                    placeholder="Function 2 placeholder"
                  />
                  
                  <TextField
                    label="Profile Function 3"
                    value={profileFunction3}
                    onChange={(e) => setProfileFunction3(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                    size="small"
                    placeholder="Function 3 placeholder"
                  />
                  
                  <TextField
                    label="Profile Function 4"
                    value={profileFunction4}
                    onChange={(e) => setProfileFunction4(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                    size="small"
                    placeholder="Function 4 placeholder"
                  />
                  
                  <TextField
                    label="Profile Function 5"
                    value={profileFunction5}
                    onChange={(e) => setProfileFunction5(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                    size="small"
                    placeholder="Function 5 placeholder"
                  />
                  
                  {/* Update Button */}
                  <Box sx={{ position: 'relative', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      Update
                    </Button>
                    {isLoading && (
                      <CircularProgress
                        size={20}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          mt: '-10px',
                          ml: '-10px',
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Reset Password Confirmation Dialog */}
        <Dialog
          open={resetPasswordDialogOpen}
          onClose={() => setResetPasswordDialogOpen(false)}
          aria-labelledby="reset-password-dialog-title"
          aria-describedby="reset-password-dialog-description"
        >
          <DialogTitle id="reset-password-dialog-title">
            Reset Password
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="reset-password-dialog-description">
              This will send a mail to reset your password. Are you sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setResetPasswordDialogOpen(false)}
              disabled={resetPasswordLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword}
              variant="contained"
              color="warning"
              disabled={resetPasswordLoading}
              startIcon={resetPasswordLoading ? <CircularProgress size={16} /> : null}
            >
              {resetPasswordLoading ? 'Sending...' : 'Sure'}
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
  );
}