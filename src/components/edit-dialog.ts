import { type CliRenderer, BoxRenderable, TextRenderable, InputRenderable } from "@opentui/core"

export interface EditDialogProps {
  id?: string
  title: string
  label?: string
  confirmText?: string
  cancelText?: string
  width?: number
  zIndex?: number
  placeholder?: string
}

export class EditDialog extends BoxRenderable {
  private renderer: CliRenderer
  private onConfirm?: () => void
  private onCancel?: () => void
  private inputField?: InputRenderable

  constructor(renderer: CliRenderer, props: EditDialogProps) {
    super(renderer, {
      id: props.id || "edit-dialog",
      width: props.width || 45,
      height: 10,
      position: "absolute",
      backgroundColor: "#1E293B",
      border: true,
      borderStyle: "double",
      borderColor: "#FACC15",
      flexDirection: "column",
      alignItems: "stretch",
      zIndex: props.zIndex || 1000,
    })

    this.renderer = renderer
    this.createContent(props)
  }

  private createContent(props: EditDialogProps): void {
    const header = new BoxRenderable(this.renderer, {
      id: "edit-dialog-header",
      height: 3,
      backgroundColor: "#FACC15",
      flexDirection: "row",
      alignItems: "center",
      flexGrow: 0,
    })

    const title = new TextRenderable(this.renderer, {
      id: "edit-dialog-title",
      content: props.title,
      fg: "#1E293B",
    })
    header.add(title)
    this.add(header)

    const body = new BoxRenderable(this.renderer, {
      id: "edit-dialog-body",
      flexGrow: 1,
      flexDirection: "column",
      alignItems: "stretch",
      padding: 2,
    })

    if (props.label) {
      const labelText = new TextRenderable(this.renderer, {
        id: "edit-dialog-label",
        content: props.label,
        fg: "#94A3B8",
      })
      body.add(labelText)
    }

    this.inputField = new InputRenderable(this.renderer, {
      id: "edit-dialog-input",
      width: props.width ? props.width - 6 : 39,
      height: 3,
      placeholder: props.placeholder || "Enter text...",
      placeholderColor: "#64748B",
      backgroundColor: "#0F172A",
      textColor: "#F8FAFC",
      cursorColor: "#FACC15",
    })
    body.add(this.inputField)

    const buttonsBox = new BoxRenderable(this.renderer, {
      id: "edit-dialog-buttons",
      height: 3,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      flexGrow: 0,
      marginTop: 1,
    })

    const cancelBtn = new BoxRenderable(this.renderer, {
      id: "edit-dialog-cancel-btn",
      width: 10,
      height: 1,
      backgroundColor: "#475569",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      border: true,
      borderStyle: "single",
      borderColor: "#64748B",
    })

    const cancelText = new TextRenderable(this.renderer, {
      id: "edit-dialog-cancel-text",
      content: props.cancelText || "[Cancel]",
      fg: "#94A3B8",
    })
    cancelBtn.add(cancelText)
    buttonsBox.add(cancelBtn)

    const space = new TextRenderable(this.renderer, {
      id: "edit-dialog-btn-space",
      content: " ",
      width: 2,
    })
    buttonsBox.add(space)

    const confirmBtn = new BoxRenderable(this.renderer, {
      id: "edit-dialog-confirm-btn",
      width: 8,
      height: 1,
      backgroundColor: "#16A34A",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      border: true,
      borderStyle: "single",
      borderColor: "#22C55E",
    })

    const confirmText = new TextRenderable(this.renderer, {
      id: "edit-dialog-confirm-text",
      content: props.confirmText || "[Save]",
      fg: "#FFFFFF",
    })
    confirmBtn.add(confirmText)
    buttonsBox.add(confirmBtn)

    body.add(buttonsBox)
    this.add(body)

    cancelBtn.onMouseUp = (event) => {
      if (event.button === 0) {
        event.stopPropagation()
        if (this.onCancel) this.onCancel()
      }
    }

    confirmBtn.onMouseUp = (event) => {
      if (event.button === 0) {
        event.stopPropagation()
        if (this.onConfirm) this.onConfirm()
      }
    }
  }

  show(onConfirm: () => void, onCancel: () => void, initialValue?: string): void {
    this.onConfirm = onConfirm
    this.onCancel = onCancel

    if (initialValue !== undefined && this.inputField) {
      this.inputField.value = initialValue
    }

    this.visible = true

    const root = this.renderer.root
    root.add(this)

    this.centerDialog()

    if (this.inputField) {
      this.inputField.focus()
    }

    this.renderer.requestRender()
  }

  hide(): void {
    if (this.inputField && this.inputField.focused) {
      this.inputField.blur()
    }

    this.visible = false

    this.renderer.root.remove(this.id)

    this.renderer.requestRender()
  }

  private centerDialog(): void {
    const rootWidth = this.renderer.root.width
    const rootHeight = this.renderer.root.height

    this.left = Math.floor((rootWidth - this.width) / 2)
    this.top = Math.floor((rootHeight - this.height) / 2)
  }

  setValue(value: string): void {
    if (this.inputField) {
      this.inputField.value = value
      this.renderer.requestRender()
    }
  }

  getValue(): string {
    return this.inputField?.value || ""
  }

  setConfirmText(text: string): void {
    const confirmText = this.findDescendantById("edit-dialog-confirm-text") as TextRenderable
    if (confirmText) {
      confirmText.content = text
      this.renderer.requestRender()
    }
  }

  setCancelText(text: string): void {
    const cancelText = this.findDescendantById("edit-dialog-cancel-text") as TextRenderable
    if (cancelText) {
      cancelText.content = text
      this.renderer.requestRender()
    }
  }
}
