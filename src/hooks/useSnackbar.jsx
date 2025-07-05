import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import React from 'react';

// Este archivo es JSX, necesario para hooks con componentes
export default function useSnackbar() {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleClose = () => setSnackbar(s => ({ ...s, open: false }));
  const SnackbarComponent = React.useMemo(() => (
    <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  ), [snackbar]);
  return [SnackbarComponent, showSnackbar];
}
