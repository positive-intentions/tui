import { type CliRenderer, BoxRenderable, TextRenderable, SelectRenderable, SelectRenderableEvents, type SelectOption, type MouseEvent } from "@opentui/core"

// Static registry to track all dropdown instances
const dropdownInstances = new Map<string, Dropdown>()

export interface DropdownProps {
  id?: string
  width?: number
  position?: "absolute" | "relative"
  left?: number
  top?: number
  right?: number
  bottom?: number
  zIndex?: number
  options: SelectOption[]
  selectedIndex?: number
  disabled?: boolean
  backgroundColor?: string
  textColor?: string
  hoverBackgroundColor?: string
  menuBackgroundColor?: string
  menuBorderColor?: string
  menuWidth?: number
  menuHeight?: number
  onSelectionChange?: (index: number, option: SelectOption) => void
}

export class Dropdown extends BoxRenderable {
  private renderer: CliRenderer
  private options: SelectOption[]
  private selectedIndex: number
  private disabled: boolean
  private isMenuOpen: boolean
  private isHovered: boolean
  private menu?: BoxRenderable
  private menuSelect?: SelectRenderable
  private dropdownText?: TextRenderable
  private dropdownIndicator?: TextRenderable
  private onSelectionChange?: (index: number, option: SelectOption) => void
  private menuWidth?: number
  private menuHeight?: number
  private hoveredItemIndex?: number
  private menuMouseMoveHandler?: (x: number, y: number) => void
  private hoverOverlay?: BoxRenderable
  
  private defaultBgColor: string
  private hoverBgColor: string
  private originalBgColor: string
  private originalBorderColor: string
  
  private clickOutsideHandler?: (event: MouseEvent) => void
  private keyPressHandler?: (key: any) => void

  constructor(renderer: CliRenderer, props: DropdownProps) {
    const disabled = props.disabled || false
    const originalBgColor = props.backgroundColor || "#3B82F6"
    const originalBorderColor = "#60A5FA"
    const bgColor = disabled ? "#334155" : originalBgColor
    const hoverBg = props.hoverBackgroundColor || "#2563EB"

    super(renderer, {
      id: props.id,
      width: props.width || 30,
      height: 3,
      position: props.position || "relative",
      left: props.left,
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      zIndex: props.zIndex,
      backgroundColor: bgColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      border: true,
      borderStyle: "single",
      borderColor: disabled ? "#475569" : originalBorderColor,
      paddingLeft: 1,
      paddingRight: 1,
    })

    this.renderer = renderer
    this.options = props.options
    this.selectedIndex = props.selectedIndex ?? 0
    this.disabled = disabled
    this.isMenuOpen = false
    this.isHovered = false
    this.onSelectionChange = props.onSelectionChange
    this.defaultBgColor = bgColor
    this.hoverBgColor = hoverBg
    this.originalBgColor = originalBgColor
    this.originalBorderColor = originalBorderColor

    this.createContent()
    this.setupEventHandlers()
    
    // Register this instance
    if (this.id) {
      dropdownInstances.set(this.id, this)
    }
  }

  private createContent(): void {
    this.dropdownText = new TextRenderable(this.renderer, {
      id: `${this.id}-text`,
      content: this.options[this.selectedIndex]?.name || "Select...",
      fg: this.disabled ? "#94A3B8" : "#FFFFFF",
    })
    this.add(this.dropdownText)

    this.dropdownIndicator = new TextRenderable(this.renderer, {
      id: `${this.id}-indicator`,
      content: "▼",
      fg: this.disabled ? "#94A3B8" : "#FFFFFF",
    })
    this.add(this.dropdownIndicator)
  }

  private setupEventHandlers(): void {
    this.renderer.on("mousemove", (x: number, y: number) => {
      if (!this.disabled) {
        if (this.containsPoint(x, y)) {
          if (!this.isHovered) {
            this.isHovered = true
            this.updateHoverState()
          }
        } else {
          if (this.isHovered) {
            this.isHovered = false
            this.updateHoverState()
          }
        }
      }
    })

    this.onMouseDown = (event: MouseEvent) => {
      if (event.button === 0 && !this.disabled) {
        event.stopPropagation()
        this.toggleMenu()
      }
    }
  }

  private containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    )
  }

  private containsPointInMenu(x: number, y: number): boolean {
    if (!this.menu || !this.isMenuOpen) return false
    return (
      x >= this.menu.x &&
      x < this.menu.x + this.menu.width &&
      y >= this.menu.y &&
      y < this.menu.y + this.menu.height
    )
  }

  private updateHoverState(): void {
    this.backgroundColor = this.isHovered ? this.hoverBgColor : this.defaultBgColor
    this.renderer.requestRender()
  }

  private createMenu(): void {
    if (this.menu) return

    const menuHeight = this.menuHeight || Math.min(this.options.length * 3 + 2, 15)
    
    this.menu = new BoxRenderable(this.renderer, {
      id: `${this.id}-menu`,
      width: this.menuWidth || this.width || 30,
      height: menuHeight,
      position: "absolute",
      backgroundColor: "#1E293B",
      border: true,
      borderStyle: "double",
      borderColor: "#38BDF8",
      flexDirection: "column",
      zIndex: 1000,
      visible: false,
    })

    // Calculate SelectRenderable height: menu height minus border (2 lines for double border)
    const selectHeight = Math.max(menuHeight - 2, 3)
    const menuWidth = this.menuWidth || this.width || 30

    this.menuSelect = new SelectRenderable(this.renderer, {
      id: `${this.id}-select`,
      options: this.options,
      width: menuWidth,
      height: selectHeight,
      backgroundColor: "transparent",
      focusedBackgroundColor: "transparent",
      selectedBackgroundColor: "#1E3A5F",
      textColor: "#E2E8F0",
      selectedTextColor: "#38BDF8",
      descriptionColor: "#64748B",
      selectedDescriptionColor: "#94A3B8",
      showScrollIndicator: true,
      wrapSelection: true,
      showDescription: false,
      fastScrollStep: 5,
    })

    // Ensure SelectRenderable can receive focus and handle clicks
    this.menuSelect.onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        this.menuSelect!.focus()
        // Don't stop propagation - let SelectRenderable handle clicks on items
      }
    }

    // Handle mouse up to detect item clicks
    this.menuSelect.onMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        // Calculate which item was clicked based on mouse position
        const localY = event.y - this.menuSelect!.y
        // Each item is 1 line high when showDescription is false
        const itemHeight = 1
        const clickedIndex = Math.floor(localY / itemHeight)
        
        if (clickedIndex >= 0 && clickedIndex < this.options.length) {
          // Clear hover state
          this.hoveredItemIndex = undefined
          
          // Set the selected index
          this.menuSelect!.selectedIndex = clickedIndex
          
          // Emit the ITEM_SELECTED event (which will trigger selectOption)
          const option = this.options[clickedIndex]
          this.menuSelect!.emit(SelectRenderableEvents.ITEM_SELECTED, clickedIndex, option)
        }
      }
    }

    // Setup hover effect for menu items
    this.setupMenuHoverHandler()

    this.menuSelect.on(SelectRenderableEvents.ITEM_SELECTED, (index: number, option: SelectOption) => {
      this.selectOption(index, option)
    })

    this.menu.add(this.menuSelect)
  }

  private setupMenuHoverHandler(): void {
    if (!this.menuSelect || !this.menu) return

    // Create hover overlay box
    if (!this.hoverOverlay) {
      // Width should match SelectRenderable width, accounting for borders
      const menuWidth = this.menuWidth || this.width || 30
      const borderWidth = 4 // Double border: 2 chars left + 2 chars right
      const overlayWidth = menuWidth - borderWidth
      
      this.hoverOverlay = new BoxRenderable(this.renderer, {
        id: `${this.id}-hover-overlay`,
        width: overlayWidth,
        height: 1,
        position: "absolute",
        backgroundColor: "#1E3A5F", // Same as selectedBackgroundColor
        zIndex: 1001, // Above SelectRenderable
        visible: false,
      })
      this.menu.add(this.hoverOverlay)
    }

    this.menuMouseMoveHandler = (x: number, y: number) => {
      if (!this.menuSelect || !this.isMenuOpen || !this.menu || !this.hoverOverlay) return

      // Use menu's absolute coordinates for detection
      const menuX = this.menu.x
      const menuY = this.menu.y
      const menuWidth = this.menu.width
      const menuHeight = this.menu.height

      // Check if mouse is over the menu
      if (x >= menuX && x < menuX + menuWidth && y >= menuY && y < menuY + menuHeight) {
        // Calculate position relative to menu
        const localY = y - menuY
        
        // Account for double border at top (2 lines)
        const borderTop = 2
        const selectStartY = borderTop
        
        // Check if mouse is within the SelectRenderable area
        if (localY >= selectStartY && localY < selectStartY + this.menuSelect.height) {
          // Calculate which item is being hovered
          const itemY = localY - selectStartY
          const itemHeight = 1 // Each item is 1 line high when showDescription is false
          const hoveredIndex = Math.floor(itemY / itemHeight)

          if (hoveredIndex >= 0 && hoveredIndex < this.options.length) {
            if (this.hoveredItemIndex !== hoveredIndex) {
              this.hoveredItemIndex = hoveredIndex
              // Position overlay relative to menu container
              const borderLeft = 2 // Double border left side
              const menuWidth = this.menuWidth || this.width || 30
              const borderWidth = 4
              const overlayWidth = menuWidth - borderWidth
              
              this.hoverOverlay.left = borderLeft
              this.hoverOverlay.top = borderTop + hoveredIndex
              this.hoverOverlay.width = overlayWidth
              this.hoverOverlay.visible = true
              this.renderer.requestRender()
            }
          } else {
            // Mouse is over menu but not over a valid item
            if (this.hoveredItemIndex !== undefined) {
              this.hoveredItemIndex = undefined
              this.hoverOverlay.visible = false
              this.renderer.requestRender()
            }
          }
        } else {
          // Mouse is over menu border but not over select area
          if (this.hoveredItemIndex !== undefined) {
            this.hoveredItemIndex = undefined
            this.hoverOverlay.visible = false
            this.renderer.requestRender()
          }
        }
      } else {
        // Mouse is outside the menu
        if (this.hoveredItemIndex !== undefined) {
          this.hoveredItemIndex = undefined
          this.hoverOverlay.visible = false
          this.renderer.requestRender()
        }
      }
    }

    this.renderer.on("mousemove", this.menuMouseMoveHandler)
  }

  private removeMenuHoverHandler(): void {
    if (this.menuMouseMoveHandler) {
      this.renderer.removeListener("mousemove", this.menuMouseMoveHandler)
      this.menuMouseMoveHandler = undefined
    }
    if (this.hoverOverlay) {
      this.hoverOverlay.visible = false
    }
    this.hoveredItemIndex = undefined
  }

  private positionMenu(): void {
    if (!this.menu) return

    const rootHeight = this.renderer.root.height
    const rootWidth = this.renderer.root.width

    this.menu.left = this.x
    this.menu.top = this.y + this.height

    if (this.menu.top + this.menu.height > rootHeight) {
      this.menu.top = this.y - this.menu.height
    }

    if (this.menu.left + this.menu.width > rootWidth) {
      this.menu.left = rootWidth - this.menu.width
    }

    if (this.menu.left < 0) {
      this.menu.left = 0
    }
  }

  private openMenu(): void {
    if (this.isMenuOpen) return

    this.createMenu()
    this.positionMenu()
    
    this.isMenuOpen = true
    this.dropdownIndicator!.content = "▶"
    this.menu!.visible = true
    
    this.renderer.root.add(this.menu!)
    
    this.menuSelect!.selectedIndex = this.selectedIndex
    this.menuSelect!.focus()

    this.setupClickOutsideHandler()
    this.setupKeyPressHandler()
    this.setupMenuHoverHandler()

    this.renderer.requestRender()
  }

  public closeMenu(): void {
    if (!this.isMenuOpen) return

    this.isMenuOpen = false
    this.dropdownIndicator!.content = "▼"
    
    if (this.menu) {
      if (this.menuSelect && this.menuSelect.focused) {
        this.menuSelect.blur()
      }
      this.menu.visible = false
      this.renderer.root.remove(this.menu.id)
    }

    this.removeClickOutsideHandler()
    this.removeKeyPressHandler()
    this.removeMenuHoverHandler()

    this.renderer.requestRender()
  }

  private setupClickOutsideHandler(): void {
    this.clickOutsideHandler = (event: MouseEvent) => {
      if (event.button === 0) {
        const inTrigger = this.containsPoint(event.x, event.y)
        const inMenu = this.containsPointInMenu(event.x, event.y)
        
        if (!inTrigger && !inMenu) {
          event.stopPropagation()
          this.closeMenu()
        }
      }
    }
    
    this.renderer.on("mousedown", this.clickOutsideHandler)
  }

  private removeClickOutsideHandler(): void {
    if (this.clickOutsideHandler) {
      this.renderer.removeListener("mousedown", this.clickOutsideHandler)
      this.clickOutsideHandler = undefined
    }
  }

  private setupKeyPressHandler(): void {
    this.keyPressHandler = (key: any) => {
      if (key.name === "escape") {
        this.closeMenu()
      }
    }
    
    (this.renderer.keyInput as any).on("keypress", this.keyPressHandler)
  }

  private removeKeyPressHandler(): void {
    if (this.keyPressHandler) {
      (this.renderer.keyInput as any).removeListener("keypress", this.keyPressHandler)
      this.keyPressHandler = undefined
    }
  }

  private selectOption(index: number, option: SelectOption): void {
    this.selectedIndex = index
    this.dropdownText!.content = option.name
    this.hoveredItemIndex = undefined // Clear hover state
    this.closeMenu()
    
    if (this.onSelectionChange) {
      this.onSelectionChange(index, option)
    }
    
    this.renderer.requestRender()
  }

  public toggleMenu(): void {
    if (this.isMenuOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  public setSelectedIndex(index: number): void {
    if (index >= 0 && index < this.options.length) {
      this.selectedIndex = index
      this.dropdownText!.content = this.options[index].name
      this.renderer.requestRender()
    }
  }

  public getSelectedIndex(): number {
    return this.selectedIndex
  }

  public getSelectedOption(): SelectOption | undefined {
    return this.options[this.selectedIndex]
  }

  public setOptions(options: SelectOption[], keepSelection: boolean = false): void {
    this.options = options
    
    if (!keepSelection || this.selectedIndex >= options.length) {
      this.selectedIndex = 0
    }
    
    this.dropdownText!.content = options[this.selectedIndex].name
    
    if (this.menuSelect) {
      this.menuSelect.options = options
    }
    
    this.renderer.requestRender()
  }

  public setDisabled(disabled: boolean): void {
    this.disabled = disabled
    
    if (disabled) {
      this.defaultBgColor = "#334155"
      this.backgroundColor = "#334155"
      this.borderColor = "#475569"
      if (this.dropdownText) {
        this.dropdownText.fg = "#94A3B8"
      }
      if (this.dropdownIndicator) {
        this.dropdownIndicator.fg = "#94A3B8"
      }
    } else {
      this.defaultBgColor = this.originalBgColor
      this.backgroundColor = this.isHovered ? this.hoverBgColor : this.originalBgColor
      this.borderColor = this.originalBorderColor
      if (this.dropdownText) {
        this.dropdownText.fg = "#FFFFFF"
      }
      if (this.dropdownIndicator) {
        this.dropdownIndicator.fg = "#FFFFFF"
      }
    }
    
    this.renderer.requestRender()
  }

  public isDisabled(): boolean {
    return this.disabled
  }

  public isOpen(): boolean {
    return this.isMenuOpen
  }

  /**
   * Close all open dropdowns in the given renderer
   */
  public static closeAllOpenDropdowns(renderer: CliRenderer): void {
    // Find all menu elements in renderer.root that end with "-menu"
    const rootChildren = renderer.root.getChildren()
    const menuIds: string[] = []
    
    for (const child of rootChildren) {
      if (child.id && child.id.endsWith("-menu")) {
        menuIds.push(child.id)
      }
    }
    
    // For each menu, find the corresponding dropdown and close it
    for (const menuId of menuIds) {
      // Extract dropdown ID from menu ID (remove "-menu" suffix)
      const dropdownId = menuId.replace("-menu", "")
      const dropdown = dropdownInstances.get(dropdownId)
      
      if (dropdown && dropdown.isMenuOpen) {
        dropdown.closeMenu()
      } else {
        // If we can't find the dropdown instance, just remove the menu element
        renderer.root.remove(menuId)
      }
    }
  }
}

export type DropdownEvents = "item-selected" | "menu-open" | "menu-close"
