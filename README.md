# Inverse: a simple and powerful React theming library

## Usage

```jsx
import {
  createThemedPaletteContainer,
  usePalette,
  PaletteProvider,
  PaletteInverted,
  PaletteElevated,
} from "@forestkatsch/inverse";

// First, declare your themes.
const container = createThemedPaletteContainer(
  // light
  {
    // bgPrimary, bgSecondary
    //            bgPrimary, bgSecondary (when elevated)
    //
    // you can go as high as you want!
    bg: ["#fff", "#eee", "#ddd"],
    fg: "#000",
  },
  // dark
  {
    bg: ["#000", "#111", "#222"],
    fg: "#fff",
  }
);

// ...

export default function App() {
  // Make sure to provide the context!
  <PaletteProvider container={container}>{/* ... */}</PaletteProvider>;
}

// ...

export const MyBackgroundBox = ({ children }) => {
  // Now you can just usePalette anywhere you need colors.
  const { bgPrimary, fg } = usePalette();

  return <View style={{ color: fg, backgroundColor: bgPrimary }}>{children}</View>;
};

export const MyCard = ({ children, invert }) => {
  if (invert) {
    // Invert the colors automatically! usePalette will now return the inverse color scheme - no matter
    // what it already is.
    return (
      <PaletteInverted>
        <MyBackgroundBox>{children}</MyBackgroundBox>
      </PaletteInverted>
    );
  }

  // PaletteElevated will automatically use the next elevation level, and bgPrimary/bgSecondary will move up one item!
  return (
    <PaletteElevated>
      <MyBackgroundBox>{children}</MyBackgroundBox>
    </PaletteElevated>
  );
};
```

# License

Copyright 2023 Forest Katsch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
