import { describe, expect, it } from 'vitest';

import { brandPalette, getContrastingTextColor } from '@/lib/brandPalette';

describe('brandPalette', () => {
  it('exposes five brand colors', () => {
    expect(Object.keys(brandPalette)).toHaveLength(5);
  });

  it('returns light text for light colors', () => {
    expect(getContrastingTextColor('canvas')).toBe('#1F2937');
    expect(getContrastingTextColor('accent')).toBe('#1F2937');
  });

  it('returns white text for saturated colors', () => {
    expect(getContrastingTextColor('primary')).toBe('#FFFFFF');
    expect(getContrastingTextColor('secondary')).toBe('#FFFFFF');
    expect(getContrastingTextColor('ink')).toBe('#FFFFFF');
  });
});
