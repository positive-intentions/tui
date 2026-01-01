import { type CliRenderer, BoxRenderable } from "@opentui/core"

export interface ContainerProps {
  id?: string
  width?: number
  height?: number
  backgroundColor?: string
  borderColor?: string
  borderStyle?: "single" | "double"
  title?: string
  titleAlignment?: "left" | "center" | "right"
  border?: boolean
  padding?: number
  margin?: number
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number
  flexDirection?: "row" | "column"
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch"
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around"
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
}

export class Container extends BoxRenderable {
  constructor(renderer: CliRenderer, props: ContainerProps = {}) {
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
    })
  }
}

export interface RowProps extends Omit<ContainerProps, "flexDirection"> {}

export class Row extends Container {
  constructor(renderer: CliRenderer, props: RowProps = {}) {
    super(renderer, { ...props, flexDirection: "row" })
  }
}

export interface ColumnProps extends Omit<ContainerProps, "flexDirection"> {}

export class Column extends Container {
  constructor(renderer: CliRenderer, props: ColumnProps = {}) {
    super(renderer, { ...props, flexDirection: "column" })
  }
}

export interface CardProps extends ContainerProps {
  title?: string
}

export class Card extends Container {
  constructor(renderer: CliRenderer, props: CardProps = {}) {
    super(renderer, {
      ...props,
      border: true,
      borderStyle: "single",
      borderColor: props.borderColor || "#475569",
      backgroundColor: props.backgroundColor || "#1E293B",
    })
  }
}
