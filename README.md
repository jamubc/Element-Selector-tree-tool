# Element-Selector-tree-tool ([View on Greasyfork](https://greasyfork.org/en/scripts/542567-element-selector-tool))

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green?logo=tampermonkey)](https://tampermonkey.net/) [![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-blue?logo=violentmonkey)](https://violentmonkey.github.io/) [![Web Script](https://img.shields.io/badge/Web%20Script-Compatible-orange?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A powerful userscript that provides developer-friendly CSS selectors for any DOM element with visual highlighting and hierarchical tree view.

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

## Installation

1. Install a userscript manager like [Tampermonkey](https://tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
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

This project is licensed under the Apache License, Version 2.0 with Commons Clause License Condition v1.0 - see the [LICENSE](LICENSE) file for details.

**Commons Clause License Condition v1.0**: The Software is provided to you by the Licensor under the License, as defined below, subject to the following condition.

Without limiting other conditions in the License, the grant of rights under the License will not include, and the License does not grant to you, the right to Sell the Software.

For purposes of the foregoing, "Sell" means practicing any or all of the rights granted to you under the License to provide to third parties, for a fee or other consideration (including without limitation fees for hosting or consulting/ support services related to the Software), a product or service whose value derives, entirely or substantially, from the functionality of the Software.
