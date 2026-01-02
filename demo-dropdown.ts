import { createCliRenderer, BoxRenderable, TextRenderable, type CliRenderer, type SelectOption } from "@opentui/core"
import { Dropdown } from "./src/components/dropdown.js"
import { Card, Column, Row, Label, Heading, Paragraph } from "./src/index.js"
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

setupErrorHandlers("Dropdown Demo")

let renderer: CliRenderer | null = null

const fruitOptions: SelectOption[] = [
  { name: "🍎 Apple", description: "A sweet red fruit", value: "apple" },
  { name: "🍌 Banana", description: "A yellow curved fruit", value: "banana" },
  { name: "🍊 Orange", description: "A citrus fruit", value: "orange" },
  { name: "🍇 Grapes", description: "Small purple berries", value: "grapes" },
  { name: "🍓 Strawberry", description: "A red berry fruit", value: "strawberry" },
  { name: "🍑 Peach", description: "A fuzzy stone fruit", value: "peach" },
]

const colorOptions: SelectOption[] = [
  { name: "Red", description: "The color of passion", value: "red" },
  { name: "Blue", description: "The color of the sky", value: "blue" },
  { name: "Green", description: "The color of nature", value: "green" },
  { name: "Yellow", description: "The color of sunshine", value: "yellow" },
  { name: "Purple", description: "The color of royalty", value: "purple" },
]

const sizeOptions: SelectOption[] = [
  { name: "Small", description: "Compact size", value: "s" },
  { name: "Medium", description: "Standard size", value: "m" },
  { name: "Large", description: "Big size", value: "l" },
  { name: "Extra Large", description: "Extra big size", value: "xl" },
]

const countryOptions: SelectOption[] = [
  { name: "United States", description: "USA", value: "us" },
  { name: "United Kingdom", description: "UK", value: "uk" },
  { name: "Canada", description: "CA", value: "ca" },
  { name: "Australia", description: "AU", value: "au" },
  { name: "Germany", description: "DE", value: "de" },
  { name: "France", description: "FR", value: "fr" },
  { name: "Japan", description: "JP", value: "jp" },
  { name: "Brazil", description: "BR", value: "br" },
  { name: "India", description: "IN", value: "in" },
  { name: "China", description: "CN", value: "cn" },
]

let selectedFruit = fruitOptions[0]
let selectedColor = colorOptions[0]
let selectedSize = sizeOptions[0]
let selectedCountry = countryOptions[0]

export async function run() {
  renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 30,
  })
  setRenderer(renderer)

  renderer.setBackgroundColor("#0F172A")

  const mainContainer = new Column(renderer, {
    id: "main-container",
    padding: 2,
    flexGrow: 1,
  })
  renderer.root.add(mainContainer)

  const header = new Card(renderer, {
    id: "header",
    height: 5,
    title: "DROPDOWN COMPONENT DEMO",
    titleAlignment: "center",
    borderColor: "#3B82F6",
  })
  mainContainer.add(header)

  const headerContent = new Paragraph(renderer, {
    content: "Click dropdowns to see floating menu with options",
  })
  header.add(headerContent)

  const row = new Row(renderer, {
    id: "main-row",
    flexGrow: 1,
    margin: 1,
  })
  mainContainer.add(row)

  const leftColumn = new Column(renderer, {
    id: "left-column",
    width: 50,
    flexGrow: 0,
    flexShrink: 0,
  })
  row.add(leftColumn)

  const rightColumn = new Column(renderer, {
    id: "right-column",
    flexGrow: 1,
    flexShrink: 1,
  })
  row.add(rightColumn)

  const basicCard = new Card(renderer, {
    id: "basic-card",
    title: "Basic Dropdowns",
    borderColor: "#22C55E",
  })
  leftColumn.add(basicCard)

  const basicColumn = new Column(renderer, {
    id: "basic-column",
    padding: 1,
  })
  basicCard.add(basicColumn)

  const fruitLabel = new Label(renderer, {
    content: "Select a Fruit",
  })
  basicColumn.add(fruitLabel)

  const fruitDropdown = new Dropdown(renderer, {
    id: "fruit-dropdown",
    width: 30,
    options: fruitOptions,
    selectedIndex: 0,
    onSelectionChange: (index: number, option: SelectOption) => {
      selectedFruit = option
      console.log(`Selected fruit: ${option.name}`)
      updateSummary()
    },
  })
  basicColumn.add(fruitDropdown)

  const colorLabel = new Label(renderer, {
    content: "Select a Color",
  })
  basicColumn.add(colorLabel)

  const colorDropdown = new Dropdown(renderer, {
    id: "color-dropdown",
    width: 30,
    options: colorOptions,
    selectedIndex: 0,
    menuWidth: 25,
    onSelectionChange: (index: number, option: SelectOption) => {
      selectedColor = option
      console.log(`Selected color: ${option.name}`)
      updateSummary()
    },
  })
  basicColumn.add(colorDropdown)

  const controlledCard = new Card(renderer, {
    id: "controlled-card",
    title: "Controlled Dropdown",
    borderColor: "#F59E0B",
    margin: 1,
  })
  leftColumn.add(controlledCard)

  const controlledColumn = new Column(renderer, {
    id: "controlled-column",
    padding: 1,
  })
  controlledCard.add(controlledColumn)

  const sizeLabel = new Label(renderer, {
    content: "Size Selection (programmatically controlled)",
  })
  controlledColumn.add(sizeLabel)

  const sizeDropdown = new Dropdown(renderer, {
    id: "size-dropdown",
    width: 30,
    options: sizeOptions,
    selectedIndex: 0,
    onSelectionChange: (index: number, option: SelectOption) => {
      selectedSize = option
      console.log(`Selected size: ${option.name}`)
      updateSummary()
    },
  })
  controlledColumn.add(sizeDropdown)

  const buttonBox = new BoxRenderable(renderer, {
    id: "button-box",
    height: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 1,
  })
  controlledColumn.add(buttonBox)

  const prevBtn = new BoxRenderable(renderer, {
    id: "prev-btn",
    width: 10,
    height: 1,
    backgroundColor: "#64748B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    border: true,
    borderStyle: "single",
    borderColor: "#94A3B8",
    onMouseDown: (event: any) => {
      if (event.button === 0) {
        event.stopPropagation()
        const currentIndex = sizeDropdown.getSelectedIndex()
        if (currentIndex > 0) {
          sizeDropdown.setSelectedIndex(currentIndex - 1)
          selectedSize = sizeOptions[currentIndex - 1]
          updateSummary()
        }
      }
    },
  })
  
  const prevText = new TextRenderable(renderer, {
    content: "[Prev]",
    fg: "#FFFFFF",
  })
  prevBtn.add(prevText)
  buttonBox.add(prevBtn)

  const nextBtn = new BoxRenderable(renderer, {
    id: "next-btn",
    width: 10,
    height: 1,
    backgroundColor: "#64748B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    border: true,
    borderStyle: "single",
    borderColor: "#94A3B8",
    onMouseDown: (event: any) => {
      if (event.button === 0) {
        event.stopPropagation()
        const currentIndex = sizeDropdown.getSelectedIndex()
        if (currentIndex < sizeOptions.length - 1) {
          sizeDropdown.setSelectedIndex(currentIndex + 1)
          selectedSize = sizeOptions[sizeOptions.getSelectedIndex()]
          updateSummary()
        }
      }
    },
  })
  
  const nextText = new TextRenderable(renderer, {
    content: "[Next]",
    fg: "#FFFFFF",
  })
  nextBtn.add(nextText)
  buttonBox.add(nextBtn)

  const scrollCard = new Card(renderer, {
    id: "scroll-card",
    title: "Scrollable Long List",
    borderColor: "#8B5CF6",
    margin: 1,
  })
  leftColumn.add(scrollCard)

  const scrollColumn = new Column(renderer, {
    id: "scroll-column",
    padding: 1,
  })
  scrollCard.add(scrollColumn)

  const countryLabel = new Label(renderer, {
    content: "Select a Country (scrollable)",
  })
  scrollColumn.add(countryLabel)

  const countryDropdown = new Dropdown(renderer, {
    id: "country-dropdown",
    width: 30,
    options: countryOptions,
    selectedIndex: 0,
    menuHeight: 8,
    onSelectionChange: (index: number, option: SelectOption) => {
      selectedCountry = option
      console.log(`Selected country: ${option.name}`)
      updateSummary()
    },
  })
  scrollColumn.add(countryDropdown)

  const edgeCard = new Card(renderer, {
    id: "edge-card",
    title: "Edge Positioning",
    borderColor: "#EC4899",
    margin: 1,
  })
  rightColumn.add(edgeCard)

  const edgeColumn = new Column(renderer, {
    id: "edge-column",
    padding: 1,
  })
  edgeCard.add(edgeColumn)

  const edgeLabel = new Label(renderer, {
    content: "Test dropdowns at different screen positions",
  })
  edgeColumn.add(edgeLabel)

  const edgeNote = new Paragraph(renderer, {
    content: "Resize terminal to see auto-positioning in action",
    fg: "#94A3B8",
  })
  edgeColumn.add(edgeNote)

  const summaryCard = new Card(renderer, {
    id: "summary-card",
    title: "Selection Summary",
    borderColor: "#06B6D4",
    margin: 1,
  })
  rightColumn.add(summaryCard)

  const summaryColumn = new Column(renderer, {
    id: "summary-column",
    padding: 1,
  })
  summaryCard.add(summaryColumn)

  const summaryHeading = new Heading(renderer, {
    level: 3,
    content: "Current Selections:",
  })
  summaryColumn.add(summaryHeading)

  const summaryText = new TextRenderable(renderer, {
    id: "summary-text",
    content: "",
    fg: "#E2E8F0",
  })
  summaryColumn.add(summaryText)

  const instructionsCard = new Card(renderer, {
    id: "instructions-card",
    height: 8,
    title: "Instructions",
    titleAlignment: "center",
    margin: 1,
    borderColor: "#64748B",
  })
  rightColumn.add(instructionsCard)

  const instructionsColumn = new Column(renderer, {
    id: "instructions-column",
    padding: 1,
  })
  instructionsCard.add(instructionsColumn)

  const instructions = new Paragraph(renderer, {
    content: `• Click dropdown to open menu
• Click option to select
• Click outside to close
• Press Esc to close menu
• Use Prev/Next buttons for controlled dropdown
• Resize terminal to test edge positioning`,
  })
  instructionsColumn.add(instructions)

  function updateSummary() {
    const summary = `  Fruit: ${selectedFruit.name}
  Color: ${selectedColor.name}
  Size: ${selectedSize.name}
  Country: ${selectedCountry.name}`
    summaryText.content = summary
    renderer?.requestRender()
  }

  renderer.start()
  updateSummary()
}

withErrorHandling(run, "Dropdown Demo")
