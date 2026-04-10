# Demo: unified-latex-to-pretext Converter

A simple web interface for testing LaTeX to PreTeXt conversion in real-time.

## Running the Demo

First, build the library with dependencies:

```bash
npm run build
```

Then start the demo server:

```bash
npm run demo
```

Or if you already have the library built, you can run the demo directly:

```bash
vite --config demo/vite.config.ts
```

The demo will open automatically in your default browser at `http://localhost:5173`.

## Features

- **Side-by-side editors**: LaTeX input on the left, PreTeXt output on the right
- **Real-time conversion**: Output updates automatically as you type (with a 500ms debounce)
- **Error display**: Shows detailed error messages if conversion fails
- **Copy to clipboard**: Easily copy the converted output
- **Sample LaTeX**: Includes a sample LaTeX document to get you started

## Using the Demo

1. Enter LaTeX code in the left panel
2. The converted PreTeXt XML will appear in the right panel
3. Use the "Copy Output" button to copy the result
4. Use "Clear All" to reset both panels

## Troubleshooting

If you see import errors, make sure you've run `npm run build` first to generate the dist files.

The demo uses CDN versions of some dependencies (unified, xast-util-to-xml) and loads the local unified-latex-to-pretext package from the dist folder.
