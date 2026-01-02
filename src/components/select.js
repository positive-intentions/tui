import { SelectRenderable, SelectRenderableEvents } from "@opentui/core";
class Select extends SelectRenderable {
  constructor(renderer, props) {
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
      fastScrollStep: props.fastScrollStep || 5
    });
    this.onMouseDown = (event) => {
      if (event.button === 0) {
        this.focus();
      }
    };
    this.onMouseUp = (event) => {
      if (event.button === 0) {
        // Calculate which item was clicked based on mouse position
        const localY = event.y - this.y;
        const itemHeight = this.showDescription ? 2 : 1;
        const clickedIndex = Math.floor(localY / itemHeight);
        if (clickedIndex >= 0 && clickedIndex < this.options.length) {
          // Set the selected index
          this.selectedIndex = clickedIndex;
          // Emit the ITEM_SELECTED event
          const option = this.options[clickedIndex];
          this.emit(SelectRenderableEvents.ITEM_SELECTED, clickedIndex, option);
          // Request a render to update the display
          this.ctx.requestRender();
        }
      }
    };
    this.onMouseScroll = (event) => {
      if (!event.scroll || this.options.length === 0) return;
      const { direction } = event.scroll;
      const currentIndex = this.selectedIndex ?? 0;
      let newIndex;
      if (direction === "up") {
        // Scroll up moves forward (higher index) - move one at a time
        newIndex = currentIndex + 1;
        if (newIndex >= this.options.length) {
          newIndex = this.wrapSelection ? 0 : this.options.length - 1;
        }
      } else if (direction === "down") {
        // Scroll down moves backward (lower index) - move one at a time
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = this.wrapSelection ? this.options.length - 1 : 0;
        }
      } else {
        return;
      }
      // Clamp to valid range (in case wrapSelection is false)
      newIndex = Math.max(0, Math.min(this.options.length - 1, newIndex));
      if (newIndex !== currentIndex) {
        this.selectedIndex = newIndex;
        // Emit the ITEM_SELECTED event
        const option = this.options[newIndex];
        this.emit(SelectRenderableEvents.ITEM_SELECTED, newIndex, option);
        // Request a render to update the display
        this.ctx.requestRender();
      }
    };
  }
  onItemSelected(callback) {
    this.on(SelectRenderableEvents.ITEM_SELECTED, callback);
  }
}
export {
  Select
};
