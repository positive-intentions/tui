import { BoxRenderable, TextRenderable } from "@opentui/core";
class Button extends BoxRenderable {
  renderer;
  label;
  onClickHandler;
  textElement;
  isHovered = false;
  defaultBgColor;
  hoverBgColor;
  disabled;
  originalBgColor;
  originalBorderColor;
  constructor(renderer, props) {
    const disabled = props.disabled || false;
    const originalBgColor = props.backgroundColor || "#3B82F6";
    const originalBorderColor = "#60A5FA";
    const bgColor = disabled ? "#334155" : originalBgColor;
    const hoverBg = props.hoverBackgroundColor || "#2563EB";
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
      borderColor: disabled ? "#475569" : originalBorderColor
    });
    this.renderer = renderer;
    this.label = props.label;
    this.onClickHandler = props.onClick;
    this.defaultBgColor = bgColor;
    this.hoverBgColor = hoverBg;
    this.disabled = disabled;
    this.originalBgColor = originalBgColor;
    this.originalBorderColor = originalBorderColor;
    this.textElement = new TextRenderable(renderer, {
      content: props.label,
      fg: this.disabled ? "#94A3B8" : "#FFFFFF"
    });
    this.add(this.textElement);
    this.setupMouseEvents();
  }
  setupMouseEvents() {
    // Use onMouseUp for click handling (works better with nested containers)
    this.onMouseUp = (event) => {
      if (event.button === 0 && this.onClickHandler && !this.disabled) {
        this.onClickHandler();
      }
    };

    // Keep global mousemove listener for hover effects
    this.renderer.on("mousemove", (x, y) => {
      if (this.containsPoint(x, y)) {
        if (!this.isHovered) {
          this.isHovered = true;
          this.updateHoverState();
        }
      } else {
        if (this.isHovered) {
          this.isHovered = false;
          this.updateHoverState();
        }
      }
    });
  }
  containsPoint(x, y) {
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }
  updateHoverState() {
    this.backgroundColor = this.isHovered ? this.hoverBgColor : this.defaultBgColor;
    this.renderer.requestRender();
  }
  setLabel(label) {
    this.label = label;
    if (this.textElement) {
      this.textElement.content = label;
    }
  }
  getLabel() {
    return this.label;
  }
  setDisabled(disabled) {
    this.disabled = disabled;
    if (disabled) {
      this.defaultBgColor = "#334155";
      this.backgroundColor = "#334155";
      this.borderColor = "#475569";
      if (this.textElement) {
        this.textElement.fg = "#94A3B8";
      }
    } else {
      this.defaultBgColor = this.originalBgColor;
      this.backgroundColor = this.isHovered ? this.hoverBgColor : this.originalBgColor;
      this.borderColor = this.originalBorderColor;
      if (this.textElement) {
        this.textElement.fg = "#FFFFFF";
      }
    }
    this.renderer.requestRender();
  }
  isDisabled() {
    return this.disabled;
  }
}
class IconButton extends Button {
  constructor(renderer, props) {
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
    });
  }
}
export {
  Button,
  IconButton
};
