import { type CliRenderer, InputRenderable, type InputRenderableEvents } from "@opentui/core"

export interface InputProps {
  id?: string
  width?: number
  height?: number
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
  placeholder?: string
  placeholderColor?: string
  backgroundColor?: string
  textColor?: string
  cursorColor?: string
  value?: string
  maxLength?: number
  border?: boolean
  borderStyle?: "single" | "double"
  borderColor?: string
}

export class Input extends InputRenderable {
  constructor(renderer: CliRenderer, props: InputProps = {}) {
    super(renderer, {
      id: props.id,
      width: props.width || 40,
      height: props.height || 3,
      position: props.position || "relative",
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex,
      placeholder: props.placeholder,
      placeholderColor: props.placeholderColor || "#64748B",
      backgroundColor: props.backgroundColor || "#0F172A",
      textColor: props.textColor || "#F8FAFC",
      cursorColor: props.cursorColor || "#FACC15",
      value: props.value || "",
      maxLength: props.maxLength,
      border: props.border !== undefined ? props.border : true,
      borderStyle: props.borderStyle || "single",
      borderColor: props.borderColor || "#475569",
    })

    this.onMouseDown = (event: any) => {
      if (event.button === 0) {
        event.stopPropagation()
        this.focus()
        
        const localX = event.x - this.x
        const clampedX = Math.max(0, Math.min(localX, this.width - 1))
        const newCursorPosition = Math.min(clampedX, this.value.length)
        this.cursorPosition = newCursorPosition
      }
    }

    this.onMouseScroll = (event: any) => {
      if (!this.focused) return
      
      event.stopPropagation()
      
      if (event.scroll) {
        const direction = event.scroll.direction
        if (direction === "left") {
          this.cursorPosition = Math.max(0, this.cursorPosition - 1)
          this.ctx.requestRender()
        } else if (direction === "right") {
          this.cursorPosition = Math.min(this.value.length, this.cursorPosition + 1)
          this.ctx.requestRender()
        }
      }
    }
  }
}

export interface TextFieldProps extends InputProps {
  id: string
  placeholder?: string
}

export class TextField extends Input {
  constructor(renderer: CliRenderer, props: TextFieldProps) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter text...",
    })
  }
}

export interface PasswordFieldProps extends InputProps {
  id: string
  placeholder?: string
}

export class PasswordField extends Input {
  constructor(renderer: CliRenderer, props: PasswordFieldProps) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter password...",
    })
  }

  get displayValue(): string {
    return "*".repeat(this.value.length)
  }
}

export interface TextAreaProps extends InputProps {
  id: string
  width?: number
  height?: number
  placeholder?: string
}

export class TextArea extends Input {
  constructor(renderer: CliRenderer, props: TextAreaProps) {
    super(renderer, {
      ...props,
      width: props.width || 60,
      height: props.height || 5,
      placeholder: props.placeholder || "Enter your message...",
    })
  }
}

export interface EmailFieldProps extends InputProps {
  id: string
  placeholder?: string
}

export class EmailField extends Input {
  constructor(renderer: CliRenderer, props: EmailFieldProps) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter email...",
    })
  }

  validate(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.value)
  }
}

export interface NumberFieldProps extends InputProps {
  id: string
  placeholder?: string
  min?: number
  max?: number
}

export class NumberField extends Input {
  private min?: number
  private max?: number

  constructor(renderer: CliRenderer, props: NumberFieldProps) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter number...",
    })
    this.min = props.min
    this.max = props.max
  }

  getNumberValue(): number {
    return parseFloat(this.value) || 0
  }

  validate(): boolean {
    const num = this.getNumberValue()
    if (this.min !== undefined && num < this.min) return false
    if (this.max !== undefined && num > this.max) return false
    return true
  }
}

export type InputEvents = InputRenderableEvents
