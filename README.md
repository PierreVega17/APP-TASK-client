# App-Task Frontend

Este proyecto es el frontend de App-Task, una aplicación tipo Trello construida con React, Vite, Material UI, Zustand y soporte para drag & drop, autenticación social y correo, y actualizaciones en tiempo real.

## Tecnologías principales
- React + Vite
- Material UI
- Zustand
- React Router DOM
- @hello-pangea/dnd (drag & drop)
- Socket.IO Client
- Autenticación social (Google, GitHub)

## Scripts
- `npm run dev` — Inicia el frontend en modo desarrollo
- `npm run build` — Compila para producción
- `npm run preview` — Previsualiza el build

## Variables de entorno
- `VITE_API_URL`: URL base del backend (ej: http://localhost:4000/api)
- `VITE_GOOGLE_CLIENT_ID`: Client ID de Google OAuth (opcional)
- `VITE_GITHUB_CLIENT_ID`: Client ID de GitHub OAuth (opcional)

## Estructura principal
- `/src/pages`: Vistas principales (Login, Register, Boards, BoardDetail)
- `/src/components`: Componentes reutilizables (Navbar, TaskCard, BoardCreateForm, etc.)
- `/src/store`: Zustand stores (auth, board, task, theme)
- `/src/utils`: Utilidades (socket.js)
- `/src/hooks`: Hooks personalizados (useSnackbar)

## Uso

1. Clona el repositorio y entra a la carpeta del frontend:
   ```bash
   git clone <tu-repo>
   cd App-Task/frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` con la URL de tu backend:
   ```env
   VITE_API_URL=https://<tu-backend-en-produccion>/api
   ```
4. Inicia el proyecto en desarrollo:
   ```bash
   npm run dev
   ```

## Ejemplo de endpoints (consumidos por el frontend)

- `POST /api/auth/login` — Login con correo y contraseña
- `POST /api/auth/register` — Registro de usuario
- `GET /api/boards` — Listar tableros del usuario
- `POST /api/boards` — Crear tablero
- `DELETE /api/boards/:id` — Eliminar tablero
- `GET /api/tasks` — Listar tareas
- `POST /api/tasks` — Crear tarea
- `PUT /api/tasks/:id` — Editar tarea
- `DELETE /api/tasks/:id` — Eliminar tarea

## Despliegue en Vercel

1. Sube tu proyecto a un repositorio en GitHub, GitLab o Bitbucket.
2. Ve a [https://vercel.com/](https://vercel.com/) y crea una cuenta (puedes usar GitHub).
3. Haz clic en "New Project" y selecciona tu repositorio.
4. Vercel detectará automáticamente que es un proyecto Vite/React.
5. En "Environment Variables" agrega:
   - `VITE_API_URL=https://<tu-backend-en-produccion>/api`
6. Haz clic en "Deploy".
7. Cuando termine, tendrás una URL pública para tu frontend.

> Recuerda: Si tu backend está en localhost, no funcionará en producción. Debes desplegar el backend (por ejemplo, en Render, Railway o Cyclic) y usar esa URL en `VITE_API_URL`.

---

¿Dudas? Consulta la documentación oficial de [Vercel](https://vercel.com/docs) o pide ayuda en la comunidad.
