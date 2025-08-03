import { createTheme } from '@mui/material/styles';

/**
 * Creates a custom theme instance for the application.
 * This object defines the color palette, typography, and default component styles,
 * ensuring a consistent and professional look across the entire site.
 * Think of it as a central style guide.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A professional blue for primary buttons and highlights
    },
    secondary: {
      main: '#dc004e', // A contrasting color for secondary actions
    },
    background: {
      default: '#f4f6f8', // A light grey background for a modern feel
      paper: '#ffffff',   // White background for cards, modals, etc.
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600, // Make h5 headings a bit bolder
    },
  },
  // Overriding default styles for specific MUI components
  components: {
    MuiButton: {
      styleOverrides: {
        // Style applied to the root element of all Buttons
        root: {
          borderRadius: 8, // Slightly rounded corners for buttons
          textTransform: 'none', // Use normal case for button text instead of all caps
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        // Style applied to the root element of Paper components (like Cards)
        root: {
          borderRadius: 12, // More rounded corners for paper elements
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', // A subtle shadow
        },
      },
    },
  },
});

export default theme;