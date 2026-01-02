import { createCliRenderer, BoxRenderable, TextRenderable } from "@opentui/core"
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

setupErrorHandlers("Simple Demo")

async function run() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  })
  setRenderer(renderer)

  renderer.setBackgroundColor("#0F172A")

  const container = new BoxRenderable(renderer, {
    id: "container",
    width: 60,
    height: 15,
    backgroundColor: "#1E293B",
    border: true,
    borderStyle: "single",
    borderColor: "#3B82F6",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  })
  renderer.root.add(container)

  const title = new TextRenderable(renderer, {
    content: "TUI Component Library",
    fg: "#38BDF8",
  })
  container.add(title)

  const subtitle = new TextRenderable(renderer, {
    content: "Built with OpenTUI",
    fg: "#94A3B8",
  })
  container.add(subtitle)

  const success = new TextRenderable(renderer, {
    content: "✓ Demo running successfully!",
    fg: "#22C55E",
  })
  container.add(success)

  renderer.start()
}

withErrorHandling(run, "Simple Demo")
