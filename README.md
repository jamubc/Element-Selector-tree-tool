# Element-Selector-tree-tool ([View on Greasyfork](https://greasyfork.org/en/scripts/542567-element-selector-tool))

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green?logo=tampermonkey)](https://tampermonkey.net/) [!

A powerful userscript that provides developer-friendly CSS selectors for any DOM element with visual highlighting and hierarchical tree view.

May also work with:
[Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-blue?logo=violentmonkey)](https://violentmonkey.github.io/) [![Web Script](https://img.shields.io/badge/Web%20Script-Compatible-orange?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<div align="center">

[![Chrome](https://img.shields.io/badge/Chrome-✓-4285F4?logo=googlechrome&logoColor=white)](https://www.google.com/chrome/) [![Firefox](https://img.shields.io/badge/Firefox-✓-FF7139?logo=firefox&logoColor=white)](https://www.mozilla.org/firefox/) [![Safari](https://img.shields.io/badge/Safari-✓-006CFF?logo=safari&logoColor=white)](https://www.apple.com/safari/)

</div> 

<table>
  <tr>
    <td><img width="402" alt="Highlighting an element and displaying its CSS selector" src="https://github.com/user-attachments/assets/2765c219-abba-444a-9d0f-6a8559bf468a"></td>
    <td><img width="414" alt="Hierarchical tree view of DOM elements" src="https://github.com/user-attachments/assets/80d7c2ea-f892-481b-94b3-33a8ec841523"></td>
  </tr>
</table>


## Features

- **One-Click Copy**: Click any highlighted element to copy its selector to clipboard
- **Smart Selector Generation**: Prioritizes reliable selectors (ID → data attributes → unique classes → semantic attributes)
- **Interactive Tree View**: Shows element hierarchy with syntax highlighting
- **Keyboard Toggle**: Press `Ctrl+E` or `esc` to activate/deactivate selector mode
- **Menu Options**: Change hotkeys and toggle enable/disable directly from the menu
- **Improved UI**: Unified and enhanced user interface for better usability
- **High-Resolution Context**: Increased resolution for better element context
- **CSP-Safe Elements**: Ensures compatibility with Content Security Policies
- **Shadow DOM Aware**: Resolves true targets via `event.composedPath()` and traverses open `shadowRoot`
- **Iframe Support**: Runs inside same‑origin iframes (no `@noframes`); overlays are per‑frame
- **Rich Copy**: Copies CSS plus a compact JSON block (tag/id/classes/data-*/role/text); writes HTML when supported
- **SPA Aware**: Hooks History API (`pushState`/`replaceState`) and listens to `popstate`/`hashchange` to re‑init
- **Responsive**: Uses pointer events and passive listeners; cleans up with `AbortController`; positions update via `ResizeObserver`

## Installation

1. Install a userscript manager like [Tampermonkey](https://tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) or [Userscript](https://apps.apple.com/ca/app/userscripts/id1463298887)
2. Click [here](https://greasyfork.org/en/scripts/542567-element-selector-tool) to install the script
3. The script will automatically run on all websites

## Usage

1. **Activate**: Press `Ctrl+E` on any webpage
2. **Inspect**: Hover over elements to see their selectors and hierarchy
3. **Copy**: Click on any highlighted element to copy its CSS selector
4. **Deactivate**: Press `Ctrl+E` again to exit selector mode

## Selector Priority

The tool generates selectors in this priority order:

1. **ID**: `#unique-id` (most reliable)
2. **Data Attributes**: `[data-testid]`, `[data-cy]`, `[data-test]`
3. **Stable Class Combo**: `button.primary.large` (avoids hashed/dynamic classes)
4. **ARIA Attributes**: `[role="button"]`, `[aria-label="Close"]`
5. **Semantic Elements**: `input[name="email"]`, `button[type="submit"]`
6. **Contextual :has()** (when applicable): e.g. `label[for="id"]:has(+ input)`
7. **Hierarchical Path**: nearest‑ID path using `:nth-of-type` when needed

## Tree View Features

- **Syntax Highlighting**: Color-coded tags, IDs, classes, and attributes
- **Hierarchical Display**: Shows parent-child relationships with tree characters
- **Attribute Preview**: Displays relevant data attributes and ARIA labels
- **Text Content**: Shows text content for leaf nodes
- **Smart Truncation**: Handles long attribute values and selectors

## Technical Details

- **Framework**: Pure JavaScript userscript
- **Compatibility**: Works on all modern browsers
- **Shadow DOM**: Uses `event.composedPath()` and traverses open `shadowRoot`
- **Iframes**: Script executes per frame; respects same‑origin boundaries
- **Clipboard**: Async Clipboard API with rich copy; legacy `execCommand` fallback
- **SPA Hooks**: Patches History API; listens to `popstate`/`hashchange`
- **Events**: Pointer events (`pointermove/over`) with passive listeners and `AbortController`
- **Overlay**: Non‑blocking (`pointer-events:none`); repositions via `ResizeObserver`

## Contributing

Feel free to submit issues or pull requests to improve the tool's selector generation or user experience.

## License

This project is licensed under the Apache License, Version 2.0 with Commons Clause License Condition v1.0 - see the [LICENSE](LICENSE) file for details.
