import { createCliRenderer, BoxRenderable, TextRenderable, InputRenderableEvents, InputRenderable, SelectRenderable, type CliRenderer, type MouseEvent, RGBA } from "@opentui/core"
import { Input } from "./src/components/input.js"
import { Card } from "./src/index.js"
import { Dropdown } from "./src/components/dropdown.js"
import { Dialog } from "./src/components/dialog.js"
import { EditDialog } from "./src/components/edit-dialog.js"
import { getFilteredComponents, getComponentByName, getAllComponents, type ComponentDemo } from "./storybook-registry.js"

let renderer: CliRenderer | null = null
let selectedComponent: ComponentDemo | null = null
let searchQuery = ""
let scrollOffset = 0
let MAX_VISIBLE = 10

function calculateMaxVisible(): number {
  const componentListContainer = renderer?.root.findDescendantById("component-list") as BoxRenderable | undefined
  if (!componentListContainer) return 10

  const availableHeight = componentListContainer.height
  const itemHeight = 3

  const calculatedMax = Math.floor(availableHeight / itemHeight)
  return Math.max(3, calculatedMax)
}

function updateMaxVisible() {
  const newMaxVisible = calculateMaxVisible()
  if (newMaxVisible !== MAX_VISIBLE) {
    MAX_VISIBLE = newMaxVisible
    const filtered = getFilteredComponents(searchQuery)
    const maxScrollOffset = Math.max(0, filtered.length - MAX_VISIBLE)
    scrollOffset = Math.min(scrollOffset, maxScrollOffset)
    renderComponentList()
  }
}

function clearComponentList() {
  const componentListContainer = renderer?.root.findDescendantById("component-list") as BoxRenderable | undefined
  if (!componentListContainer) return

  const children = componentListContainer.getChildren()
  for (const child of children) {
    if (child.id?.startsWith("comp-item-") || child.id?.startsWith("spacer-")) {
      componentListContainer.remove(child.id)
    }
  }
}

function renderComponentList() {
  clearComponentList()

  const componentListContainer = renderer?.root.findDescendantById("component-list") as BoxRenderable | undefined
  if (!componentListContainer) return

  const filteredComponents = getFilteredComponents(searchQuery)

  if (filteredComponents.length === 0) {
    const emptyText = new TextRenderable(renderer!, {
      id: "empty-text",
      content: "No components found",
      fg: "#64748B",
    })
    componentListContainer.add(emptyText)
    return
  }

  const visibleComponents = filteredComponents.slice(scrollOffset, scrollOffset + MAX_VISIBLE)

  visibleComponents.forEach((comp) => {
    const isSelected = selectedComponent?.name === comp.name
    const bgColor = isSelected ? RGBA.fromInts(30, 58, 95, 255) : RGBA.fromInts(15, 23, 42, 255)
    const fgColor = isSelected ? "#38BDF8" : "#E2E8F0"
    const categoryColor = isSelected ? "#94A3B8" : "#64748B"

    const item = new BoxRenderable(renderer!, {
      id: `comp-item-${comp.name}`,
      height: 3,
      flexGrow: 0,
      flexShrink: 0,
      flexDirection: "column",
      backgroundColor: bgColor,
      onMouseUp: (event: MouseEvent) => {
        if (event.button === 0) {
          selectedComponent = comp
          renderComponentList()
          renderPreview()
        }
      },
    })

    const nameText = new TextRenderable(renderer!, {
      id: `comp-name-${comp.name}`,
      content: comp.name,
      fg: fgColor,
    })
    item.add(nameText)

    const categoryText = new TextRenderable(renderer!, {
      id: `comp-category-${comp.name}`,
      content: comp.category,
      fg: categoryColor,
    })
    item.add(categoryText)

    componentListContainer.add(item)
  })

  const emptySpace = MAX_VISIBLE - visibleComponents.length
  for (let i = 0; i < emptySpace; i++) {
    const spacer = new BoxRenderable(renderer!, {
      id: `spacer-${i}`,
      height: 3,
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: "#0F172A",
    })
    componentListContainer.add(spacer)
  }
}

function renderPreview() {
  // Close all open dropdowns and dialogs before switching components
  if (renderer) {
    Dropdown.closeAllOpenDropdowns(renderer)
    Dialog.closeAllOpenDialogs(renderer)
    EditDialog.closeAllOpenDialogs(renderer)
  }

  const previewContainer = renderer?.root.findDescendantById("preview-container") as BoxRenderable | undefined
  if (!previewContainer) return

  const children = previewContainer.getChildren()
  for (const child of children) {
    if (child.id?.startsWith("preview-content-")) {
      previewContainer.remove(child.id)
    }
  }

  const titleText = renderer?.root.findDescendantById("preview-title") as TextRenderable | undefined
  const descText = renderer?.root.findDescendantById("preview-desc") as TextRenderable | undefined

  if (!selectedComponent) {
    if (titleText) titleText.content = "Select a Component"
    if (descText) descText.content = "Choose from the list to see the demo"
    return
  }

  if (titleText) titleText.content = selectedComponent.name
  if (descText) descText.content = selectedComponent.description

  try {
    const demoContent = selectedComponent.demo(renderer!)
    demoContent.id = `preview-content-${selectedComponent.name}`
    previewContainer.add(demoContent)
  } catch (error) {
    console.error(`Error rendering demo for ${selectedComponent.name}:`, error)
    const errorText = new TextRenderable(renderer!, {
      id: `preview-content-error-${selectedComponent.name}`,
      content: `Error loading demo: ${error instanceof Error ? error.message : String(error)}`,
      fg: "#EF4444",
    })
    previewContainer.add(errorText)
  }
}

function scrollUp() {
  const filteredComponents = getFilteredComponents(searchQuery)
  const maxScrollOffset = Math.max(0, filteredComponents.length - MAX_VISIBLE)
  
  if (scrollOffset > 0) {
    scrollOffset = Math.max(0, scrollOffset - 1)
    renderComponentList()
  }
}

function scrollDown() {
  const filteredComponents = getFilteredComponents(searchQuery)
  const maxScrollOffset = Math.max(0, filteredComponents.length - MAX_VISIBLE)
  
  if (scrollOffset < maxScrollOffset) {
    scrollOffset = Math.min(maxScrollOffset, scrollOffset + 1)
    renderComponentList()
  }
}

function selectPrevious() {
  const filteredComponents = getFilteredComponents(searchQuery)
  if (filteredComponents.length === 0) return

  const currentIndex = filteredComponents.findIndex((c) => c.name === selectedComponent?.name)
  let newIndex: number

  if (currentIndex === -1) {
    newIndex = 0
  } else {
    newIndex = Math.max(0, currentIndex - 1)
  }

  selectedComponent = filteredComponents[newIndex]
  
  const newIndexInFiltered = filteredComponents.findIndex((c) => c.name === selectedComponent!.name)
  if (newIndexInFiltered < scrollOffset) {
    scrollOffset = newIndexInFiltered
  }
  
  renderComponentList()
  renderPreview()
}

function selectNext() {
  const filteredComponents = getFilteredComponents(searchQuery)
  if (filteredComponents.length === 0) return

  const currentIndex = filteredComponents.findIndex((c) => c.name === selectedComponent?.name)
  let newIndex: number

  if (currentIndex === -1) {
    newIndex = 0
  } else {
    newIndex = Math.min(filteredComponents.length - 1, currentIndex + 1)
  }

  selectedComponent = filteredComponents[newIndex]
  
  const newIndexInFiltered = filteredComponents.findIndex((c) => c.name === selectedComponent!.name)
  const maxScrollOffset = Math.max(0, filteredComponents.length - MAX_VISIBLE)
  
  if (newIndexInFiltered >= scrollOffset + MAX_VISIBLE) {
    scrollOffset = Math.min(maxScrollOffset, newIndexInFiltered - MAX_VISIBLE + 1)
  }
  
  renderComponentList()
  renderPreview()
}

function isAnyPreviewInputFocused(): boolean {
  const previewContainer = renderer?.root.findDescendantById("preview-container") as BoxRenderable | undefined
  if (!previewContainer) return false

  // Recursively check all descendants for focused inputs or selects
  function checkDescendants(container: BoxRenderable): boolean {
    const children = container.getChildren()
    for (const child of children) {
      if ((child instanceof InputRenderable || child instanceof SelectRenderable) && child.focused) {
        return true
      }
      if (child instanceof BoxRenderable) {
        if (checkDescendants(child)) {
          return true
        }
      }
    }
    return false
  }

  return checkDescendants(previewContainer)
}

export async function run() {
  renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 60,
  })

  renderer.setBackgroundColor("#0F172A")

  const mainContainer = new BoxRenderable(renderer, {
    id: "main-container",
    padding: 1,
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
  })
  renderer.root.add(mainContainer)

  const header = new BoxRenderable(renderer, {
    id: "header",
    height: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  })
  mainContainer.add(header)

  const headerText = new TextRenderable(renderer, {
    id: "header-text",
    content: "TUI Storybook",
    fg: "#38BDF8",
  })
  header.add(headerText)

  const contentRow = new BoxRenderable(renderer, {
    id: "content-row",
    flexDirection: "row",
    flexGrow: 1,
    flexShrink: 1,
  })
  mainContainer.add(contentRow)

  const leftPanel = new BoxRenderable(renderer, {
    id: "left-panel",
    width: 40,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "column",
    border: true,
    borderStyle: "single",
    borderColor: "#334155",
    marginRight: 1,
    padding: 1,
  })
  contentRow.add(leftPanel)

  const searchContainer = new BoxRenderable(renderer, {
    id: "search-container",
    flexDirection: "column",
    marginBottom: 1,
  })
  leftPanel.add(searchContainer)

  const searchLabel = new TextRenderable(renderer, {
    id: "search-label",
    content: "Search:",
    fg: "#94A3B8",
    marginBottom: 0.5,
  })
  searchContainer.add(searchLabel)

  const searchInput = new Input(renderer, {
    id: "search-input",
    placeholder: "Filter components...",
    width: 36,
  })
  searchInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    searchQuery = value
    scrollOffset = 0
    renderComponentList()
  })
  searchContainer.add(searchInput)

  const divider = new BoxRenderable(renderer, {
    id: "divider",
    height: 1,
    marginBottom: 1,
  })
  const dividerText = new TextRenderable(renderer, {
    content: "─".repeat(38),
    fg: "#334155",
  })
  divider.add(dividerText)
  leftPanel.add(divider)

  const componentListContainer = new BoxRenderable(renderer, {
    id: "component-list",
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
    overflow: "hidden",
    onMouseScroll: (event: MouseEvent) => {
      if (event.scroll) {
        const { direction, delta } = event.scroll
        const filteredComponents = getFilteredComponents(searchQuery)

        if (filteredComponents.length === 0) return

        if (direction === "up") {
          if (selectedComponent === null) {
            selectedComponent = filteredComponents[0]
          } else {
            const currentIndex = filteredComponents.findIndex((c) => c.name === selectedComponent?.name)
            if (currentIndex < filteredComponents.length - 1) {
              const newIndex = Math.min(filteredComponents.length - 1, currentIndex + delta)
              selectedComponent = filteredComponents[newIndex]
              if (newIndex >= scrollOffset + MAX_VISIBLE) {
                const maxScrollOffset = Math.max(0, filteredComponents.length - MAX_VISIBLE)
                scrollOffset = Math.min(maxScrollOffset, newIndex - MAX_VISIBLE + 1)
              }
            }
          }
        } else if (direction === "down") {
          if (selectedComponent === null) {
            selectedComponent = filteredComponents[0]
          } else {
            const currentIndex = filteredComponents.findIndex((c) => c.name === selectedComponent?.name)
            if (currentIndex > 0) {
              const newIndex = Math.max(0, currentIndex - delta)
              selectedComponent = filteredComponents[newIndex]
              if (newIndex < scrollOffset) {
                scrollOffset = newIndex
              }
            }
          }
        }

        renderComponentList()
        renderPreview()
      }
    },
  })
  leftPanel.add(componentListContainer)

  const rightPanel = new BoxRenderable(renderer, {
    id: "right-panel",
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
    border: true,
    borderStyle: "single",
    borderColor: "#334155",
    padding: 2,
    alignItems: "center",
  })
  contentRow.add(rightPanel)

  const previewHeader = new BoxRenderable(renderer, {
    id: "preview-header",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 2,
  })
  rightPanel.add(previewHeader)

  const previewTitle = new TextRenderable(renderer, {
    id: "preview-title",
    content: "Select a Component",
    fg: "#38BDF8",
  })
  previewHeader.add(previewTitle)

  const previewDesc = new TextRenderable(renderer, {
    id: "preview-desc",
    content: "Choose from the list to see the demo",
    fg: "#64748B",
  })
  previewHeader.add(previewDesc)

  const previewContainer = new BoxRenderable(renderer, {
    id: "preview-container",
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  })
  rightPanel.add(previewContainer)

  renderer.on("resize", () => {
    updateMaxVisible()
  })

  renderer.on("keydown", (key: any) => {
    // Update search query in real-time when typing in search input
    if (searchInput.focused) {
      // Use setTimeout to allow the input to update its value first
      setTimeout(() => {
        const newQuery = searchInput.value || ""
        if (newQuery !== searchQuery) {
          searchQuery = newQuery
          scrollOffset = 0
          // Reset selection if current selection is not in filtered results
          const filteredComponents = getFilteredComponents(searchQuery)
          if (selectedComponent && !filteredComponents.find(c => c.name === selectedComponent?.name)) {
            selectedComponent = filteredComponents.length > 0 ? filteredComponents[0] : null
            renderPreview()
          }
          renderComponentList()
        }
      }, 0)
      return
    }

    // Don't intercept keys if any preview input is focused
    const previewInputFocused = isAnyPreviewInputFocused()
    if (previewInputFocused) {
      return
    }

    if (key.name === "up") {
      selectPrevious()
    } else if (key.name === "down") {
      selectNext()
    } else if (key.name === "pageup") {
      scrollUp()
      scrollUp()
      scrollUp()
      scrollUp()
      scrollUp()
    } else if (key.name === "pagedown") {
      scrollDown()
      scrollDown()
      scrollDown()
      scrollDown()
      scrollDown()
    }
  })

  renderer.start()

  await new Promise((resolve) => setTimeout(resolve, 100))

  const allComponents = getAllComponents()
  if (allComponents.length > 0) {
    selectedComponent = allComponents[0]
  }

  updateMaxVisible()
  renderComponentList()
  renderPreview()

  searchInput.focus()
}

run()
