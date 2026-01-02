import { BoxRenderable } from "@opentui/core";
class Container extends BoxRenderable {
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
      zIndex: props.zIndex
    });
  }
}
class Row extends Container {
  constructor(renderer, props = {}) {
    super(renderer, {
      id: props.id,
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      borderStyle: props.borderStyle,
      title: props.title,
      titleAlignment: props.titleAlignment,
      border: props.border,
      padding: props.padding,
      margin: props.margin,
      flexGrow: props.flexGrow,
      flexShrink: props.flexShrink,
      flexBasis: props.flexBasis,
      flexDirection: "row",
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      position: props.position,
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex
    });
  }
}
class Column extends Container {
  constructor(renderer, props = {}) {
    super(renderer, {
      id: props.id,
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      borderStyle: props.borderStyle,
      title: props.title,
      titleAlignment: props.titleAlignment,
      border: props.border,
      padding: props.padding,
      margin: props.margin,
      flexGrow: props.flexGrow,
      flexShrink: props.flexShrink,
      flexBasis: props.flexBasis,
      flexDirection: "column",
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      position: props.position,
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex
    });
  }
}
class Card extends Container {
  constructor(renderer, props = {}) {
    super(renderer, {
      id: props.id,
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor || "#1E293B",
      borderColor: props.borderColor || "#475569",
      borderStyle: props.borderStyle,
      title: props.title,
      titleAlignment: props.titleAlignment,
      border: true,
      padding: props.padding,
      margin: props.margin,
      flexGrow: props.flexGrow,
      flexShrink: props.flexShrink,
      flexBasis: props.flexBasis,
      flexDirection: props.flexDirection,
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
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
  Card,
  Column,
  Container,
  Row
};
