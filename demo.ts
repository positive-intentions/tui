import { createCliRenderer, type CliRenderer, type SelectOption } from "@opentui/core"
import {
  Container,
  Row,
  Column,
  Card,
  Heading,
  Paragraph,
  Label,
  Status,
  TextField,
  PasswordField,
  EmailField,
  TextArea,
  NumberField,
  Select,
  Button,
  IconButton,
} from "./src/index.js"
import { setupErrorHandlers, setRenderer, withErrorHandling } from "./src/error-handler.js"

let renderer: CliRenderer | null = null

setupErrorHandlers("TUI Demo")

const options: SelectOption[] = [
  { name: "Option 1", description: "This is option one", value: "option1" },
  { name: "Option 2", description: "This is option two", value: "option2" },
  { name: "Option 3", description: "This is option three", value: "option3" },
  { name: "Option 4", description: "This is option four", value: "option4" },
  { name: "Option 5", description: "This is option five", value: "option5" },
]

const formOptions: SelectOption[] = [
  { name: "Personal", description: "Personal account type", value: "personal" },
  { name: "Business", description: "Business account type", value: "business" },
  { name: "Enterprise", description: "Enterprise account type", value: "enterprise" },
]

export async function run() {
  renderer = await createCliRenderer({
    exitOnCtrlC: false,
    targetFps: 60,
  })
  setRenderer(renderer)

  renderer.setBackgroundColor("#0F172A")

  const mainContainer = new Container(renderer, {
    id: "main-container",
    padding: 2,
  })
  renderer.root.add(mainContainer)

  const header = new Card(renderer, {
    id: "header",
    height: 5,
    title: "TUI COMPONENT LIBRARY DEMO",
    titleAlignment: "center",
    borderColor: "#3B82F6",
  })
  mainContainer.add(header)

  const headerContent = new Heading(renderer, {
    level: 3,
    content: "Built with OpenTUI",
    position: "absolute",
    left: 2,
    top: 1,
  })
  header.add(headerContent)

  const row = new Row(renderer, {
    id: "main-row",
    flexGrow: 1,
    flexShrink: 1,
    margin: 1,
  })
  mainContainer.add(row)

  const leftColumn = new Column(renderer, {
    id: "left-column",
    width: 40,
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

  const inputCard = new Card(renderer, {
    id: "input-card",
    title: "Input Components",
    borderColor: "#22C55E",
  })
  leftColumn.add(inputCard)

  const inputColumn = new Column(renderer, {
    id: "input-column",
    padding: 1,
  })
  inputCard.add(inputColumn)

  const nameLabel = new Label(renderer, {
    content: "Name",
    position: "relative",
  })
  inputColumn.add(nameLabel)

  const nameInput = new TextField(renderer, {
    id: "name-input",
    placeholder: "Enter your name",
  })
  inputColumn.add(nameInput)

  const emailLabel = new Label(renderer, {
    content: "Email",
  })
  inputColumn.add(emailLabel)

  const emailInput = new EmailField(renderer, {
    id: "email-input",
    placeholder: "Enter your email",
  })
  inputColumn.add(emailInput)

  const passwordLabel = new Label(renderer, {
    content: "Password",
  })
  inputColumn.add(passwordLabel)

  const passwordInput = new PasswordField(renderer, {
    id: "password-input",
    placeholder: "Enter password",
  })
  inputColumn.add(passwordInput)

  const numberLabel = new Label(renderer, {
    content: "Age",
  })
  inputColumn.add(numberLabel)

  const ageInput = new NumberField(renderer, {
    id: "age-input",
    placeholder: "Enter age",
    min: 1,
    max: 120,
  })
  inputColumn.add(ageInput)

  const messageLabel = new Label(renderer, {
    content: "Message",
  })
  inputColumn.add(messageLabel)

  const messageInput = new TextArea(renderer, {
    id: "message-input",
    width: 36,
    height: 4,
    placeholder: "Enter your message",
  })
  inputColumn.add(messageInput)

  const statusCard = new Card(renderer, {
    id: "status-card",
    title: "Status Components",
    margin: 1,
    borderColor: "#F59E0B",
  })
  leftColumn.add(statusCard)

  const statusColumn = new Column(renderer, {
    id: "status-column",
    padding: 1,
  })
  statusCard.add(statusColumn)

  const successStatus = new Status(renderer, {
    id: "success-status",
    status: "success",
    content: "Operation completed successfully",
  })
  statusColumn.add(successStatus)

  const errorStatus = new Status(renderer, {
    id: "error-status",
    status: "error",
    content: "An error occurred",
  })
  statusColumn.add(errorStatus)

  const warningStatus = new Status(renderer, {
    id: "warning-status",
    status: "warning",
    content: "Please review your input",
  })
  statusColumn.add(warningStatus)

  const infoStatus = new Status(renderer, {
    id: "info-status",
    status: "info",
    content: "System is running normally",
  })
  statusColumn.add(infoStatus)

  const textCard = new Card(renderer, {
    id: "text-card",
    title: "Text Components",
    borderColor: "#8B5CF6",
  })
  rightColumn.add(textCard)

  const textColumn = new Column(renderer, {
    id: "text-column",
    padding: 1,
  })
  textCard.add(textColumn)

  const h1 = new Heading(renderer, {
    level: 1,
    content: "Heading Level 1",
  })
  textColumn.add(h1)

  const h2 = new Heading(renderer, {
    level: 2,
    content: "Heading Level 2",
  })
  textColumn.add(h2)

  const h3 = new Heading(renderer, {
    level: 3,
    content: "Heading Level 3",
  })
  textColumn.add(h3)

  const para = new Paragraph(renderer, {
    content: "This is a paragraph component. It can be used to display longer text content in your TUI application.",
  })
  textColumn.add(para)

  const selectCard = new Card(renderer, {
    id: "select-card",
    title: "Select Components",
    height: 14,
    margin: 1,
    borderColor: "#EC4899",
  })
  rightColumn.add(selectCard)

  const selectColumn = new Column(renderer, {
    id: "select-column",
    padding: 1,
  })
  selectCard.add(selectColumn)

  const selectLabel = new Label(renderer, {
    content: "Choose an option",
  })
  selectColumn.add(selectLabel)

  const selectComponent = new Select(renderer, {
    id: "demo-select",
    height: 10,
    options: options,
  })
  selectColumn.add(selectComponent)

  selectComponent.onItemSelected((index: number, option: SelectOption) => {
    console.log(`Selected: ${option.name}`)
  })

  const formSelectCard = new Card(renderer, {
    id: "form-select-card",
    title: "Form Select",
    height: 12,
    margin: 1,
    borderColor: "#06B6D4",
  })
  rightColumn.add(formSelectCard)

  const formSelectColumn = new Column(renderer, {
    id: "form-select-column",
    padding: 1,
  })
  formSelectCard.add(formSelectColumn)

  const accountTypeLabel = new Label(renderer, {
    content: "Account Type",
  })
  formSelectColumn.add(accountTypeLabel)

  const formSelect = new Select(renderer, {
    id: "form-select",
    height: 8,
    options: formOptions,
  })
  formSelectColumn.add(formSelect)

  const buttonCard = new Card(renderer, {
    id: "button-card",
    title: "Button Components",
    height: 8,
    margin: 1,
    borderColor: "#F97316",
  })
  rightColumn.add(buttonCard)

  const buttonRow = new Row(renderer, {
    id: "button-row",
    padding: 1,
    justifyContent: "space-around",
  })
  buttonCard.add(buttonRow)

  const button1 = new Button(renderer, {
    id: "button1",
    label: "Submit",
    backgroundColor: "#22C55E",
    onClick: () => {
      console.log("Submit button clicked!")
    },
  })
  buttonRow.add(button1)

  const button2 = new Button(renderer, {
    id: "button2",
    label: "Cancel",
    backgroundColor: "#EF4444",
    onClick: () => {
      console.log("Cancel button clicked!")
    },
  })
  buttonRow.add(button2)

  const button3 = new IconButton(renderer, {
    id: "button3",
    icon: "X",
    backgroundColor: "#64748B",
    onClick: () => {
      console.log("Close button clicked!")
    },
  })
  buttonRow.add(button3)

  const instructionsCard = new Card(renderer, {
    id: "instructions-card",
    height: 4,
    title: "Instructions",
    titleAlignment: "center",
    margin: 1,
    borderColor: "#64748B",
  })
  rightColumn.add(instructionsCard)

  const instructionsText = new Paragraph(renderer, {
    content: "Use Tab to navigate, Enter to submit, Ctrl+C to exit",
  })
  instructionsCard.add(instructionsText)

  renderer.start()
}

withErrorHandling(run, "TUI Demo")
