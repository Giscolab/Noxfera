import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500 text-white hover:bg-emerald-600",
        info: "bg-sky-500 text-white hover:bg-sky-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        iconLg: "h-12 w-12",
      },
      loading: {
        true: "cursor-wait",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  loadingText?: string
  loadingAnimation?: "spin" | "ping"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    icon,
    iconPosition = "left",
    children,
    loadingText,
    loadingAnimation = "spin",
    tabIndex,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const showLoadingContent = isLoading && loadingText
    const isIconSize = size?.startsWith("icon")
    
    // Déterminer la taille du loader en fonction de la taille du bouton
    const loaderSize = isIconSize ? 
      (size === "iconSm" ? "size-3" : "size-4") : 
      "size-4"
    
    // Classes d'animation conditionnelles
    const animationClass = loadingAnimation === "ping" ? 
      "animate-ping" : 
      "animate-spin"

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, loading: isLoading }), 
          className,
          isLoading && "relative"
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        aria-disabled={isLoading || props.disabled}
        tabIndex={isLoading ? -1 : tabIndex}
        data-loading={isLoading ? "" : undefined} // Attribut data pour le styling/JS
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 
              className={cn(
                loaderSize,
                animationClass,
                !showLoadingContent && "absolute"
              )} 
              aria-hidden="true"
            />
            {showLoadingContent && (
              <span className="flex items-center gap-2">
                {loadingText}
                <span className="sr-only">Chargement en cours</span>
              </span>
            )}
            {!showLoadingContent && (
              <span className="sr-only">Chargement...</span>
            )}
          </span>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {children}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }