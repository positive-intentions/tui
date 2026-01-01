import { TextRenderable, t, bold, fg } from "@opentui/core";
export class Text extends TextRenderable {
    constructor(renderer, props) {
        super(renderer, {
            id: props.id,
            content: props.content,
            width: props.width,
            height: props.height,
            fg: props.fg || "#E2E8F0",
            bg: props.bg || "transparent",
            position: props.position,
            left: props.left,
            top: props.top,
            right: props.right,
            bottom: props.bottom,
            zIndex: props.zIndex,
        });
    }
}
export class Heading extends Text {
    constructor(renderer, props) {
        const sizes = {
            1: "#38BDF8",
            2: "#60A5FA",
            3: "#93C5FD",
            4: "#BFDBFE",
            5: "#DBEAFE",
            6: "#EFF6FF",
        };
        const color = props.fg || sizes[props.level];
        super(renderer, {
            ...props,
            content: bold(fg(color)(props.content)),
        });
    }
}
export class Paragraph extends Text {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            content: props.content,
            fg: props.fg || "#94A3B8",
        });
    }
}
export class Label extends Text {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            content: bold(fg("#CBD5E1")(props.content + ":")),
            fg: props.fg || "#CBD5E1",
        });
    }
}
export class Status extends Text {
    constructor(renderer, props) {
        const colors = {
            success: "#22C55E",
            error: "#EF4444",
            warning: "#F59E0B",
            info: "#3B82F6",
        };
        const icons = {
            success: "✓",
            error: "✗",
            warning: "⚠",
            info: "ℹ",
        };
        const color = colors[props.status];
        const icon = icons[props.status];
        super(renderer, {
            ...props,
            content: t `${fg(color)(bold(icon + " "))}${props.content}`,
            fg: props.fg || colors[props.status],
        });
    }
}
export class Code extends Text {
    constructor(renderer, props) {
        super(renderer, {
            ...props,
            content: props.content,
            fg: props.fg || "#A5B4FC",
            bg: props.bg || "#1E1B4B",
        });
    }
}
