import { type CliRenderer, TextRenderable, t, bold, fg } from "@opentui/core"

export interface TextProps {
  id?: string
  content: any
  width?: number
  height?: number
  fg?: string
  bg?: string
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
}

export class Text extends TextRenderable {
  constructor(renderer: CliRenderer, props: TextProps) {
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
    })
  }
}

export interface HeadingProps extends Omit<TextProps, "content"> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  content: string
}

export class Heading extends Text {
  constructor(renderer: CliRenderer, props: HeadingProps) {
    const sizes: Record<number, string> = {
      1: "#38BDF8",
      2: "#60A5FA",
      3: "#93C5FD",
      4: "#BFDBFE",
      5: "#DBEAFE",
      6: "#EFF6FF",
    }

    const color = props.fg || sizes[props.level]

    super(renderer, {
      ...props,
      content: bold(fg(color)(props.content)),
    })
  }
}

export interface ParagraphProps extends TextProps {
  content: string
}

export class Paragraph extends Text {
  constructor(renderer: CliRenderer, props: ParagraphProps) {
    super(renderer, {
      ...props,
      content: props.content,
      fg: props.fg || "#94A3B8",
    })
  }
}

export interface LabelProps extends TextProps {
  htmlFor?: string
  content: string
}

export class Label extends Text {
  constructor(renderer: CliRenderer, props: LabelProps) {
    super(renderer, {
      ...props,
      content: bold(fg("#CBD5E1")(props.content + ":")),
      fg: props.fg || "#CBD5E1",
    })
  }
}

export interface StatusProps extends Omit<TextProps, "content"> {
  status: "success" | "error" | "warning" | "info"
  content: string
}

export class Status extends Text {
  constructor(renderer: CliRenderer, props: StatusProps) {
    const colors = {
      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
    }

    const icons = {
      success: "✓",
      error: "✗",
      warning: "⚠",
      info: "ℹ",
    }

    const color = colors[props.status]
    const icon = icons[props.status]

    super(renderer, {
      ...props,
      content: t`${fg(color)(bold(icon + " "))}${props.content}`,
      fg: props.fg || colors[props.status],
    })
  }
}

export interface CodeProps extends TextProps {
  content: string
}

export class Code extends Text {
  constructor(renderer: CliRenderer, props: CodeProps) {
    super(renderer, {
      ...props,
      content: props.content,
      fg: props.fg || "#A5B4FC",
      bg: props.bg || "#1E1B4B",
    })
  }
}
