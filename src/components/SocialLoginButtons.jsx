import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

const apiUrl = import.meta.env.VITE_API_URL;

export default function SocialLoginButtons() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
      <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        href={`${apiUrl}/oauth/google`}
        sx={{ textTransform: 'none', fontWeight: 500 }}
        aria-label="Iniciar sesión con Google"
      >
        Google
      </Button>
      <Button
        variant="outlined"
        startIcon={<GitHubIcon />}
        href={`${apiUrl}/oauth/github`}
        sx={{ textTransform: 'none', fontWeight: 500 }}
        aria-label="Iniciar sesión con GitHub"
      >
        GitHub
      </Button>
    </Box>
  );
}
