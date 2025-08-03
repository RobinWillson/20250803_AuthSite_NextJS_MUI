import { useState } from 'react';
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await authService.forgotPassword({ email });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={ 3 } sx={ { mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" sx={ { mt: 1, mb: 2 } }>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" onSubmit={ handleSubmit } noValidate sx={ { width: '100%' } }>
          { error && <Alert severity="error" sx={ { width: '100%', mb: 2 } }>{ error }</Alert> }
          { success && <Alert severity="success" sx={ { width: '100%', mb: 2 } }>{ success }</Alert> }
          <TextField
            margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
            disabled={ isLoading || !!success }
          />
          <Box sx={ { position: 'relative', mt: 3, mb: 2 } }>
            <Button type="submit" fullWidth variant="contained" disabled={ isLoading || !!success }>
              Send Reset Link
            </Button>
            { isLoading && <CircularProgress size={ 24 } sx={ { position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' } } /> }
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
