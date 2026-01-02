import { type CliRenderer, BoxRenderable, TextRenderable, type MouseEvent } from "@opentui/core"

export interface ButtonProps {
  id?: string
  label: string
  width?: number
  height?: number
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
  backgroundColor?: string
  textColor?: string
  hoverBackgroundColor?: string
  disabled?: boolean
  onClick?: () => void
}

export class Button extends BoxRenderable {
  private renderer: CliRenderer
  private label: string
  private onClickHandler?: () => void
  private textElement?: TextRenderable
  private isHovered = false
  private defaultBgColor: string
  private hoverBgColor: string
  private disabled: boolean
  private originalBgColor: string
  private originalBorderColor: string

  constructor(renderer: CliRenderer, props: ButtonProps) {
    const disabled = props.disabled || false
    const originalBgColor = props.backgroundColor || "#3B82F6"
    const originalBorderColor = "#60A5FA"
    const bgColor = disabled ? "#334155" : originalBgColor
    const hoverBg = props.hoverBackgroundColor || "#2563EB"

    super(renderer, {
      id: props.id,
      width: props.width || 12,
      height: props.height || 3,
      position: props.position || "relative",
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex,
      backgroundColor: bgColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      border: true,
      borderStyle: "single",
      borderColor: disabled ? "#475569" : originalBorderColor,
    })

    this.renderer = renderer
    this.label = props.label
    this.onClickHandler = props.onClick
    this.defaultBgColor = bgColor
    this.hoverBgColor = hoverBg
    this.disabled = disabled
    this.originalBgColor = originalBgColor
    this.originalBorderColor = originalBorderColor

    this.textElement = new TextRenderable(renderer, {
      content: props.label,
      fg: this.disabled ? "#94A3B8" : "#FFFFFF",
    })

    this.add(this.textElement)
    this.setupMouseEvents()
  }

  private setupMouseEvents(): void {
    // Use onMouseUp for click handling (works better with nested containers)
    this.onMouseUp = (event: MouseEvent) => {
      if (event.button === 0 && this.onClickHandler && !this.disabled) {
        this.onClickHandler()
      }
    }

    // Keep global mousemove listener for hover effects
    this.renderer.on("mousemove", (x: number, y: number) => {
      if (this.containsPoint(x, y)) {
        if (!this.isHovered) {
          this.isHovered = true
          this.updateHoverState()
        }
      } else {
        if (this.isHovered) {
          this.isHovered = false
          this.updateHoverState()
        }
      }
    })
  }

  private containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    )
  }

  private updateHoverState(): void {
    this.backgroundColor = this.isHovered ? this.hoverBgColor : this.defaultBgColor
    this.renderer.requestRender()
  }

  setLabel(label: string): void {
    this.label = label
    if (this.textElement) {
      this.textElement.content = label
    }
  }

  getLabel(): string {
    return this.label
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
    if (disabled) {
      this.defaultBgColor = "#334155"
      this.backgroundColor = "#334155"
      this.borderColor = "#475569"
      if (this.textElement) {
        this.textElement.fg = "#94A3B8"
      }
    } else {
      this.defaultBgColor = this.originalBgColor
      this.backgroundColor = this.isHovered ? this.hoverBgColor : this.originalBgColor
      this.borderColor = this.originalBorderColor
      if (this.textElement) {
        this.textElement.fg = "#FFFFFF"
      }
    }
    this.renderer.requestRender()
  }

  isDisabled(): boolean {
    return this.disabled
  }
}

export interface IconButtonProps extends Omit<ButtonProps, "label"> {
  icon: string
}

export class IconButton extends Button {
  constructor(renderer: CliRenderer, props: IconButtonProps) {
    super(renderer, {
      id: props.id,
      label: props.icon,
      width: props.width || 3,
      height: props.height,
      backgroundColor: props.backgroundColor,
      textColor: props.textColor,
      hoverBackgroundColor: props.hoverBackgroundColor,
      disabled: props.disabled,
      onClick: props.onClick,
      position: props.position,
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex
    })
  }
}
