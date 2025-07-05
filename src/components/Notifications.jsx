import { useEffect, useState, useRef } from 'react';
import { socket } from '../utils/socket';
import { useBoardStore } from '../store/useBoardStore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Notifications() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setBoards } = useBoardStore();

  const fetchInvites = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/notifications`, { credentials: 'include' });
    const data = await res.json();
    setInvites(data);
    setLoading(false);
  };

  // Escuchar notificaciones en vivo
  const socketRef = useRef(false);
  useEffect(() => {
    fetchInvites();
    if (!socketRef.current) {
      socket.on('notificationsUpdated', fetchInvites);
      socketRef.current = true;
    }
    return () => {
      socket.off('notificationsUpdated', fetchInvites);
    };
  }, []);

  const handleRespond = async (inviteId, action) => {
    // Optimistic: elimina la invitación localmente
    setInvites(invites.filter(i => i._id !== inviteId));
    await fetch(`${apiUrl}/notifications/${inviteId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    socket.emit('updateNotifications');
    if (action === 'accepted') {
      // Optimistic: refresca tableros localmente
      fetch(`${apiUrl}/boards`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setBoards(data));
      socket.emit('updateBoards');
    }
  };

  if (loading) return <Typography>Cargando notificaciones...</Typography>;
  if (!invites.length) return <Typography>No tienes invitaciones pendientes.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Invitaciones a tableros</Typography>
      <Stack spacing={2}>
        {invites.map(invite => (
          <Box key={invite._id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="body1">
              Invitación a colaborar en <b>{invite.board?.name || 'Tablero'}</b> de <b>{invite.from?.name || invite.from?.email}</b>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" color="success" size="small" onClick={() => handleRespond(invite._id, 'accepted')}>Aceptar</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleRespond(invite._id, 'rejected')}>Rechazar</Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
