import { Box, Container, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        // py: 1,
        // px: 1,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container sx={{
        display: 'flex',
        justifyContent: 'flex-end', // Aligns content to the right
      }}>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          Your Website {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;