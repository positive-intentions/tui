import { type CliRenderer, SelectRenderable, SelectRenderableEvents, type SelectOption } from "@opentui/core"

export interface SelectProps {
  id?: string
  width?: number
  height?: number
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
  options: SelectOption[]
  backgroundColor?: string
  focusedBackgroundColor?: string
  selectedBackgroundColor?: string
  textColor?: string
  selectedTextColor?: string
  descriptionColor?: string
  selectedDescriptionColor?: string
  showScrollIndicator?: boolean
  wrapSelection?: boolean
  showDescription?: boolean
  fastScrollStep?: number
}

export class Select extends SelectRenderable {
  constructor(renderer: CliRenderer, props: SelectProps) {
    super(renderer, {
      id: props.id,
      width: props.width || 40,
      height: props.height,
      position: props.position || "relative",
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex,
      options: props.options,
      backgroundColor: props.backgroundColor || "transparent",
      focusedBackgroundColor: props.focusedBackgroundColor || "transparent",
      selectedBackgroundColor: props.selectedBackgroundColor || "#1E3A5F",
      textColor: props.textColor || "#E2E8F0",
      selectedTextColor: props.selectedTextColor || "#38BDF8",
      descriptionColor: props.descriptionColor || "#64748B",
      selectedDescriptionColor: props.selectedDescriptionColor || "#94A3B8",
      showScrollIndicator: props.showScrollIndicator ?? true,
      wrapSelection: props.wrapSelection ?? true,
      showDescription: props.showDescription ?? true,
      fastScrollStep: props.fastScrollStep || 5,
    })
  }

  onItemSelected(callback: (index: number, option: SelectOption) => void): void {
    this.on(SelectRenderableEvents.ITEM_SELECTED, callback)
  }
}

export type SelectEvents = SelectRenderableEvents
