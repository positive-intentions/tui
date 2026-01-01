import { BoxRenderable } from "@opentui/core";
export class Container extends BoxRenderable {
    constructor(renderer, props = {}) {
        super(renderer, {
            id: props.id,
            width: props.width,
            height: props.height,
            backgroundColor: props.backgroundColor || "transparent",
            borderColor: props.borderColor,
            borderStyle: props.borderStyle,
            title: props.title,
            titleAlignment: props.titleAlignment || "center",
            border: props.border,
            flexGrow: props.flexGrow,
            flexShrink: props.flexShrink,
            flexBasis: props.flexBasis,
            flexDirection: props.flexDirection || "column",
            alignItems: props.alignItems || "stretch",
            justifyContent: props.justifyContent || "flex-start",
            position: props.position || "relative",
            left: props.left,
            top: props.top,
            right: props.right,
            bottom: props.bottom,
            zIndex: props.zIndex,
        });
    }
}
export class Row extends Container {
    constructor(renderer, props = {}) {
        super(renderer, { ...props, flexDirection: "row" });
    }
}
export class Column extends Container {
    constructor(renderer, props = {}) {
        super(renderer, { ...props, flexDirection: "column" });
    }
}
export class Card extends Container {
    constructor(renderer, props = {}) {
        super(renderer, {
            ...props,
            border: true,
            borderStyle: "single",
            borderColor: props.borderColor || "#475569",
            backgroundColor: props.backgroundColor || "#1E293B",
        });
    }
}
