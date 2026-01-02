import { InputRenderable } from "@opentui/core";
class Input extends InputRenderable {
  constructor(renderer, props = {}) {
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
      border: props.border !== void 0 ? props.border : true,
      borderStyle: props.borderStyle || "single",
      borderColor: props.borderColor || "#475569"
    });
    this.onMouseDown = (event) => {
      if (event.button === 0) {
        event.stopPropagation();
        this.focus();
        const localX = event.x - this.x;
        const clampedX = Math.max(0, Math.min(localX, this.width - 1));
        const newCursorPosition = Math.min(clampedX, this.value.length);
        this.cursorPosition = newCursorPosition;
      }
    };
    this.onMouseScroll = (event) => {
      if (!this.focused) return;
      event.stopPropagation();
      if (event.scroll) {
        const direction = event.scroll.direction;
        if (direction === "left") {
          this.cursorPosition = Math.max(0, this.cursorPosition - 1);
          this.ctx.requestRender();
        } else if (direction === "right") {
          this.cursorPosition = Math.min(this.value.length, this.cursorPosition + 1);
          this.ctx.requestRender();
        }
      }
    };
  }
}
class TextField extends Input {
  constructor(renderer, props) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter text..."
    });
  }
}
class PasswordField extends Input {
  constructor(renderer, props) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter password..."
    });
  }
  get displayValue() {
    return "*".repeat(this.value.length);
  }
}
class TextArea extends Input {
  constructor(renderer, props) {
    super(renderer, {
      ...props,
      width: props.width || 60,
      height: props.height || 5,
      placeholder: props.placeholder || "Enter your message..."
    });
  }
}
class EmailField extends Input {
  constructor(renderer, props) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter email..."
    });
  }
  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.value);
  }
}
class NumberField extends Input {
  min;
  max;
  constructor(renderer, props) {
    super(renderer, {
      ...props,
      placeholder: props.placeholder || "Enter number..."
    });
    this.min = props.min;
    this.max = props.max;
  }
  getNumberValue() {
    return parseFloat(this.value) || 0;
  }
  validate() {
    const num = this.getNumberValue();
    if (this.min !== void 0 && num < this.min) return false;
    if (this.max !== void 0 && num > this.max) return false;
    return true;
  }
}
export {
  EmailField,
  Input,
  NumberField,
  PasswordField,
  TextArea,
  TextField
};
