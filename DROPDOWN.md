# Dropdown Component

A custom dropdown component for OpenTUI that displays a clickable trigger button and a floating dialog with selectable options, anchored to the dropdown's position.

## Features

- **Floating Menu**: Displays options in a dialog anchored below the trigger
- **Auto-Positioning**: Automatically adjusts menu position to stay on-screen
- **Click-Outside Detection**: Closes menu when clicking outside the dropdown
- **Keyboard Support**: Press `Esc` to close the menu
- **Hover States**: Visual feedback on hover
- **Disabled State**: Can be disabled to prevent interaction
- **Programmatic Control**: Set selections programmatically
- **Scrollable Menus**: Supports long lists with scrolling
- **Multiple Dropdowns**: Multiple dropdowns don't interfere with each other

## Usage

```typescript
import { Dropdown } from "./src/components/dropdown"

const options = [
  { name: "Option 1", description: "First option", value: "1" },
  { name: "Option 2", description: "Second option", value: "2" },
  { name: "Option 3", description: "Third option", value: "3" },
]

const dropdown = new Dropdown(renderer, {
  id: "my-dropdown",
  width: 30,
  options: options,
  selectedIndex: 0,
  onSelectionChange: (index: number, option) => {
    console.log(`Selected: ${option.name}`)
  },
})
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | undefined | Unique identifier for the dropdown |
| `width` | `number` | `30` | Width of the dropdown trigger |
| `position` | `"absolute" \| "relative"` | `"relative"` | Positioning mode |
| `left` | `number` | undefined | Left position (absolute) |
| `top` | `number` | undefined | Top position (absolute) |
| `right` | `number` | undefined | Right position (absolute) |
| `bottom` | `number` | undefined | Bottom position (absolute) |
| `zIndex` | `number` | undefined | Z-index layer |
| `options` | `SelectOption[]` | required | Array of options to display |
| `selectedIndex` | `number` | `0` | Initially selected option index |
| `disabled` | `boolean` | `false` | Whether dropdown is disabled |
| `backgroundColor` | `string` | `"#3B82F6"` | Background color of trigger |
| `textColor` | `string` | `"#FFFFFF"` | Text color of trigger |
| `hoverBackgroundColor` | `string` | `"#2563EB"` | Hover background color |
| `menuBackgroundColor` | `string` | `"#1E293B"` | Background color of menu |
| `menuBorderColor` | `string` | `"#38BDF8"` | Border color of menu |
| `menuWidth` | `number` | trigger width | Width of floating menu |
| `menuHeight` | `number` | auto | Height of floating menu (with scroll) |
| `onSelectionChange` | `(index, option) => void` | undefined | Callback when option selected |

## Methods

### `setSelectedIndex(index: number)`
Programmatically set the selected option.

```typescript
dropdown.setSelectedIndex(2) // Selects third option
```

### `getSelectedIndex(): number`
Get the current selected index.

```typescript
const index = dropdown.getSelectedIndex()
```

### `getSelectedOption(): SelectOption | undefined`
Get the currently selected option object.

```typescript
const option = dropdown.getSelectedOption()
console.log(option?.name)
```

### `setOptions(options: SelectOption[], keepSelection?: boolean)`
Update the dropdown options. Optionally keep the current selection.

```typescript
dropdown.setOptions(newOptions, true) // Keep current selection
dropdown.setOptions(newOptions, false) // Reset to first option
```

### `setDisabled(disabled: boolean)`
Enable or disable the dropdown.

```typescript
dropdown.setDisabled(true) // Disable dropdown
dropdown.setDisabled(false) // Enable dropdown
```

### `isDisabled(): boolean`
Check if dropdown is disabled.

```typescript
if (dropdown.isDisabled()) {
  console.log("Dropdown is disabled")
}
```

### `isOpen(): boolean`
Check if menu is currently open.

```typescript
if (dropdown.isOpen()) {
  console.log("Menu is open")
}
```

### `toggleMenu()`
Toggle the menu open/closed state.

```typescript
dropdown.toggleMenu()
```

## Demo

Run the demo to see all features:

```bash
npm run dropdown
```

## Demo Features

- **Basic Dropdowns**: Simple dropdowns with fruit and color selections
- **Controlled Dropdown**: Size selection with Prev/Next buttons
- **Scrollable List**: Country selection with scrolling for long lists
- **Selection Summary**: Shows all current selections in real-time
- **Instructions**: How to interact with dropdowns

## Implementation Details

### Positioning

The menu automatically positions itself below the dropdown trigger. If there's not enough space at the bottom, it repositions above the trigger. It also adjusts horizontally to stay within screen bounds.

### Click-Outside Detection

When the menu is open, a global mouse click handler is installed. Clicks outside both the trigger and the menu will close the dropdown.

### Focus Management

- When menu opens: Focus is automatically given to the Select component inside the menu
- When menu closes: Focus is removed from the Select component
- When using keyboard navigation: Arrow keys work within the Select component

### Event Handling

The dropdown uses OpenTUI's event system:
- `onMouseDown`: Toggle menu when clicking the trigger
- `renderer.on("mousemove")`: Track hover state
- `renderer.on("mousedown")`: Click-outside detection (when menu open)
- `renderer.keyInput.on("keypress")`: Handle Escape key

## Colors

The component follows the existing color scheme:
- **Trigger**: `#3B82F6` (blue), hover: `#2563EB` (dark blue)
- **Disabled**: `#334155` (slate gray)
- **Menu Background**: `#1E293B` (dark slate)
- **Menu Border**: `#38BDF8` (light blue)
- **Selected Option**: `#1E3A5F` (dark blue)
- **Selected Text**: `#38BDF8` (light blue)

## Limitations

- Menu width defaults to trigger width, but can be overridden with `menuWidth`
- Long option names may be truncated if they exceed menu width
- The Select component inside the menu handles scrolling

## Future Enhancements

- Support for custom option rendering (icons, rich text)
- Multi-select mode
- Search/filter functionality in menu
- Keyboard shortcuts to open menu (e.g., Space/Enter when focused)
