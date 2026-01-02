import { createCliRenderer, BoxRenderable, TextRenderable, InputRenderable, InputRenderableEvents, type CliRenderer, type KeyEvent, type MouseEvent, RGBA } from "@opentui/core"
import { Input } from "./src/components/input"
import { Dialog } from "./src/components/dialog.js"
import { EditDialog } from "./src/components/edit-dialog.js"
import { Button } from "./src/components/button.js"
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

setupErrorHandlers("Todo Demo")

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

let renderer: CliRenderer | null = null
let todos: TodoItem[] = [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Complete project", completed: true },
  { id: 3, text: "Read documentation", completed: false },
  { id: 4, text: "Exercise daily", completed: false },
  { id: 5, text: "Call mom", completed: false },
  { id: 6, text: "Review pull requests", completed: false },
  { id: 7, text: "Update dependencies", completed: true },
  { id: 8, text: "Write unit tests", completed: false },
  { id: 9, text: "Clean up codebase", completed: false },
  { id: 10, text: "Deploy to production", completed: false },
  { id: 11, text: "Check email", completed: true },
  { id: 12, text: "Schedule meeting", completed: false },
  { id: 13, text: "Backup data", completed: false },
  { id: 14, text: "Update documentation", completed: false },
  { id: 15, text: "Fix critical bugs", completed: true },
  { id: 16, text: "Research new technologies", completed: false },
  { id: 17, text: "Optimize database queries", completed: false },
  { id: 18, text: "Set up monitoring", completed: true },
  { id: 19, text: "Create presentation", completed: false },
  { id: 20, text: "Attend team standup", completed: true },
  { id: 21, text: "Code review", completed: false },
  { id: 22, text: "Refactor legacy code", completed: false },
  { id: 23, text: "Write API documentation", completed: false },
  { id: 24, text: "Performance testing", completed: false },
  { id: 25, text: "Security audit", completed: true },
  { id: 26, text: "User testing", completed: false },
  { id: 27, text: "Bug triage", completed: false },
  { id: 28, text: "Sprint planning", completed: true },
  { id: 29, text: "Mentor junior dev", completed: false },
  { id: 30, text: "Learn new framework", completed: false },
  { id: 31, text: "Update CI/CD pipeline", completed: false },
  { id: 32, text: "Prepare release notes", completed: false },
  { id: 33, text: "Customer support", completed: true },
  { id: 34, text: "Network troubleshooting", completed: false },
  { id: 35, text: "Data migration", completed: false },
  { id: 36, text: "Design system architecture", completed: false },
  { id: 37, text: "Implement caching layer", completed: true },
  { id: 38, text: "Set up SSL certificates", completed: false },
  { id: 39, text: "Configure load balancer", completed: false },
  { id: 40, text: "Create wireframes", completed: false },
  { id: 41, text: "Conduct user interviews", completed: true },
  { id: 42, text: "A/B test new features", completed: false },
  { id: 43, text: "Analyze usage metrics", completed: false },
  { id: 44, text: "Optimize images", completed: false },
  { id: 45, text: "Implement lazy loading", completed: true },
  { id: 46, text: "Reduce bundle size", completed: false },
  { id: 47, text: "Fix accessibility issues", completed: false },
  { id: 48, text: "Mobile responsive design", completed: false },
  { id: 49, text: "Cross-browser testing", completed: true },
  { id: 50, text: "Implement dark mode", completed: false },
  { id: 51, text: "Create error boundaries", completed: false },
  { id: 52, text: "Add unit test coverage", completed: false },
  { id: 53, text: "Set up e2e testing", completed: false },
  { id: 54, text: "Profile performance", completed: true },
  { id: 55, text: "Reduce memory leaks", completed: false },
  { id: 56, text: "Implement pagination", completed: false },
  { id: 57, text: "Add search functionality", completed: false },
  { id: 58, text: "Implement filters", completed: false },
  { id: 59, text: "Create dashboard widgets", completed: true },
  { id: 60, text: "Add export to CSV", completed: false },
  { id: 61, text: "Implement undo/redo", completed: false },
  { id: 62, text: "Add keyboard shortcuts", completed: false },
  { id: 63, text: "Create onboarding flow", completed: false },
  { id: 64, text: "Write blog post", completed: true },
  { id: 65, text: "Record demo video", completed: false },
  { id: 66, text: "Create tutorial series", completed: false },
  { id: 67, text: "Host webinar", completed: false },
  { id: 68, text: "Attend conference", completed: true },
  { id: 69, text: "Submit talk proposal", completed: false },
  { id: 70, text: "Organize hackathon", completed: false },
  { id: 71, text: "Code review session", completed: false },
  { id: 72, text: "Pair programming", completed: false },
  { id: 73, text: "Knowledge sharing", completed: true },
  { id: 74, text: "Technical writing", completed: false },
  { id: 75, text: "Open source contribution", completed: false },
]

let selectedTodoId: number | null = null
let scrollOffset = 0
let drawerOpen = false
let confirmDialogOpen = false
let todoToDelete: number | null = null
let confirmDialog: Dialog | null = null
let editDialogOpen = false
let todoToEdit: number | null = null
let editDialog: EditDialog | null = null

let MAX_VISIBLE = 10

function calculateMaxVisible(): number {
  const todoListContainer = renderer?.root.findDescendantById("todo-list") as BoxRenderable | undefined
  if (!todoListContainer) return 10
  
  const availableHeight = todoListContainer.height
  const todoItemHeight = 3
  
  const calculatedMax = Math.floor(availableHeight / todoItemHeight)
  return Math.max(3, calculatedMax)
}

function updateMaxVisible() {
  const newMaxVisible = calculateMaxVisible()
  if (newMaxVisible !== MAX_VISIBLE) {
    MAX_VISIBLE = newMaxVisible
    const maxScrollOffset = Math.max(0, todos.length - MAX_VISIBLE)
    scrollOffset = Math.min(scrollOffset, maxScrollOffset)
    renderTodos()
  }
}

function clearTodoList() {
  const todoListContainer = renderer?.root.findDescendantById("todo-list") as BoxRenderable | undefined
  if (!todoListContainer) return

  const children = todoListContainer.getChildren()
  for (const child of children) {
    if (child.id?.startsWith("todo-") || child.id?.startsWith("spacer-")) {
      todoListContainer.remove(child.id)
    }
  }
}

function renderTodos() {
  clearTodoList()

  const todoListContainer = renderer?.root.findDescendantById("todo-list") as BoxRenderable | undefined
  if (!todoListContainer) return

  const visibleTodos = todos.slice(scrollOffset, scrollOffset + MAX_VISIBLE)

  visibleTodos.forEach((todo) => {
    const isSelected = todo.id === selectedTodoId

    const bgColor = isSelected ? RGBA.fromInts(30, 58, 95, 255) : RGBA.fromInts(15, 23, 42, 255)

    const todoItem = new BoxRenderable(renderer!, {
      id: `todo-${todo.id}`,
      height: 3,
      flexGrow: 0,
      flexShrink: 0,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: bgColor,
      position: "relative",
      onMouseUp: (event: MouseEvent) => {
        if (event.button === 0) {
          if (selectedTodoId === todo.id) {
            selectedTodoId = null
          } else {
            selectedTodoId = todo.id
          }
          renderTodos()
        }
      },
    })

    const checkboxText = todo.completed ? "[✓]" : "[ ]"
    const fgColor = todo.completed ? RGBA.fromInts(34, 197, 94, 255) : RGBA.fromInts(148, 163, 184, 255)
    const textFgColor = todo.completed ? RGBA.fromInts(100, 116, 139, 255) : RGBA.fromInts(226, 232, 240, 255)

    const checkbox = new TextRenderable(renderer!, {
      id: `checkbox-${todo.id}`,
      content: checkboxText,
      fg: fgColor,
      onMouseUp: (event: MouseEvent) => {
        if (event.button === 0) {
          event.stopPropagation()
          const clickedTodo = todos.find((t) => t.id === todo.id)
          if (clickedTodo) {
            clickedTodo.completed = !clickedTodo.completed
            renderTodos()
          }
        }
      },
    })
    todoItem.add(checkbox)

    const todoTextContent = todo.completed ? `~~${todo.text}~~` : todo.text
    const todoText = new TextRenderable(renderer!, {
      id: `text-${todo.id}`,
      content: todoTextContent,
      fg: textFgColor,
      width: 35,
    })
    todoItem.add(todoText)

    const actionsBox = new BoxRenderable(renderer!, {
      id: `actions-box-${todo.id}`,
      flexDirection: "row",
      alignItems: "center",
    })

    const editText = new TextRenderable(renderer!, {
      id: `edit-${todo.id}`,
      content: "[e]dit",
      fg: RGBA.fromInts(250, 204, 21, 255),
      onMouseUp: (event: MouseEvent) => {
        if (event.button === 0) {
          event.stopPropagation()
          selectedTodoId = todo.id
          openEditDialog(todo.id)
        }
      },
    })
    actionsBox.add(editText)

    const spaceText = new TextRenderable(renderer!, {
      id: `space-${todo.id}`,
      content: " ",
      fg: RGBA.fromInts(100, 116, 139, 255),
    })
    actionsBox.add(spaceText)

    const delText = new TextRenderable(renderer!, {
      id: `del-${todo.id}`,
      content: "[d]el",
      fg: RGBA.fromInts(239, 68, 68, 255),
      onMouseUp: (event: MouseEvent) => {
        if (event.button === 0) {
          event.stopPropagation()
          selectedTodoId = todo.id
          openConfirmDialog(todo.id)
        }
      },
    })
    actionsBox.add(delText)

    todoItem.add(actionsBox)

    todoListContainer.add(todoItem)
  })

  const emptySpace = MAX_VISIBLE - visibleTodos.length
  for (let i = 0; i < emptySpace; i++) {
    const spacer = new BoxRenderable(renderer!, {
      id: `spacer-${i}`,
      height: 3,
      flexGrow: 0,
    })
    todoListContainer.add(spacer)
  }

  renderDrawer()
  renderInstructions()
}

function renderDrawer() {
  const drawer = renderer?.root.findDescendantById("drawer") as BoxRenderable | undefined
  if (!drawer) return

  drawer.visible = drawerOpen

  if (drawerOpen) {
    const titleText = drawer.findDescendantById("drawer-title") as TextRenderable | undefined
    if (titleText) {
      titleText.content = "INSTRUCTIONS [?]"
    }

    const instructionsBox = drawer.findDescendantById("instructions-box") as BoxRenderable | undefined
    if (instructionsBox) {
      const instructionsText = instructionsBox.findDescendantById("instructions-text") as TextRenderable | undefined
      if (instructionsText) {
        instructionsText.content = `Key Actions:
 • Press 'a' to add new todo
 • Press 'e' to edit selected todo
 • Press 'd' to delete selected todo (confirms)
 • Press 'Enter' to toggle completion
 • Press 'j/k' or ↑/↓ to navigate
 • Press '?' to toggle this drawer
 • Press 'q' to quit app

 Mouse Actions:
 • Click todo item to select/deselect
 • Click checkbox to toggle completion
 • Click [e]dit to edit selected todo
 • Click [d]el to delete with confirmation
 • Scroll wheel to navigate list

 Add Todo Actions:
 • Click on input field to focus
 • Type text and press Enter or click [Add] button
 • Input field keeps focus after adding

 Dialog Actions:
 • Press Enter to confirm action
 • Press Esc to cancel dialog`
      }
    }

    const closeText = drawer.findDescendantById("close-text") as TextRenderable | undefined
    if (closeText) {
      closeText.content = "[?] Close"
    }
  }
}

function renderInstructions() {
  const instructions = renderer?.root.findDescendantById("instructions") as TextRenderable | undefined
  if (!instructions) return

  if (confirmDialogOpen) {
    instructions.content = "Delete Confirmation | Enter: Delete | Esc: Cancel"
  } else if (editDialogOpen) {
    instructions.content = "Edit Todo | Enter: Save | Esc: Cancel"
  } else if (!drawerOpen) {
    const selectedTodo = selectedTodoId ? todos.find((t) => t.id === selectedTodoId) : null
    const statusText = selectedTodo ? (selectedTodo.completed ? "✓" : "○") : ""
    instructions.content = `Selected: ${selectedTodo ? `#${selectedTodo.id} ${statusText}` : "None"} | Click todo items to interact | Press '?' for help`
  } else {
    instructions.content = "Drawer Open | Click to close"
  }
}

function toggleDrawer() {
  drawerOpen = !drawerOpen

  const mainContainer = renderer?.root.findDescendantById("main-container") as BoxRenderable | undefined
  const drawer = renderer?.root.findDescendantById("drawer") as BoxRenderable | undefined

  if (mainContainer && drawer) {
    if (drawerOpen) {
      mainContainer.width = 55
    } else {
      mainContainer.width = "auto"
    }
  }

  renderDrawer()
  renderInstructions()
  renderer?.requestRender()
}

function addTodo() {
  const inputField = renderer?.root.findDescendantById("input-field") as InputRenderable | undefined
  const addBtn = renderer?.root.findDescendantById("add-btn") as Button | undefined
  if (!inputField) return

  const text = inputField.value.trim()
  if (text) {
    const newId = Math.max(0, ...todos.map((t) => t.id)) + 1
    todos.push({ id: newId, text, completed: false })
    inputField.value = ""
    selectedTodoId = newId
    renderTodos()
    if (addBtn) {
      addBtn.setDisabled(true)
    }
  }
}

function editTodo() {
  if (!selectedTodoId) return
  openEditDialog(selectedTodoId)
}

function deleteTodo() {
  if (!selectedTodoId) return

  const index = todos.findIndex((t) => t.id === selectedTodoId)
  if (index !== -1) {
    const newSelectedId = todos[index + 1]?.id || todos[index - 1]?.id || null
    todos.splice(index, 1)
    selectedTodoId = newSelectedId

    if (selectedTodoId && scrollOffset > 0) {
      const selectedIndex = todos.findIndex((t) => t.id === selectedTodoId)
      if (selectedIndex < scrollOffset) {
        scrollOffset = Math.max(0, selectedIndex)
      }
    }
    renderTodos()
  }
}

function openConfirmDialog(todoId: number) {
  if (!renderer) return

  const todo = todos.find((t) => t.id === todoId)
  if (!todo) return

  todoToDelete = todoId
  confirmDialogOpen = true

  if (!confirmDialog) {
    confirmDialog = new Dialog(renderer, {
      id: "confirm-dialog",
      title: "Delete Todo",
      message: `Delete "${todo.text}"?`,
      confirmText: "[Delete]",
      cancelText: "[Cancel]",
      width: 45,
      zIndex: 1000,
    })
  } else {
    confirmDialog.setMessage(`Delete "${todo.text}"?`)
  }

  confirmDialog.show(
    () => {
      const todoIdToDelete = todoToDelete
      closeConfirmDialog()
      if (todoIdToDelete !== null) {
        selectedTodoId = todoIdToDelete
        deleteTodo()
      }
    },
    () => {
      closeConfirmDialog()
    }
  )

  renderInstructions()
  renderer.requestRender()
}

function closeConfirmDialog() {
  if (confirmDialog) {
    confirmDialog.hide()
  }
  confirmDialogOpen = false
  todoToDelete = null
  renderInstructions()
  renderer?.requestRender()
}

function openEditDialog(todoId: number) {
  if (!renderer) return

  const todo = todos.find((t) => t.id === todoId)
  if (!todo) return

  todoToEdit = todoId
  editDialogOpen = true

  if (!editDialog) {
    editDialog = new EditDialog(renderer, {
      id: "edit-dialog",
      title: "Edit Todo",
      label: "Todo Text:",
      confirmText: "[Save]",
      cancelText: "[Cancel]",
      width: 45,
      zIndex: 1000,
      placeholder: "Enter todo text...",
    })
  }

  editDialog.show(
    () => {
      const todoIdToEdit = todoToEdit
      closeEditDialog()
      if (todoIdToEdit !== null) {
        const todo = todos.find((t) => t.id === todoIdToEdit)
        if (todo) {
          const newValue = editDialog?.getValue().trim()
          if (newValue) {
            todo.text = newValue
            renderTodos()
          }
        }
      }
    },
    () => {
      closeEditDialog()
    },
    todo.text
  )

  renderInstructions()
  renderer.requestRender()
}

function closeEditDialog() {
  if (editDialog) {
    editDialog.hide()
  }
  editDialogOpen = false
  todoToEdit = null
  renderInstructions()
  renderer?.requestRender()
}

function handleDialogKeyPress(key: KeyEvent) {
  if (!confirmDialogOpen) return

  if (key.name === "return" || key.name === "enter") {
    const todoIdToDelete = todoToDelete
    closeConfirmDialog()
    if (todoIdToDelete !== null) {
      selectedTodoId = todoIdToDelete
      deleteTodo()
    }
  } else if (key.name === "escape") {
    closeConfirmDialog()
  }
}

function handleEditDialogKeyPress(key: KeyEvent) {
  if (!editDialogOpen) return

  if (key.name === "return" || key.name === "enter") {
    const todoIdToEdit = todoToEdit
    closeEditDialog()
    if (todoIdToEdit !== null) {
      const todo = todos.find((t) => t.id === todoIdToEdit)
      if (todo) {
        const newValue = editDialog?.getValue().trim()
        if (newValue) {
          todo.text = newValue
          renderTodos()
        }
      }
    }
  } else if (key.name === "escape") {
    closeEditDialog()
  }
}

function toggleComplete() {
  if (!selectedTodoId) return

  const todo = todos.find((t) => t.id === selectedTodoId)
  if (todo) {
    todo.completed = !todo.completed
    renderTodos()
  }
}

function selectPrevious() {
  if (todos.length === 0) return

  if (selectedTodoId === null) {
    selectedTodoId = todos[0].id
  } else {
    const index = todos.findIndex((t) => t.id === selectedTodoId)
    if (index > 0) {
      selectedTodoId = todos[index - 1].id
      if (index - 1 < scrollOffset) {
        scrollOffset = index - 1
  }

  updateMaxVisible()
    renderTodos()
  }

withErrorHandling(run, "Todo Demo")
