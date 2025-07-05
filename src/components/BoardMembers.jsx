import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function BoardMembers({ users }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Miembros del tablero:</Typography>
      <Stack direction="row" spacing={2}>
        {users.map(u => (
          <Box key={u._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{u.name?.[0] || '?'}</Avatar>
            <Typography variant="body2">{u.name || u.email}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
