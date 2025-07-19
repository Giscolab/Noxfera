import * as React from "react"
import { cn } from "@/lib/utils"
import { X, Loader2, Eye, EyeOff } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  clearable?: boolean
  loading?: boolean
  isInvalid?: boolean
  errorMessage?: string
  onClear?: () => void
  containerClass?: string
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClass,
      type = "text",
      iconLeft,
      iconRight,
      clearable,
      loading,
      isInvalid,
      errorMessage,
      onClear,
      disabled,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [hasValue, setHasValue] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const handleClear = () => {
      if (onClear) onClear()
      // Reset input value if controlled externally
      if (inputRef.current) inputRef.current.value = ""
      setHasValue(false)
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
      setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && clearable && hasValue) {
        handleClear()
      }
      props.onKeyDown?.(e)
    }

    // Determine final input type
    const inputType = showPasswordToggle 
      ? showPassword ? "text" : "password"
      : type

    return (
      <div className={cn("flex flex-col gap-1 w-full", containerClass)}>
        <div
          className={cn(
            "relative flex h-11 w-full items-center rounded-lg border bg-background transition-all",
            "px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-60",
            isInvalid 
              ? "border-destructive focus-within:ring-destructive/30" 
              : "border-input focus-within:border-primary",
            className
          )}
        >
          {iconLeft && (
            <span className="mr-2 text-muted-foreground flex-shrink-0">
              {iconLeft}
            </span>
          )}

          <input
            ref={(node) => {
              inputRef.current = node
              if (typeof ref === "function") ref(node)
              else if (ref) ref.current = node
            }}
            type={inputType}
            className={cn(
              "flex-1 w-full bg-transparent outline-none placeholder:text-muted-foreground/70",
              "disabled:cursor-not-allowed text-sm md:text-base",
              "autofill:bg-transparent" // Prevent yellow autofill background
            )}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            aria-invalid={isInvalid}
            {...props}
          />

          <div className="flex items-center ml-2 gap-1.5">
            {loading && (
              <Loader2 
                className={cn(
                  "animate-spin text-muted-foreground flex-shrink-0",
                  showPasswordToggle ? "mr-2" : ""
                )}
                size={18}
              />
            )}

            {clearable && hasValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Clear input"
                disabled={disabled}
              >
                <X size={16} />
              </button>
            )}

            {showPasswordToggle && !loading && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={disabled}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}

            {!loading && !clearable && !showPasswordToggle && iconRight && (
              <span className="text-muted-foreground flex-shrink-0">
                {iconRight}
              </span>
            )}
          </div>
        </div>

        {isInvalid && errorMessage && (
          <p className="text-destructive text-xs font-medium px-1 animate-in fade-in">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }