import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { ColorScheme, Palette, ResolvedPalette, mergePalettes, resolvePalette } from "./palette";

const PaletteContext = createContext<{
  elevation: number;

  regular: Palette;
  inverse: Palette;

  // What is the color scheme of `regular`?
  colorScheme: ColorScheme;

  // Truthfully I don't care if this breaks.
  resolved: any;
}>({
  elevation: 0,
  regular: {
    flat: {},
    layers: [{}, {}, {}],
  },
  inverse: {
    flat: {},
    layers: [{}, {}, {}],
  },
  colorScheme: "light",
  resolved: {},
});

const InternalPaletteProvider: React.FC<
  PropsWithChildren<{
    regular: Palette;
    inverse: Palette;

    colorScheme?: ColorScheme;

    elevation?: number;
  }>
> = ({ children, regular, inverse, colorScheme = "light", elevation = 0 }) => {
  const resolved = useMemo(() => resolvePalette(regular, elevation), [elevation, regular]);

  return (
    <PaletteContext.Provider value={{ elevation, regular, inverse, colorScheme, resolved }}>
      {children}
    </PaletteContext.Provider>
  );
};

export const PaletteProvider: React.FC<
  PropsWithChildren<{
    light: Palette;
    dark: Palette;

    colorScheme?: ColorScheme;

    elevation?: number;
  }>
> = ({ children, light, dark, colorScheme = "light", elevation = 0 }) => {
  const regular = colorScheme === "dark" ? dark : light;
  const inverse = colorScheme === "dark" ? light : dark;

  return (
    <InternalPaletteProvider elevation={elevation} regular={regular} inverse={inverse} colorScheme={colorScheme}>
      {children}
    </InternalPaletteProvider>
  );
};

// Elevates the current palette.
export const PaletteElevated: React.FC<PropsWithChildren<{ elevationOffset?: number }>> = ({
  children,
  elevationOffset = 1,
}) => {
  const container = usePaletteContainer();

  return (
    <InternalPaletteProvider {...container} elevation={container.elevation + elevationOffset}>
      {children}
    </InternalPaletteProvider>
  );
};

// Inverts the current palette.
export const PaletteInverted: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const container = usePaletteContainer();

  return (
    <InternalPaletteProvider
      {...container}
      elevation={0}
      regular={container.inverse}
      inverse={container.regular}
      colorScheme={container.colorScheme === "dark" ? "light" : "dark"}
    >
      {children}
    </InternalPaletteProvider>
  );
};

// Overlays the current palette with a new one that contains a subset of `Palette`.
export const PaletteOverlay: React.FC<PropsWithChildren<{ regular: Partial<Palette>; inverse: Partial<Palette> }>> = ({
  children,
  regular,
  inverse,
}) => {
  const container = usePaletteContainer();

  const { regularMerged, inverseMerged } = useMemo(
    () => ({
      regularMerged: mergePalettes(container.regular, regular),
      inverseMerged: mergePalettes(container.regular, inverse),
    }),
    [container.regular, container.inverse, regular, inverse]
  );

  return (
    <InternalPaletteProvider {...container} regular={regularMerged} inverse={inverseMerged}>
      {children}
    </InternalPaletteProvider>
  );
};

export const usePaletteContainer = () => {
  return useContext(PaletteContext);
};

export const usePaletteElevation = () => {
  return usePaletteContainer().elevation;
};

export const usePaletteColorScheme = () => {
  return usePaletteContainer().colorScheme;
};

// Applications should strongly type this with the Palette type (or better yet, wrap this in a useAppPalette hook.)
// As long as they pass a Palette derived from one of their strongly typed sources, this is guaranteed to be safe.
export const usePalette = <T extends Palette>(): ResolvedPalette<T> => {
  return usePaletteContainer().resolved;
};
