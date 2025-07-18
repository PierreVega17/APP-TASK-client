import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL?.replace(/\/api.*/, '') || 'http://localhost:4000';
export const socket = io(URL, { withCredentials: true });
