import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';
import Notifications from './Notifications';


export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [boardsVersion, setBoardsVersion] = useState(0);

  // Socket para notificaciones y tableros en vivo
  const socketRef = useRef(false);
  useEffect(() => {
    if (!user) return setNotifCount(0);
    fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setNotifCount(data.length))
      .catch(() => setNotifCount(0));
    if (!socketRef.current && user) {
      socket.emit('joinUser', user._id || user.id);
      socket.on('notificationsUpdated', () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => setNotifCount(data.length));
      });
      socket.on('boardsUpdated', () => {
        setBoardsVersion(v => v + 1);
      });
      socketRef.current = true;
    }
    return () => {
      socket.off('notificationsUpdated');
      socket.off('boardsUpdated');
    };
  }, [user, anchorNotif]);

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ mb: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          App-Task
        </Typography>
        <Box>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Cambiar tema">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton color="inherit" aria-label="Notificaciones" onClick={e => setAnchorNotif(e.currentTarget)}>
            <Badge badgeContent={notifCount} color="error" invisible={notifCount === 0}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            open={Boolean(anchorNotif)}
            anchorEl={anchorNotif}
            onClose={() => setAnchorNotif(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Notifications />
          </Popover>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/boards">Tableros</Button>
              <Button color="inherit" onClick={logout}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Iniciar sesión</Button>
              <Button color="inherit" component={Link} to="/register">Registrarse</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
