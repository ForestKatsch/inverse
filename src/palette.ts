// Ideally, this would be enforced to only contain valid CSS colors. But until then
// it's a great alias to enforce types, if only visually.
export type Color = string;

export interface PaletteSource {
  bg: Color[];
}

export type Palette<T extends PaletteSource> = Omit<T, "bg"> & {
  bgPrimary: Color;
  bgSecondary: Color;

  light: Palette<T>;
  dark: Palette<T>;
  inverse: Palette<T>;

  elevated: Palette<T>;
};

// 1 2 3 4
// 1 2
//   2 3
//     3 4

// Internal function to create all elevations for a given palette.
const createPaletteElevationsUNSAFE = <T extends PaletteSource>(source: T): Palette<T>[] => {
  const palettes: Omit<Palette<T>, "light" | "dark" | "inverse" | "elevated">[] = [];

  // Subtract one so every elevation is guaranteed to have bgPrimary and bgSecondary.
  for (let i = 0; i < source.bg.length - 1; i++) {
    const palette = {
      ...source,
      bg: undefined,
      bgPrimary: source.bg[i],
      bgSecondary: source.bg[i + 1],
    };

    palettes.push(palette);
  }

  const elevations = palettes.map(
    (palette, index) =>
      ({
        ...palette,
        elevated: (palettes[index + 1] ?? palette) as Palette<T>,
      } as Palette<T>)
  );

  return elevations;
};

export const createThemedPalette = <T extends PaletteSource>(light: T, dark: T): Palette<T> => {
  const lightPalette = createPaletteElevationsUNSAFE(light);
  const darkPalette = createPaletteElevationsUNSAFE(dark);

  for (const p of lightPalette) {
    p.light = p;
    p.dark = darkPalette[0];
    p.inverse = darkPalette[0];
  }

  for (const p of darkPalette) {
    p.light = lightPalette[0];
    p.dark = p;
    p.inverse = lightPalette[0];
  }

  return lightPalette[0];
};

export const createPalette = <T extends PaletteSource>(source: T): Palette<T> => {
  const palette = createPaletteElevationsUNSAFE(source);

  for (const p of palette) {
    p.light = p;
    p.dark = p;
    p.inverse = p;
  }

  return palette[0];
};
