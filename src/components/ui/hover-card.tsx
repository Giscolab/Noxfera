import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn, withDisplayName } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { Cross2Icon } from "@radix-ui/react-icons"

// ======================== ROOT ========================
interface HoverCardProps extends HoverCardPrimitive.HoverCardProps {
  openDelay?: number
  closeDelay?: number
}

const HoverCard = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Root>,
  HoverCardProps
>(({ openDelay = 200, closeDelay = 300, ...props }, _ref) => (
  <HoverCardPrimitive.Root
    openDelay={openDelay}
    closeDelay={closeDelay}
    {...props}
  />
))
withDisplayName(HoverCard, "HoverCard")

// ======================== TRIGGER ========================
interface HoverCardTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> {
  asChild?: boolean
  showDelay?: number
  hideDelay?: number
}

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  HoverCardTriggerProps
>(({ 
  className, 
  children, 
  asChild = false, 
  showDelay, 
  hideDelay,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      asChild
      data-show-delay={showDelay}
      data-hide-delay={hideDelay}
      {...props}
    >
      <Comp
        className={cn(
          "inline-flex items-center justify-center",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        {children}
      </Comp>
    </HoverCardPrimitive.Trigger>
  )
})
withDisplayName(HoverCardTrigger, "HoverCardTrigger")

// ======================== CONTENT ========================
interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  arrow?: boolean
  arrowSize?: number
  arrowClassName?: string
  collisionPadding?: number
  sticky?: "partial" | "always"
  alignOffset?: number
  withClose?: boolean
  onClose?: () => void
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({
  className,
  align = "center",
  sideOffset = 4,
  arrow = true,
  arrowSize = 8,
  arrowClassName,
  collisionPadding = 16,
  sticky = "partial",
  alignOffset = 0,
  withClose = false,
  onClose,
  children,
  ...props
}, ref) => {
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose?.()
  }
  
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        sticky={sticky}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-xl",
          "outline-none transition-all duration-200 ease-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "origin-[var(--radix-hover-card-content-transform-origin)]",
          className
        )}
        {...props}
      >
        {withClose && (
          <button
            onClick={handleClose}
            className={cn(
              "absolute right-2 top-2 rounded-full p-1 opacity-70 transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2",
              "focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              "bg-background/50 backdrop-blur-sm"
            )}
            aria-label="Close"
          >
            <Cross2Icon className="h-3 w-3" />
          </button>
        )}
        
        {children}
        
        {arrow && (
          <HoverCardPrimitive.Arrow
            width={arrowSize}
            height={arrowSize / 2}
            className={cn(
              "fill-popover stroke-border stroke-[0.5]",
              arrowClassName
            )}
          />
        )}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
})
withDisplayName(HoverCardContent, "HoverCardContent")

// ======================== STRUCTURE COMPONENTS ========================
const HoverCardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 pb-3 border-b border-border/40",
      className
    )}
    {...props}
  />
)
withDisplayName(HoverCardHeader, "HoverCardHeader")

const HoverCardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      "flex items-center gap-2",
      className
    )}
    {...props}
  />
)
withDisplayName(HoverCardTitle, "HoverCardTitle")

const HoverCardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "text-sm text-muted-foreground pt-1.5 leading-relaxed",
      className
    )}
    {...props}
  />
)
withDisplayName(HoverCardDescription, "HoverCardDescription")

const HoverCardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between pt-4 gap-2",
      className
    )}
    {...props}
  />
)
withDisplayName(HoverCardFooter, "HoverCardFooter")

const HoverCardButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium",
      "ring-offset-background transition-colors focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "px-3 py-1.5 w-full transition-all hover:scale-[1.02]",
      className
    )}
    {...props}
  />
))
withDisplayName(HoverCardButton, "HoverCardButton")

// Alias pour compatibilité
const HoverCardAction = HoverCardButton

// ======================== ICON ========================
interface HoverCardIconProps {
  icon: React.ReactNode
  className?: string
  bg?: string
}

const HoverCardIcon = ({
  icon,
  className,
  bg = "bg-secondary"
}: HoverCardIconProps) => (
  <div className={cn(
    "w-10 h-10 rounded-lg flex items-center justify-center",
    bg,
    className
  )}>
    {React.isValidElement(icon) 
      ? React.cloneElement(icon, { className: "w-5 h-5" } as React.HTMLAttributes<HTMLElement>)
      : icon}
  </div>
)
HoverCardIcon.displayName = "HoverCardIcon"

// ======================== THUMBNAIL ========================
const HoverCardThumbnail = ({
  src,
  alt,
  className
}: {
  src: string
  alt: string
  className?: string
}) => (
  <div className="mb-3 -mx-4 -mt-4">
    <img
      src={src}
      alt={alt}
      className={cn(
        "w-full h-32 object-cover rounded-t-lg border-b border-border/50",
        className
      )}
    />
  </div>
)
withDisplayName(HoverCardThumbnail, "HoverCardThumbnail")

// ======================== EXPORTS ========================
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
  HoverCardButton,
  HoverCardAction, // Alias
  HoverCardIcon,
  HoverCardThumbnail
}

