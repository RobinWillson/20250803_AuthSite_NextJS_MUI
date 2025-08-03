import { Container, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Authentication Site
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Next.js 14 with Material-UI Authentication System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the home page. Visit /login to sign in or /register to create an account.
        </Typography>
      </Box>
    </Container>
  );
}
