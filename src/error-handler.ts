import type { CliRenderer } from "@opentui/core"

let renderer: CliRenderer | null = null

export function setRenderer(r: CliRenderer | null) {
  renderer = r
}

export function cleanup() {
  if (renderer) {
    try {
      renderer.destroy()
    } catch (err) {
      console.error("Error during cleanup:", err)
    }
    renderer = null
  }
}

export function handleFatalError(error: unknown, context: string = "Application") {
  cleanup()

  console.error("\n" + "=".repeat(60))
  console.error(`${context} Error:`)
  console.error("=".repeat(60))

  if (error instanceof Error) {
    console.error(`\n${error.name}: ${error.message}`)
    if (error.stack) {
      console.error("\nStack trace:")
      console.error(error.stack)
    }
  } else if (typeof error === "string") {
    console.error(`\n${error}`)
  } else {
    console.error("\nAn unexpected error occurred:", error)
  }

  console.error("\n" + "=".repeat(60))
  console.error("The application will now exit.")
  console.error("=".repeat(60) + "\n")

  process.exit(1)
}

export function setupErrorHandlers(context: string = "Application") {
  process.on("uncaughtException", (error: Error) => {
    handleFatalError(error, `${context} (Uncaught Exception)`)
  })

  process.on("unhandledRejection", (reason: unknown) => {
    handleFatalError(reason, `${context} (Unhandled Rejection)`)
  })

  process.on("SIGINT", () => {
    console.log("\n\nReceived interrupt signal. Cleaning up...")
    cleanup()
    process.exit(0)
  })

  process.on("SIGTERM", () => {
    console.log("\n\nReceived termination signal. Cleaning up...")
    cleanup()
    process.exit(0)
  })
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = "Application"
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    handleFatalError(error, context)
    throw error
  }
}
