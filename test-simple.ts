import { createCliRenderer, TextRenderable } from "@opentui/core"

async function run() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  })

  renderer.setBackgroundColor("#0F172A")

  const text = new TextRenderable(renderer, {
    content: "Hello, OpenTUI!",
    fg: "#22C55E",
    position: "absolute",
    left: 5,
    top: 5,
  })
  renderer.root.add(text)

  renderer.start()
}

run().catch(console.error)
