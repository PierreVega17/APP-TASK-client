import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useThemeStore } from './store/useThemeStore';

function Main() {
  const { mode } = useThemeStore();
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#6c8cff' },
            secondary: { main: '#ffe082' },
            background: {
              default: '#f7fafd',
              paper: '#fdfdff',
            },
            text: {
              primary: '#2a3140',
              secondary: '#5c6470',
            },
            grey: {
              50: '#f3f6fb',
              100: '#e9eef6',
              200: '#dbe6f3',
              300: '#c2d3e8',
            },
          }
        : {
            background: {
              default: '#181a1b',
              paper: '#23272f',
            },
          }),
    },
    typography: {
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
