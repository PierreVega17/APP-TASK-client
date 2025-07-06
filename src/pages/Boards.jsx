import { useEffect, useState } from 'react';
import BoardCreateForm from '../components/BoardCreateForm.jsx';
import useSnackbar from '../hooks/useSnackbar.jsx';
import { socket } from '../utils/socket';
import { useBoardStore } from '../store/useBoardStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Boards() {
  const { user } = useAuthStore();
  const { boards, setBoards, addBoard } = useBoardStore();
  const navigate = useNavigate();
  const [SnackbarComponent, showSnackbar] = useSnackbar();

  useEffect(() => {
    if (!user) return navigate('/login');
    socket.emit('joinUser', user._id || user.id);
    fetch(`${apiUrl}/boards`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBoards(data);
        else setBoards([]); // o muestra un error visual
      });
    // Se actualiza automáticamente por boardsUpdated en Navbar
  }, [user, setBoards, navigate]);

  const [openCreate, setOpenCreate] = useState(false);
  const handleCreate = async (name) => {
    const res = await fetch(`${apiUrl}/boards`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (res.ok) {
      addBoard(data);
      showSnackbar('Tablero creado', 'success');
    } else {
      showSnackbar(data.message || 'Error al crear tablero', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Mis tableros</Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>Nuevo tablero</Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {boards.map(board => (
          <Box
            key={board._id}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              minWidth: 200,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              position: 'relative'
            }}
            tabIndex={0}
            aria-label={`Abrir tablero ${board.name}`}
          >
            <Typography fontWeight={600} sx={{ flex: 1, pr: 1, wordBreak: 'break-word' }} onClick={() => navigate(`/boards/${board._id}`)}>{board.name}</Typography>
            <IconButton color="error" aria-label="Eliminar tablero de la vista"
              onClick={(e) => {
                e.stopPropagation();
                if (!window.confirm('¿Eliminar este tablero de tu vista?')) return;
                setBoards(boards.filter(b => b._id !== board._id));
                showSnackbar('Tablero ocultado de tu vista', 'info');
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <BoardCreateForm open={openCreate} onClose={() => setOpenCreate(false)} onCreate={handleCreate} />
      {SnackbarComponent}
    </Box>
  );
}
