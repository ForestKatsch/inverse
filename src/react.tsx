import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { Palette, PaletteContainer, PaletteSource } from "./palette";

const PaletteContext = createContext<{
  index: number;
  palette: PaletteContainer<PaletteSource>;
}>({
  index: 0,
  palette: [],
});

interface PaletteProps {
  palette: PaletteContainer<PaletteSource>;
  index?: number;
}

// Provides a root palette. This should exist at the root of your app, and should be passed the result
// of either createThemedPalette or createPalette (depending on if you want to switch between light and dark themes or not.)
export const PaletteProvider: React.FC<PropsWithChildren<PaletteProps>> = ({
  children,
  palette: palette,
  index = 0,
}) => {
  const memoizedPalette = useMemo(
    () => ({
      index,
      palette,
    }),
    [palette]
  );

  return <PaletteContext.Provider value={memoizedPalette}>{children}</PaletteContext.Provider>;
};

// Elevates the current palette.
export const PaletteElevated: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { index, palette } = usePaletteContainer();
  return (
    <PaletteProvider palette={palette} index={palette[index]._elevatedIndex}>
      {children}
    </PaletteProvider>
  );
};

// Inverts the current palette.
export const PaletteInverted: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { index, palette } = usePaletteContainer();
  return (
    <PaletteProvider palette={palette} index={palette[index]._invertedIndex}>
      {children}
    </PaletteProvider>
  );
};

const usePaletteContainer = () => {
  return useContext(PaletteContext);
};

// Applications should strongly type this with the PaletteSource type (or better yet, wrap this in a hook.)
// As long as they pass a Palette derived from one of their strongly typed sources, this is guaranteed to be safe.
export const usePalette = <T extends PaletteSource>(): Palette<T> => {
  const { index, palette } = usePaletteContainer();

  return palette[index] as Palette<T>;
};
