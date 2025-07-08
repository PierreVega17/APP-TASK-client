import { describe, it, expect } from 'vitest';

// Ejemplo de función utilitaria
function suma(a, b) {
  return a + b;
}

describe('suma util', () => {
  it('debe sumar dos números', () => {
    expect(suma(2, 3)).toBe(5);
    expect(suma(-1, 1)).toBe(0);
  });
});
