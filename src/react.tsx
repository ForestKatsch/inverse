import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { ColorScheme, Palette, ResolvedPalette, resolvePalette } from "./palette";

const PaletteContext = createContext<{
  elevation: number;

  light: Palette;
  dark: Palette;
  colorScheme: ColorScheme;

  // Truthfully I don't care if this breaks.
  resolved: any;
}>({
  elevation: 0,
  light: {
    flat: {},
    isDark: false,
    layers: [{}, {}, {}],
  },
  dark: {
    flat: {},
    isDark: true,
    layers: [{}, {}, {}],
  },
  colorScheme: "light",
  resolved: {},
});

export const PaletteProvider: React.FC<
  PropsWithChildren<{
    light: Palette;
    dark: Palette;

    colorScheme?: ColorScheme;

    elevation?: number;
    invert?: boolean;
  }>
> = ({ children, light, dark, colorScheme = "light", elevation = 0, invert = false }) => {
  const isDarkColorScheme = colorScheme === "dark";
  const palette = (invert ? !isDarkColorScheme : isDarkColorScheme) ? dark : light;

  const resolved = useMemo(() => resolvePalette(palette, elevation), [elevation, palette]);

  return (
    <PaletteContext.Provider value={{ elevation, light, dark, colorScheme, resolved }}>
      {children}
    </PaletteContext.Provider>
  );
};

// Elevates the current palette.
export const PaletteElevated: React.FC<PropsWithChildren<{ elevationOffset?: number }>> = ({
  children,
  elevationOffset = 1,
}) => {
  const container = usePaletteContainer();

  return (
    <PaletteProvider {...container} elevation={container.elevation + elevationOffset}>
      {children}
    </PaletteProvider>
  );
};

// Inverts the current palette.
export const PaletteInverted: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const container = usePaletteContainer();

  return (
    <PaletteProvider {...container} elevation={0} invert={true}>
      {children}
    </PaletteProvider>
  );
};

const usePaletteContainer = () => {
  return useContext(PaletteContext);
};

export const usePaletteElevation = () => {
  return usePaletteContainer().elevation;
};

// Applications should strongly type this with the Palette type (or better yet, wrap this in a useAppPalette hook.)
// As long as they pass a Palette derived from one of their strongly typed sources, this is guaranteed to be safe.
export const usePalette = <T extends Palette>(): ResolvedPalette<T> => {
  return usePaletteContainer().resolved;
};
