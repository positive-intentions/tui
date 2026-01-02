import { BoxRenderable, TextRenderable } from "@opentui/core";
// Static registry to track all dialog instances
const dialogInstances = new Map();
class Dialog extends BoxRenderable {
  renderer;
  onConfirm;
  onCancel;
  constructor(renderer, props) {
    super(renderer, {
      id: props.id || "dialog",
      width: props.width || 40,
      height: 10,
      position: "absolute",
      backgroundColor: "#1E293B",
      border: true,
      borderStyle: "double",
      borderColor: "#EF4444",
      flexDirection: "column",
      alignItems: "stretch",
      zIndex: props.zIndex || 1e3
    });
    this.renderer = renderer;
    this.createContent(props);
    // Register this instance
    if (this.id) {
      dialogInstances.set(this.id, this);
    }
  }
  createContent(props) {
    const header = new BoxRenderable(this.renderer, {
      id: "dialog-header",
      height: 3,
      backgroundColor: "#EF4444",
      flexDirection: "row",
      alignItems: "center",
      flexGrow: 0
    });
    const title = new TextRenderable(this.renderer, {
      id: "dialog-title",
      content: props.title,
      fg: "#FFFFFF"
    });
    header.add(title);
    this.add(header);
    const body = new BoxRenderable(this.renderer, {
      id: "dialog-body",
      flexGrow: 1,
      flexDirection: "column",
      alignItems: "stretch",
      padding: 2
    });
    const message = new TextRenderable(this.renderer, {
      id: "dialog-message",
      content: props.message,
      fg: "#E2E8F0"
    });
    body.add(message);
    const buttonsBox = new BoxRenderable(this.renderer, {
      id: "dialog-buttons",
      height: 3,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      flexGrow: 0,
      marginTop: 1
    });
    const cancelBtn = new BoxRenderable(this.renderer, {
      id: "dialog-cancel-btn",
      width: 10,
      height: 1,
      backgroundColor: "#475569",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      border: true,
      borderStyle: "single",
      borderColor: "#64748B"
    });
    const cancelText = new TextRenderable(this.renderer, {
      id: "dialog-cancel-text",
      content: props.cancelText || "[Cancel]",
      fg: "#94A3B8"
    });
    cancelBtn.add(cancelText);
    buttonsBox.add(cancelBtn);
    const space = new TextRenderable(this.renderer, {
      id: "dialog-btn-space",
      content: " ",
      width: 2
    });
    buttonsBox.add(space);
    const confirmBtn = new BoxRenderable(this.renderer, {
      id: "dialog-confirm-btn",
      width: 10,
      height: 1,
      backgroundColor: "#DC2626",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      border: true,
      borderStyle: "single",
      borderColor: "#F87171"
    });
    const confirmText = new TextRenderable(this.renderer, {
      id: "dialog-confirm-text",
      content: props.confirmText || "[Confirm]",
      fg: "#FFFFFF"
    });
    confirmBtn.add(confirmText);
    buttonsBox.add(confirmBtn);
    body.add(buttonsBox);
    this.add(body);
    cancelBtn.onMouseUp = (event) => {
      if (event.button === 0) {
        event.stopPropagation();
        if (this.onCancel) this.onCancel();
        this.hide();
      }
    };
    confirmBtn.onMouseUp = (event) => {
      if (event.button === 0) {
        event.stopPropagation();
        if (this.onConfirm) this.onConfirm();
        this.hide();
      }
    };
  }
  show(onConfirm, onCancel) {
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.visible = true;
    const root = this.renderer.root;
    root.add(this);
    this.centerDialog();
    this.renderer.requestRender();
  }
  hide() {
    this.visible = false;
    if (this.renderer.currentFocusedRenderable) {
      this.renderer.currentFocusedRenderable.blur();
    }
    this.renderer.root.remove(this.id);
    this.renderer.requestRender();
  }
  centerDialog() {
    const rootWidth = this.renderer.root.width;
    const rootHeight = this.renderer.root.height;
    this.left = Math.floor((rootWidth - this.width) / 2);
    this.top = Math.floor((rootHeight - this.height) / 2);
  }
  setMessage(message) {
    const messageText = this.findDescendantById("dialog-message");
    if (messageText) {
      messageText.content = message;
      this.renderer.requestRender();
    }
  }
  setConfirmText(text) {
    const confirmText = this.findDescendantById("dialog-confirm-text");
    if (confirmText) {
      confirmText.content = text;
      this.renderer.requestRender();
    }
  }
  setCancelText(text) {
    const cancelText = this.findDescendantById("dialog-cancel-text");
    if (cancelText) {
      cancelText.content = text;
      this.renderer.requestRender();
    }
  }
  static closeAllOpenDialogs(renderer) {
    // Check renderer.root directly for any dialog elements
    // This is the most reliable way to find all dialogs, regardless of registry
    const rootChildren = renderer.root.getChildren();
    for (const child of rootChildren) {
      if (!child.id) continue;
      // Check if it looks like a dialog (has dialog-specific child elements)
      const dialogHeader = child.findDescendantById?.("dialog-header");
      if (dialogHeader) {
        // Try to use the registry dialog's hide() method if available
        const dialog = dialogInstances.get(child.id);
        if (dialog && dialog.visible) {
          dialog.hide();
        } else {
          // Not in registry or not visible, remove it directly
          try {
            // Set visible to false first
            if ('visible' in child) {
              child.visible = false;
            }
            renderer.root.remove(child.id);
          } catch (e) {
            // Ignore errors if element doesn't exist
          }
        }
      }
    }
    // Also close any dialogs from registry that might not be in root yet
    for (const [dialogId, dialog] of dialogInstances.entries()) {
      if (dialog.visible) {
        dialog.hide();
      }
    }
    // Force a render to update the display
    renderer.requestRender();
  }
}
export {
  Dialog
};
