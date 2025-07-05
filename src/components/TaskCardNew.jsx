import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import TaskColorPicker from './TaskColorPicker';


export default function TaskCardNew({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  // Contraste de texto automático
  function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(x => x + x).join('');
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return yiq >= 128 ? '#222' : '#fff';
  }
  const textColor = getContrastYIQ(color || '#e3e3e3');

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: color || '#e3e3e3', color: textColor, borderRadius: 2, boxShadow: 1, transition: 'background 0.2s' }}>
      <TextField
        value={title}
        onChange={e => setTitle(e.target.value)}
        label="Título"
        size="small"
        fullWidth
        sx={{ mb: 1 }}
        autoFocus
      />
      <TextField
        value={description}
        onChange={e => setDescription(e.target.value)}
        label="Descripción"
        size="small"
        fullWidth
        multiline
        minRows={2}
        sx={{ mb: 1 }}
      />
      {/* <TaskColorPicker color={color} onChange={setColor} /> */}
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => onSave({ title, description, color })} disabled={!title.trim()} size="small">Crear</Button>
        <Button variant="text" onClick={onCancel} size="small">Cancelar</Button>
      </Stack>
    </Box>
  );
}
