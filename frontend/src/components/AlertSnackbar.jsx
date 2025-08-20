import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AlertSnackbar = ({ open, onClose, severity, message }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </MuiAlert>
  </Snackbar>
);

export default AlertSnackbar;
