import { createCliRenderer, BoxRenderable, TextRenderable, InputRenderable, InputRenderableEvents, type CliRenderer, type MouseEvent, RGBA } from "@opentui/core"
import { Input, TextField, PasswordField, TextArea, EmailField, NumberField } from "./src/components/input.js"
import { Dialog } from "./src/components/dialog.js"
import { EditDialog } from "./src/components/edit-dialog.js"
import { Button, IconButton } from "./src/components/button.js"
import { Select } from "./src/components/select.js"
import { Dropdown } from "./src/components/dropdown.js"
import { Container, Row, Column, Card, Heading, Paragraph, Label, Status, Code } from "./src/index.js"

export interface ComponentDemo {
  name: string
  category: string
  description: string
  keywords: string[]
  demo: (renderer: CliRenderer) => BoxRenderable
}

const componentRegistry: ComponentDemo[] = [
  {
    name: "Button",
    category: "Interactive",
    description: "Clickable button with hover states",
    keywords: ["button", "click", "action", "interactive"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const row1 = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      })
      const btn1 = new Button(renderer, { label: "Primary" })
      const btn2 = new Button(renderer, { label: "Disabled", disabled: true })
      row1.add(btn1)
      row1.add(btn2)
      container.add(row1)

      const row2 = new BoxRenderable(renderer, {
        flexDirection: "row",
        gap: 2,
      })
      const btn3 = new Button(renderer, { label: "Success", backgroundColor: "#22C55E" })
      const btn4 = new Button(renderer, { label: "Danger", backgroundColor: "#EF4444" })
      row2.add(btn3)
      row2.add(btn4)
      container.add(row2)

      return container
    },
  },
  {
    name: "IconButton",
    category: "Interactive",
    description: "Icon-only button variant",
    keywords: ["button", "icon", "action", "compact"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "row",
        padding: 2,
        gap: 2,
      })

      const icon1 = new IconButton(renderer, { icon: "✓" })
      const icon2 = new IconButton(renderer, { icon: "✗", backgroundColor: "#EF4444" })
      const icon3 = new IconButton(renderer, { icon: "?", backgroundColor: "#F59E0B" })
      const icon4 = new IconButton(renderer, { icon: "+", backgroundColor: "#22C55E" })

      container.add(icon1)
      container.add(icon2)
      container.add(icon3)
      container.add(icon4)

      return container
    },
  },
  {
    name: "Input",
    category: "Input",
    description: "Base input field with placeholder",
    keywords: ["input", "text", "field", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const input1 = new Input(renderer, {
        id: "input-1",
        placeholder: "Enter text...",
        width: 40,
      })
      container.add(input1)

      const input2 = new Input(renderer, {
        id: "input-2",
        placeholder: "With custom color...",
        width: 40,
        backgroundColor: "#1E293B",
        textColor: "#38BDF8",
      })
      container.add(input2)

      return container
    },
  },
  {
    name: "TextField",
    category: "Input",
    description: "Text input with predefined placeholder",
    keywords: ["input", "text", "field", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Username:" })
      container.add(label)

      const field = new TextField(renderer, {
        id: "username",
        placeholder: "Enter your username",
        width: 40,
      })
      container.add(field)

      return container
    },
  },
  {
    name: "PasswordField",
    category: "Input",
    description: "Password input with masked display",
    keywords: ["input", "password", "masked", "secure", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Password:" })
      container.add(label)

      const field = new PasswordField(renderer, {
        id: "password",
        placeholder: "Enter your password",
        width: 40,
      })
      container.add(field)

      return container
    },
  },
  {
    name: "TextArea",
    category: "Input",
    description: "Multi-line text input",
    keywords: ["input", "textarea", "multiline", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Message:" })
      container.add(label)

      const textarea = new TextArea(renderer, {
        id: "message",
        width: 50,
        height: 5,
        placeholder: "Enter your message...",
      })
      container.add(textarea)

      return container
    },
  },
  {
    name: "EmailField",
    category: "Input",
    description: "Email input with validation",
    keywords: ["input", "email", "validation", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Email:" })
      container.add(label)

      const field = new EmailField(renderer, {
        id: "email",
        placeholder: "Enter your email",
        width: 40,
      })
      container.add(field)

      return container
    },
  },
  {
    name: "NumberField",
    category: "Input",
    description: "Numeric input with min/max validation",
    keywords: ["input", "number", "numeric", "validation", "form"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Age (0-120):" })
      container.add(label)

      const field = new NumberField(renderer, {
        id: "age",
        placeholder: "Enter age",
        width: 40,
        min: 0,
        max: 120,
      })
      container.add(field)

      return container
    },
  },
  {
    name: "Select",
    category: "Interactive",
    description: "Selection list with keyboard navigation",
    keywords: ["select", "dropdown", "list", "choice", "interactive"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Select an option:" })
      container.add(label)

      const options = [
        { name: "Option 1", description: "First option", value: "opt1" },
        { name: "Option 2", description: "Second option", value: "opt2" },
        { name: "Option 3", description: "Third option", value: "opt3" },
        { name: "Option 4", description: "Fourth option", value: "opt4" },
        { name: "Option 5", description: "Fifth option", value: "opt5" },
      ]

      const select = new Select(renderer, {
        id: "my-select",
        width: 40,
        height: 8,
        options,
      })
      container.add(select)

      return container
    },
  },
  {
    name: "Dropdown",
    category: "Interactive",
    description: "Collapsible dropdown with floating menu",
    keywords: ["dropdown", "select", "menu", "choice", "interactive"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Select category:" })
      container.add(label)

      const options = [
        { name: "Personal", description: "Personal account", value: "personal" },
        { name: "Business", description: "Business account", value: "business" },
        { name: "Enterprise", description: "Enterprise account", value: "enterprise" },
      ]

      const dropdown = new Dropdown(renderer, {
        id: "category-dropdown",
        width: 35,
        options,
      })
      container.add(dropdown)

      return container
    },
  },
  {
    name: "Dialog",
    category: "Interactive",
    description: "Confirmation dialog with confirm/cancel",
    keywords: ["dialog", "modal", "confirm", "popup", "interactive"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
        alignItems: "center",
      })

      const label = new Label(renderer, { content: "Click to show dialog:" })
      container.add(label)

      const dialog = new Dialog(renderer, {
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
        confirmText: "Yes",
        cancelText: "No",
      })

      const btn = new Button(renderer, {
        label: "Show Dialog",
        onClick: () => {
          dialog.show(
            () => {
              console.log("Confirmed!")
            },
            () => {
              console.log("Cancelled!")
            }
          )
        },
      })
      container.add(btn)

      return container
    },
  },
  {
    name: "EditDialog",
    category: "Interactive",
    description: "Edit dialog with input field",
    keywords: ["dialog", "modal", "edit", "input", "interactive"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
        alignItems: "center",
      })

      const label = new Label(renderer, { content: "Click to edit:" })
      container.add(label)

      const editDialog = new EditDialog(renderer, {
        title: "Edit Text",
        confirmText: "Save",
        cancelText: "Cancel",
      })

      const initialText = "Edit me!"
      const text = new TextRenderable(renderer, {
        content: initialText,
        fg: "#E2E8F0",
      })
      container.add(text)

      const btn = new Button(renderer, {
        label: "Edit",
        onClick: () => {
          editDialog.show(
            (newText: string) => {
              text.content = newText
              renderer.requestRender()
            },
            () => {
              console.log("Edit cancelled")
            },
            initialText
          )
        },
      })
      container.add(btn)

      return container
    },
  },
  {
    name: "Container",
    category: "Layout",
    description: "Basic box container with flexbox support",
    keywords: ["container", "box", "layout", "wrapper"],
    demo: (renderer: CliRenderer) => {
      const container = new Container(renderer, {
        padding: 2,
      })

      const heading = new Heading(renderer, {
        level: 3,
        content: "Container Component",
      })
      container.add(heading)

      const paragraph = new Paragraph(renderer, {
        content: "A flexible container with padding and flexbox support.",
      })
      container.add(paragraph)

      return container
    },
  },
  {
    name: "Row",
    category: "Layout",
    description: "Horizontal flex container",
    keywords: ["row", "horizontal", "layout", "flex"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label = new Label(renderer, { content: "Horizontal Row:" })
      container.add(label)

      const row = new Row(renderer, { gap: 1 })

      const item1 = new TextRenderable(renderer, { content: "Item 1", fg: "#3B82F6" })
      const item2 = new TextRenderable(renderer, { content: "Item 2", fg: "#22C55E" })
      const item3 = new TextRenderable(renderer, { content: "Item 3", fg: "#F59E0B" })

      row.add(item1)
      row.add(item2)
      row.add(item3)
      container.add(row)

      return container
    },
  },
  {
    name: "Column",
    category: "Layout",
    description: "Vertical flex container",
    keywords: ["column", "vertical", "layout", "flex"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "row",
        padding: 2,
        gap: 2,
      })

      const label = new Label(renderer, { content: "Vertical Column:" })
      container.add(label)

      const column = new Column(renderer, { gap: 1 })

      const item1 = new TextRenderable(renderer, { content: "Item 1", fg: "#3B82F6" })
      const item2 = new TextRenderable(renderer, { content: "Item 2", fg: "#22C55E" })
      const item3 = new TextRenderable(renderer, { content: "Item 3", fg: "#F59E0B" })

      column.add(item1)
      column.add(item2)
      column.add(item3)
      container.add(column)

      return container
    },
  },
  {
    name: "Card",
    category: "Layout",
    description: "Pre-styled container with border and title",
    keywords: ["card", "container", "border", "title", "layout"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const card1 = new Card(renderer, {
        title: "Info Card",
        borderColor: "#3B82F6",
      })
      const content1 = new Paragraph(renderer, {
        content: "This is an informational card.",
      })
      card1.add(content1)
      container.add(card1)

      const card2 = new Card(renderer, {
        title: "Warning Card",
        borderColor: "#F59E0B",
      })
      const content2 = new Paragraph(renderer, {
        content: "This is a warning card.",
      })
      card2.add(content2)
      container.add(card2)

      return container
    },
  },
  {
    name: "Heading",
    category: "Text",
    description: "Headings with predefined colors",
    keywords: ["heading", "title", "text", "h1", "h2", "h3"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const h1 = new Heading(renderer, { level: 1, content: "Heading 1" })
      const h2 = new Heading(renderer, { level: 2, content: "Heading 2" })
      const h3 = new Heading(renderer, { level: 3, content: "Heading 3" })
      const h4 = new Heading(renderer, { level: 4, content: "Heading 4" })
      const h5 = new Heading(renderer, { level: 5, content: "Heading 5" })
      const h6 = new Heading(renderer, { level: 6, content: "Heading 6" })

      container.add(h1)
      container.add(h2)
      container.add(h3)
      container.add(h4)
      container.add(h5)
      container.add(h6)

      return container
    },
  },
  {
    name: "Paragraph",
    category: "Text",
    description: "Paragraph text with muted colors",
    keywords: ["paragraph", "text", "body", "content"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const p1 = new Paragraph(renderer, {
        content: "This is a paragraph with regular text.",
      })
      const p2 = new Paragraph(renderer, {
        content: "This is another paragraph with different content.",
      })
      const p3 = new Paragraph(renderer, {
        content: "Paragraphs use muted colors for better readability.",
      })

      container.add(p1)
      container.add(p2)
      container.add(p3)

      return container
    },
  },
  {
    name: "Label",
    category: "Text",
    description: "Form labels with bold styling",
    keywords: ["label", "text", "form", "input"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const label1 = new Label(renderer, { content: "Username:" })
      const label2 = new Label(renderer, { content: "Password:" })
      const label3 = new Label(renderer, { content: "Email:" })

      container.add(label1)
      container.add(label2)
      container.add(label3)

      return container
    },
  },
  {
    name: "Status",
    category: "Text",
    description: "Status indicators with icons",
    keywords: ["status", "indicator", "icon", "success", "error", "warning", "info"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "row",
        padding: 2,
        gap: 2,
      })

      const status1 = new Status(renderer, { status: "success", content: "Success" })
      const status2 = new Status(renderer, { status: "error", content: "Error" })
      const status3 = new Status(renderer, { status: "warning", content: "Warning" })
      const status4 = new Status(renderer, { status: "info", content: "Info" })

      container.add(status1)
      container.add(status2)
      container.add(status3)
      container.add(status4)

      return container
    },
  },
  {
    name: "Code",
    category: "Text",
    description: "Code display with monospace-style colors",
    keywords: ["code", "monospace", "codeblock", "pre"],
    demo: (renderer: CliRenderer) => {
      const container = new BoxRenderable(renderer, {
        flexDirection: "column",
        padding: 2,
        gap: 1,
      })

      const code1 = new Code(renderer, { content: "const x = 42" })
      const code2 = new Code(renderer, { content: "function hello() {}" })
      const code3 = new Code(renderer, { content: "import { foo } from './bar'" })

      container.add(code1)
      container.add(code2)
      container.add(code3)

      return container
    },
  },
]

export function getFilteredComponents(searchQuery: string): ComponentDemo[] {
  const query = searchQuery.toLowerCase().trim()
  
  if (!query) {
    return componentRegistry
  }
  
  return componentRegistry.filter((comp) => {
    const matchName = comp.name.toLowerCase().includes(query)
    const matchCategory = comp.category.toLowerCase().includes(query)
    const matchKeywords = comp.keywords.some((kw) => kw.toLowerCase().includes(query))
    
    return matchName || matchCategory || matchKeywords
  })
}

export function getComponentByName(name: string): ComponentDemo | undefined {
  return componentRegistry.find((comp) => comp.name === name)
}

export function getAllComponents(): ComponentDemo[] {
  return componentRegistry
}
