# Error Handling

This TUI library now includes comprehensive error handling to gracefully manage application crashes and provide useful error information.

## Features

- **Global Error Handlers**: Automatically catches uncaught exceptions and unhandled promise rejections
- **Graceful Cleanup**: Properly destroys the renderer before exiting
- **Helpful Error Messages**: Displays error details including stack traces
- **Signal Handling**: Handles SIGINT (Ctrl+C) and SIGTERM gracefully
- **Easy Integration**: Simple API to add error handling to your apps

## Usage

### Basic Usage

```typescript
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

// Setup error handlers at the top of your file
setupErrorHandlers("My App")

async function run() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  })
  
  // Register the renderer for cleanup
  setRenderer(renderer)
  
  // Your app logic here...
  renderer.start()
}

// Wrap your run function with error handling
withErrorHandling(run, "My App")
```

## What's Included

### Error Display

When an error occurs, you'll see:

```
============================================================
My App (Uncaught Exception) Error:
============================================================

Error: Something went wrong
  at myFile.ts:42:10
  at anotherFunction (myFile.ts:38:5)
  ...

============================================================
The application will now exit.
============================================================
```

### Automatic Cleanup

The error handler automatically:
1. Destroys the renderer to restore terminal state
2. Displays the error with context
3. Exits cleanly with status code 1

### Signal Handling

- **SIGINT (Ctrl+C)**: Cleanly exits with status 0
- **SIGTERM**: Cleanly exits with status 0

## API Reference

### `setupErrorHandlers(context: string)`

Sets up global error handlers for uncaught exceptions, unhandled rejections, and signals.

**Parameters:**
- `context`: A string identifying your application for error messages

### `setRenderer(renderer: CliRenderer | null)`

Registers the renderer for cleanup when errors occur.

**Parameters:**
- `renderer`: The CliRenderer instance or null

### `withErrorHandling<T>(fn: () => Promise<T>, context: string)`

Wraps an async function with error handling.

**Parameters:**
- `fn`: The async function to wrap
- `context`: A string identifying the operation for error messages

**Returns:** Promise<T>

### `handleFatalError(error: unknown, context: string)`

Manually handles a fatal error with cleanup and display.

**Parameters:**
- `error`: The error to handle
- `context`: A string identifying the context of the error

### `cleanup()`

Manually cleans up the registered renderer. Called automatically by `handleFatalError`.

## Examples

See the following files for complete examples:
- `simple-demo.ts` - Basic usage
- `demo-working.ts` - Working demo
- `demo.ts` - Full demo
- `todo-demo.ts` - Complex application
- `demo-dropdown.ts` - Dropdown demo
- `error-test-demo.ts` - Error testing demo

## Testing Error Handling

Run `error-test-demo.ts` to see the error handling in action:

```bash
bun run error-test-demo.ts
```

This demo will automatically crash after 2 seconds to demonstrate the error handling.
