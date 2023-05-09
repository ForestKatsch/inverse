import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { Palette, PaletteSource } from "./palette";

const PaletteContext = createContext<Palette<PaletteSource>>({} as Palette<PaletteSource>);

interface PaletteProps {
  palette: Palette<PaletteSource>;
}

// Provides a root palette. This should exist at the root of your app, and should be passed the result
// of either createThemedPalette or createPalette (depending on if you want to switch between light and dark themes or not.)
export const PaletteProvider: React.FC<PropsWithChildren<PaletteProps>> = ({ children, palette }) => {
  const memoizedPalette = useMemo(() => palette, [palette]);

  return <PaletteContext.Provider value={memoizedPalette}>{children}</PaletteContext.Provider>;
};

// Elevates the current palette.
export const PaletteElevated: React.FC<PropsWithChildren<PaletteProps>> = ({ children }) => {
  const palette = usePalette();
  return <PaletteProvider palette={palette.elevated}>{children}</PaletteProvider>;
};

// Inverts the current palette.
export const PaletteInverted: React.FC<PropsWithChildren<PaletteProps>> = ({ children }) => {
  const palette = usePalette();
  return <PaletteProvider palette={palette.inverse}>{children}</PaletteProvider>;
};

// Applications should strongly type this with the PaletteSource type (or better yet, wrap this in a hook.)
// As long as they pass a Palette derived from one of their strongly typed sources, this is guaranteed to be safe.
export const usePalette = <T extends PaletteSource>(): Palette<T> => {
  return useContext(PaletteContext) as Palette<T>;
};
