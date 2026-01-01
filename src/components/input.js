import { InputRenderable } from "@opentui/core";
export class Input extends InputRenderable {
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
        });
    }
}
export class TextField extends Input {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            placeholder: props.placeholder || "Enter text...",
        });
    }
}
export class PasswordField extends Input {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            placeholder: props.placeholder || "Enter password...",
        });
    }
    get displayValue() {
        return "*".repeat(this.value.length);
    }
}
export class TextArea extends Input {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            width: props.width || 60,
            height: props.height || 5,
            placeholder: props.placeholder || "Enter your message...",
        });
    }
}
export class EmailField extends Input {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            placeholder: props.placeholder || "Enter email...",
        });
    }
    validate() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.value);
    }
}
export class NumberField extends Input {
    min;
    max;
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            placeholder: props.placeholder || "Enter number...",
        });
        this.min = props.min;
        this.max = props.max;
    }
    getNumberValue() {
        return parseFloat(this.value) || 0;
    }
    validate() {
        const num = this.getNumberValue();
        if (this.min !== undefined && num < this.min)
            return false;
        if (this.max !== undefined && num > this.max)
            return false;
        return true;
    }
}
