import { useEffect, useState, useRef } from 'react';
import { socket } from '../utils/socket';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import TaskCard from '../components/TaskCard';
import TaskCardNew from '../components/TaskCardNew';
import InviteUserForm from '../components/InviteUserForm';
import BoardMembers from '../components/BoardMembers';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const apiUrl = import.meta.env.VITE_API_URL;
const columns = [
  { key: 'pendiente', label: 'Pendiente', color: { light: 'rgba(144,202,249,0.85)', dark: 'rgba(38,50,56,0.7)' } },
  { key: 'en_proceso', label: 'En proceso', color: { light: 'rgba(255,241,118,0.85)', dark: 'rgba(62,39,35,0.7)' } },
  { key: 'en_revision', label: 'En revisión', color: { light: 'rgba(186,104,200,0.85)', dark: 'rgba(49,27,146,0.7)' } },
  { key: 'terminado', label: 'Terminado', color: { light: 'rgba(129,199,132,0.85)', dark: 'rgba(27,94,32,0.7)' } }
];

export default function BoardDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { tasks, setTasks, updateTask, addTask, deleteTask } = useTaskStore();
  const [users, setUsers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [boardOwner, setBoardOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    fetch(`${apiUrl}/tasks`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTasks(data.filter(t => String(t.board) === id)));
    fetch(`${apiUrl}/boards/${id}/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) setBoardOwner(data[0]._id);
      });

    // Unirse a la sala del tablero SIEMPRE que cambia el id
    socket.emit('joinBoard', id);

    // Refuerzo: limpiar TODOS los listeners previos antes de suscribir
    socket.removeAllListeners('tasksUpdated');
    const handler = (tasks) => {
      setTasks(tasks.filter(t => String(t.board) === id));
    };
    socket.on('tasksUpdated', handler);
    return () => {
      socket.off('tasksUpdated', handler);
    };
  }, [user, setTasks, id, navigate]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const movedTask = tasks.find(t => t._id === draggableId);
    if (!movedTask) return;
    // Optimistic update
    updateTask({ ...movedTask, status: destination.droppableId });
    await fetch(`${apiUrl}/tasks/${draggableId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: destination.droppableId })
    });
    // El estado se sincroniza al recibir tasksUpdated por socket
  };

  const handleCreate = async (data) => {
    // Optimistic: crea una card temporal
    const tempId = 'temp-' + Date.now();
    addTask({
      _id: tempId,
      ...data,
      board: id,
      status: 'pendiente',
      user: user?.id,
    });
    setCreating(false);
    await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, board: id })
    });
    // El estado se sincroniza al recibir tasksUpdated por socket
  };

  const handleUpdate = async (task) => {
    // Optimistic update para asignación de usuario
    updateTask(task);
    await fetch(`${apiUrl}/tasks/${task._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    // El estado se sincroniza al recibir tasksUpdated por socket
  };

  const handleDelete = async (task) => {
    await fetch(`${apiUrl}/tasks/${task._id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    // El estado se actualizará solo al recibir tasksUpdated por socket
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Tablero</Typography>
        <Button variant="contained" onClick={() => setCreating(true)}>Nueva tarea</Button>
      </Box>
      <InviteUserForm boardId={id} onInvited={() => {
        // Refrescar usuarios del tablero tras invitar
        fetch(`${apiUrl}/boards/${id}/users`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => setUsers(data));
      }} />
      <BoardMembers users={users} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {columns.map(col => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={theme => ({
                    minWidth: 250,
                    minHeight: 400,
                    bgcolor: snapshot.isDraggingOver
                      ? (theme.palette.mode === 'dark' ? '#37474f' : '#e3eafc')
                      : columns.find(c => c.key === col.key).color[theme.palette.mode],
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 2
                  })}
                >
                  <Typography fontWeight={600} sx={{ mb: 1 }}>{col.label}</Typography>
                  {col.key === 'pendiente' && creating && (
                    <TaskCardNew onSave={handleCreate} onCancel={() => setCreating(false)} />
                  )}
                  {tasks.filter(t => t.status === col.key).map((task, idx) => (
                    <Draggable draggableId={task._id} index={idx} key={task._id}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard
                            task={task}
                            users={users}
                            onSave={handleUpdate}
                            onDelete={handleDelete}
                            currentUser={user?.id}
                            boardOwner={boardOwner}
                            columnColor={columns.find(c => c.key === col.key).color}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}
