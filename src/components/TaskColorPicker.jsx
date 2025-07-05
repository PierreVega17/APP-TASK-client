import { HexColorPicker } from 'react-colorful';
import Box from '@mui/material/Box';

// Paleta de colores accesibles y contrastantes para ambos temas
const palette = [
  '#e57373', // rojo
  '#f06292', // rosa
  '#ba68c8', // violeta
  '#64b5f6', // azul
  '#4db6ac', // turquesa
  '#81c784', // verde
  '#ffd54f', // amarillo
  '#ffb74d', // naranja
  '#a1887f', // marrón
  '#90a4ae', // gris
  '#fff',    // blanco
  '#222'     // negro
];

export default function TaskColorPicker({ color, onChange }) {
  return (
    <Box sx={{ mb: 1 }}>
      <HexColorPicker color={color} onChange={onChange} style={{ width: 180, height: 120 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        {palette.map(c => (
          <Box
            key={c}
            onClick={() => onChange(c)}
            sx={{
              width: 24,
              height: 24,
              bgcolor: c,
              border: c === color ? '2px solid #222' : '1px solid #ccc',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: 1
            }}
            title={c}
          />
        ))}
      </Box>
    </Box>
  );
}
