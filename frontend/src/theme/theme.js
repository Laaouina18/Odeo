import { createTheme } from '@mui/material/styles';

const primaryColor = 'rgb(129, 39, 85)';
const primaryColorRgba = 'rgba(129, 39, 85, 0.9)';

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: 'rgba(129, 39, 85, 0.7)',
      dark: 'rgba(129, 39, 85, 1)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f8f9fa',
      light: '#ffffff',
      dark: '#e9ecef',
      contrastText: primaryColor,
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#6c757d',
    },
    success: {
      main: '#28a745',
      light: '#d4edda',
    },
    warning: {
      main: '#ffc107',
      light: '#fff3cd',
    },
    error: {
      main: '#dc3545',
      light: '#f8d7da',
    },
    info: {
      main: primaryColor,
      light: 'rgba(129, 39, 85, 0.1)',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: primaryColor,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: primaryColor,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: primaryColor,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: primaryColor,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: primaryColor,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: primaryColor,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 4px 12px rgba(129, 39, 85, 0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(129, 39, 85, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${primaryColor} 0%, rgba(129, 39, 85, 0.8) 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, ${primaryColor} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(129, 39, 85, 0.1)',
          border: '1px solid rgba(129, 39, 85, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(129, 39, 85, 0.08)',
          border: '1px solid rgba(129, 39, 85, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: primaryColor,
          height: 3,
          borderRadius: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: primaryColor,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(129, 39, 85, 0.05)',
            color: primaryColor,
            fontWeight: 700,
            borderBottom: `2px solid ${primaryColor}`,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryColor,
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
