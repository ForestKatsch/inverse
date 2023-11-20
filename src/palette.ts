// Ideally, this would be enforced to only contain valid CSS colors. But until then
// it's a great alias to enforce types, if only visually.
export type HexColor = `#${string}`;

// IMO, this is cleaner and more explicit than a [T, T, T] tuple.
export type ProminenceLevels<T> = { primary: T; secondary: T; tertiary: T };

// There are only _ever_ two color schemes: light and dark, because you can only invert between light and dark.
export type ColorScheme = "light" | "dark";

type ResolvedProminence<T extends Object> = { [key in keyof T]: ProminenceLevels<T[key]> };

const indexToProminenceLevel = (index: number) => {
  if (index === 0) {
    return "primary";
  } else if (index === 1) {
    return "secondary";
  } else {
    return "tertiary";
  }
};

interface PaletteAttributes {
  isDark: boolean;
}

export type Palette<LayerType extends Object = {}, FlatType extends Object = {}> = {
  layers: [LayerType, LayerType, LayerType, ...LayerType[]];
  flat: FlatType;
} & PaletteAttributes;

type ResolvedPaletteFromTypes<LayerType extends Object, FlatType extends Object> = ResolvedProminence<LayerType> &
  FlatType &
  PaletteAttributes;

export type ResolvedPalette<T extends Palette> = T extends Palette<infer LayerType, infer FlatType>
  ? ResolvedPaletteFromTypes<LayerType, FlatType>
  : never;

/**
 * Resolves the palette by extracting and computing layers based on the provided @param elevation.
 *
 * @template T - The type of the palette. Inferred from the @param palette if not provided.
 * @param {T} palette - The palette to resolve.
 * @param {number} [elevation=0] - The elevation to resolve the layers from. If `elevation` is too high, the highest possible layers will be used, so elevation will not occur.
 * @returns {ResolvedPalette<T>} - The resolved palette.
 */
export const resolvePalette = <T extends Palette>(palette: T, elevation: number = 0): ResolvedPalette<T> => {
  const flat = palette.flat;

  let resolvedLayers = {} as any;

  // Ensure that `layers.length` is always 3 or more.
  const layerStart = Math.min(palette.layers.length - 3, elevation);

  if (layerStart < elevation) {
    console.warn(
      "Requested elevation is higher than the number of layers in the palette. Elevation will not work beyond the palette layer count minus 3. Add more layers to your palette to fix this issue and prevent this warning."
    );
  }

  // These are the three layers that will be used to compute the primary, secondary, and tertiary prominence levels.
  const layers = palette.layers.slice(layerStart, layerStart + 3);

  // Pull out the layer definitions and compute the resolved values.
  for (const [relativeLayerIndex, layer] of layers.entries()) {
    for (const [key, value] of Object.entries(layer)) {
      if (!(key in resolvedLayers)) {
        resolvedLayers[key] = {
          primary: value,
          secondary: value,
          tertiary: value,
        };
      } else {
        resolvedLayers[key][indexToProminenceLevel(relativeLayerIndex)] = value;
      }
    }
  }

  return {
    ...resolvedLayers,
    ...flat,
  } as ResolvedPalette<T>;
};
