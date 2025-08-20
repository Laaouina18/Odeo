import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 2, mt: 4, textAlign: 'center' }}>
    <Typography variant="body2">
      © {new Date().getFullYear()} Odeo Services. Tous droits réservés.
    </Typography>
  </Box>
);

export default Footer;
