export const brandPalette = {
  primary: '#6366F1',
  secondary: '#F472B6',
  accent: '#FBBF24',
  canvas: '#F5F5F0',
  ink: '#1F2937',
} as const;

export type BrandColor = keyof typeof brandPalette;

const DARK_TONES: BrandColor[] = ['primary', 'secondary', 'ink'];

export function getContrastingTextColor(color: BrandColor): '#FFFFFF' | '#1F2937' {
  return DARK_TONES.includes(color) ? '#FFFFFF' : '#1F2937';
}
