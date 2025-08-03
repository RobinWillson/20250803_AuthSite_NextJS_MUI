import { Container } from '@mui/material';

function MainContent() {
  return (
    <Container component="main" sx={ { mt: 4, mb: 4, flexGrow: 1 } }>
      <h1>Welcome to the Main Content Area</h1>
      <p>This is where your primary page content will go.</p>
    </Container>
  );
}

export default MainContent;