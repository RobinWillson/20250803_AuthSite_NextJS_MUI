import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await authService.resetPassword(resetToken, { password });
      setSuccess(data.message + ' Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={ 3 } sx={ { mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Typography variant="body2" align="center" sx={ { mt: 1, mb: 2 } }>
          Enter your new password below.
        </Typography>
        <Box component="form" onSubmit={ handleSubmit } noValidate sx={ { width: '100%' } }>
          { error && <Alert severity="error" sx={ { width: '100%', mb: 2 } }>{ error }</Alert> }
          { success && <Alert severity="success" sx={ { width: '100%', mb: 2 } }>{ success }</Alert> }
          <TextField
            margin="normal" required fullWidth name="password" label="New Password" type="password" id="password"
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            disabled={ isLoading || !!success }
          />
          <TextField
            margin="normal" required fullWidth name="confirmPassword" label="Confirm New Password" type="password" id="confirmPassword"
            value={ confirmPassword }
            onChange={ (e) => setConfirmPassword(e.target.value) }
            disabled={ isLoading || !!success }
          />
          <Box sx={ { position: 'relative', mt: 3, mb: 2 } }>
            <Button type="submit" fullWidth variant="contained" disabled={ isLoading || !!success }>
              Reset Password
            </Button>
            { isLoading && <CircularProgress size={ 24 } sx={ { position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' } } /> }
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
