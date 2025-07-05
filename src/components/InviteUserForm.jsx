import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function InviteUserForm({ boardId, onInvited }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiUrl}/invite/${boardId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Usuario invitado correctamente');
      setEmail('');
      if (onInvited) onInvited(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleInvite} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
      <TextField
        label="Invitar por email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        size="small"
        type="email"
        required
        sx={{ minWidth: 220 }}
      />
      <Button type="submit" variant="contained" disabled={loading || !email}>Invitar</Button>
      {error && <Typography color="error" variant="caption">{error}</Typography>}
      {success && <Typography color="success.main" variant="caption">{success}</Typography>}
    </Box>
  );
}
