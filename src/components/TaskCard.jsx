import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TaskColorPicker from './TaskColorPicker';


export default function TaskCard({ task, users, onSave, onDelete, currentUser, boardOwner, columnColor }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [assigned, setAssigned] = useState(task.assigned || null);
  const [color, setColor] = useState(task.color || '');

  // Si la tarea no tiene color, usar el color de la columna
  const cardColor = color || (columnColor ? columnColor[window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'] : '#e3e3e3');

  // Contraste máximo y sombra para texto
  // Siempre usar letras ultra claras
  function getTextColor(bg) {
    return '#fff';
  }
  // Eliminar opacidad del fondo de la card (solo para la card, no la columna)
  let solidCardColor = cardColor;
  if (solidCardColor.startsWith('rgba')) {
    const [r, g, b] = solidCardColor.match(/\d+/g);
    solidCardColor = `rgb(${r},${g},${b})`;
  }
  const textColor = getTextColor(solidCardColor);

  const handleSave = () => {
    setEdit(false);
    // Optimistic update para asignación de usuario
    onSave({ ...task, title, description, assigned, color });
  };

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: solidCardColor, color: textColor, fontWeight: 700, fontSize: '1.1rem', borderRadius: 2, boxShadow: 1, position: 'relative', transition: 'background 0.2s' }}>
      {edit ? (
        <>
          {/* Solo el owner puede editar título y descripción */}
          {currentUser === boardOwner && (
            <>
              <TextField
                value={title}
                onChange={e => setTitle(e.target.value)}
                label="Título"
                size="small"
                fullWidth
                sx={{ mb: 1, input: { color: textColor }, label: { color: textColor }, '& .MuiOutlinedInput-root': { color: textColor }, '& .MuiInputLabel-root': { color: textColor } }}
                InputLabelProps={{ style: { color: textColor } }}
              />
              <TextField
                value={description}
                onChange={e => setDescription(e.target.value)}
                label="Descripción"
                size="small"
                fullWidth
                multiline
                minRows={2}
                sx={{ mb: 1, input: { color: textColor }, label: { color: textColor }, '& .MuiOutlinedInput-root': { color: textColor }, '& .MuiInputLabel-root': { color: textColor } }}
                InputLabelProps={{ style: { color: textColor } }}
              />
            </>
          )}
          {/* Todos pueden reasignar la tarea */}
          <Autocomplete
            options={users}
            getOptionLabel={u => u.name || u.email}
            value={users.find(u => u._id === assigned) || null}
            onChange={(_, val) => setAssigned(val?._id || null)}
            renderInput={params => <TextField {...params} label="Asignar a" size="small" sx={{ input: { color: textColor }, label: { color: textColor }, '& .MuiOutlinedInput-root': { color: textColor }, '& .MuiInputLabel-root': { color: textColor } }} InputLabelProps={{ style: { color: textColor } }} />}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleSave} color="primary" aria-label="Guardar tarea"><SaveIcon /></IconButton>
            <IconButton onClick={() => setEdit(false)} aria-label="Cancelar edición">✕</IconButton>
          </Stack>
        </>
      ) : (
        <>
          <Typography fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{description}</Typography>
          {assigned && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>{(users.find(u => u._id === assigned)?.name || '?')[0]}</Avatar>
              <Typography variant="caption">{users.find(u => u._id === assigned)?.name || 'Sin asignar'}</Typography>
            </Stack>
          )}
          <Box sx={{ width: 24, height: 6, bgcolor: cardColor, borderRadius: 1, mb: 1 }} />
          <Stack direction="row" spacing={1}>
            {/* Solo el owner puede editar/eliminar */}
            {currentUser === boardOwner && (
              <>
                <IconButton onClick={() => setEdit(true)} color="primary" aria-label="Editar tarea"><EditIcon /></IconButton>
                <IconButton onClick={() => onDelete(task)} color="error" aria-label="Eliminar tarea"><DeleteIcon /></IconButton>
              </>
            )}
            {/* Si no es owner, pero la tarea no está asignada, puede asignarse */}
            {currentUser !== boardOwner && !assigned && (
              <IconButton onClick={() => {
                // Optimistic update para autoasignación
                onSave({ ...task, assigned: currentUser });
              }} color="primary" aria-label="Asignarme tarea">👤</IconButton>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
