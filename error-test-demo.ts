import { createCliRenderer, TextRenderable } from "@opentui/core"
import { setupErrorHandlers, setRenderer, withErrorHandling, handleFatalError } from "./src/error-handler.js"

setupErrorHandlers("Error Test Demo")

async function run() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  })
  setRenderer(renderer)

  renderer.setBackgroundColor("#0F172A")

  const text = new TextRenderable(renderer, {
    content: "This will crash in 2 seconds...",
    fg: "#EF4444",
  })
  renderer.root.add(text)

  renderer.start()

  setTimeout(() => {
    throw new Error("This is a test error!")
  }, 2000)
}

withErrorHandling(run, "Error Test Demo")
