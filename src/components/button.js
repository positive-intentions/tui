import { BoxRenderable, TextRenderable } from "@opentui/core";
export class Button extends BoxRenderable {
    renderer;
    label;
    onClickHandler;
    textElement;
    isHovered = false;
    defaultBgColor;
    hoverBgColor;
    constructor(renderer, props) {
        const bgColor = props.disabled ? "#334155" : props.backgroundColor || "#3B82F6";
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
            borderColor: props.disabled ? "#475569" : "#60A5FA",
        });
        this.renderer = renderer;
        this.label = props.label;
        this.onClickHandler = props.onClick;
        this.defaultBgColor = bgColor;
        this.hoverBgColor = hoverBg;
        this.textElement = new TextRenderable(renderer, {
            content: props.label,
            fg: props.disabled ? "#94A3B8" : "#FFFFFF",
        });
        this.add(this.textElement);
        this.setupMouseEvents();
    }
    setupMouseEvents() {
        this.renderer.on("mousemove", (x, y) => {
            if (this.containsPoint(x, y)) {
                if (!this.isHovered) {
                    this.isHovered = true;
                    this.updateHoverState();
                }
            }
            else {
                if (this.isHovered) {
                    this.isHovered = false;
                    this.updateHoverState();
                }
            }
        });
        this.renderer.on("mousedown", (x, y) => {
            if (this.containsPoint(x, y) && this.onClickHandler) {
                this.onClickHandler();
            }
        });
    }
    containsPoint(x, y) {
        return (x >= this.x &&
            x < this.x + this.width &&
            y >= this.y &&
            y < this.y + this.height);
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
}
export class IconButton extends Button {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            label: props.icon,
            width: props.width || 3,
        });
    }
}
