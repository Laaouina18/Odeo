import React from 'react';
import AppRoutes from './app/routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <AppRoutes />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
