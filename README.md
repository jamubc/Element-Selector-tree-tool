# Element Selector Tool [![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green?logo=tampermonkey)](https://tampermonkey.net/) [![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-blue?logo=violentmonkey)](https://violentmonkey.github.io/)

A powerful userscript that provides developer-friendly CSS selectors for any DOM element with visual highlighting and hierarchical tree view.

## Features

- **Smart Selector Generation**: Prioritizes reliable selectors (ID → data attributes → unique classes → semantic attributes)
- **Visual Element Highlighting**: Precise border overlay with responsive positioning
- **Interactive Tree View**: Shows element hierarchy with syntax highlighting
- **One-Click Copy**: Click any highlighted element to copy its selector to clipboard
- **Keyboard Toggle**: Press `Ctrl+E` to activate/deactivate selector mode

## Installation

1. Install a userscript manager like [Tampermonkey](https://tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click [here](script.js) to install the script
3. The script will automatically run on all websites

## Usage

1. **Activate**: Press `Ctrl+E` on any webpage
2. **Inspect**: Hover over elements to see their selectors and hierarchy
3. **Copy**: Click on any highlighted element to copy its CSS selector
4. **Deactivate**: Press `Ctrl+E` again to exit selector mode

## Selector Priority

The tool generates selectors in this priority order:

1. **ID**: `#unique-id` (most reliable)
2. **Data Attributes**: `[data-testid="value"]` (testing/automation friendly)
3. **Unique Class Combinations**: `button.primary.large` (if selector is unique)
4. **ARIA Attributes**: `[role="button"]`, `[aria-label="Close"]`
5. **Semantic Elements**: `input[name="email"]`, `button[type="submit"]`
6. **Hierarchical Path**: `#container > div:nth-child(2) > span`

## Tree View Features

- **Syntax Highlighting**: Color-coded tags, IDs, classes, and attributes
- **Hierarchical Display**: Shows parent-child relationships with tree characters
- **Attribute Preview**: Displays relevant data attributes and ARIA labels
- **Text Content**: Shows text content for leaf nodes
- **Smart Truncation**: Handles long attribute values and selectors

## Technical Details

- **Framework**: Pure JavaScript userscript
- **Dependencies**: @violentmonkey/shortcut for keyboard handling
- **Compatibility**: Works on all modern browsers
- **Performance**: Minimal overhead, only active when toggled

## Contributing

Feel free to submit issues or pull requests to improve the tool's selector generation or user experience.

## License

This project is open source and available under the MIT License.