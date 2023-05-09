// Ideally, this would be enforced to only contain valid CSS colors. But until then
// it's a great alias to enforce types, if only visually.
export type Color = string;

export type ColorScheme = "light" | "dark";

export interface PaletteSource {
  bg: Color[];
}

export type PaletteVariants = {
  _lightIndex: number;
  _darkIndex: number;
  _invertedIndex: number;
  _elevatedIndex: number;
};

export type Palette<T extends PaletteSource> = Omit<T, "bg"> & {
  bgPrimary: Color;
  bgSecondary: Color;
} & PaletteVariants;

export type PaletteContainer<T extends PaletteSource> = Palette<T>[];

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
        _elevatedIndex: index === palettes.length - 1 ? index : index + 1,
      } as Palette<T>)
  );

  return elevations;
};

export const createThemedPaletteContainer = <T extends PaletteSource>(light: T, dark: T): PaletteContainer<T> => {
  const lightPalettes = createPaletteElevationsUNSAFE(light);
  const darkPalettes = createPaletteElevationsUNSAFE(dark);

  const palettes = [...lightPalettes, ...darkPalettes];

  for (const p of lightPalettes) {
    p._lightIndex = palettes.indexOf(p);
    p._darkIndex = palettes.indexOf(darkPalettes[0]);
    p._invertedIndex = palettes.indexOf(darkPalettes[0]);
  }

  for (const p of darkPalettes) {
    p._lightIndex = palettes.indexOf(lightPalettes[0]);
    p._darkIndex = palettes.indexOf(p);
    p._invertedIndex = palettes.indexOf(lightPalettes[0]);
    p._elevatedIndex += palettes.indexOf(darkPalettes[0]);
  }

  return palettes;
};

/*
export const createPalette = <T extends PaletteSource>(source: T): PaletteContainer<T> => {
  const palettes = createPaletteElevationsUNSAFE(source);

  for (const p of palettes) {
    p._lightIndex = palettes.indexOf(p);
    p._darkIndex = palettes.indexOf(p);
    p._invertedIndex = palettes.indexOf(p);
  }

  return palettes;
};
*/

export const getByKey = <T extends PaletteSource>(
  container: PaletteContainer<T>,
  palette: Palette<T>,
  key: keyof PaletteVariants
): Palette<T> => {
  return container[palette[key]];
};

export const getInverted = <T extends PaletteSource>(
  container: PaletteContainer<T>,
  palette: Palette<T>
): Palette<T> => {
  return getByKey(container, palette, "_invertedIndex");
};

export const getElevated = <T extends PaletteSource>(
  container: PaletteContainer<T>,
  palette: Palette<T>
): Palette<T> => {
  return getByKey(container, palette, "_elevatedIndex");
};

export const getColorScheme = <T extends PaletteSource>(
  container: PaletteContainer<T>,
  palette: Palette<T>,
  colorScheme: ColorScheme
): Palette<T> => {
  return getByKey(container, palette, colorScheme === "light" ? "_lightIndex" : "_darkIndex");
};
