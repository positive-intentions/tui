import { createCliRenderer, TextRenderable } from "@opentui/core"
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

setupErrorHandlers("Simple Demo")

async function run() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  })
  setRenderer(renderer)

  renderer.setBackgroundColor("#0F172A")

  const text = new TextRenderable(renderer, {
    content: "Hello, OpenTUI!",
    fg: "#22C55E",
  })
  renderer.root.add(text)

  renderer.start()
}

withErrorHandling(run, "Simple Demo")
