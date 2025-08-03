import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
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
} from '@mui/material';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateProfile(formData);
      updateUser(updatedUser); // Update user in AuthContext
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={ { display: 'flex', justifyContent: 'center', mt: 5 } }>
        <CircularProgress />
      </Container>
    );
  }

  const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <Container maxWidth="sm">
      <Card sx={ { mt: 5 } }>
        <CardContent>
          <Box component="form" onSubmit={ handleSubmit } noValidate sx={ { mt: 1 } }>
            <Stack spacing={ 3 } alignItems="center">
              <Typography variant="h4" component="h1" gutterBottom>
                Edit Profile
              </Typography>
              <Avatar
                src={ user.photo }
                sx={ { width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem' } }
              >
                { avatarInitial }
              </Avatar>
              { error && <Alert severity="error" sx={ { width: '100%' } }>{ error }</Alert> }
              { success && <Alert severity="success" sx={ { width: '100%' } }>{ success }</Alert> }
              <TextField
                label="Full Name" name="name" value={ formData.name } onChange={ handleChange } fullWidth required disabled={ isLoading }
              />
              <TextField
                label="Email Address" name="email" type="email" value={ formData.email } onChange={ handleChange } fullWidth required disabled={ isLoading }
              />
              <Box sx={ { position: 'relative', width: '100%' } }>
                <Button type="submit" fullWidth variant="contained" disabled={ isLoading }>Update Profile</Button>
                { isLoading && <CircularProgress size={ 24 } sx={ { position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' } } /> }
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
