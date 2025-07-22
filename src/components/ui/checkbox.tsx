import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

// ✅ Props principales
type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  indicatorIcon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

// ✅ Checkbox simple avec personnalisation d'icône
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  indicatorIcon: Icon = Check, 
  ...props 
}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-destructive/20 data-[state=indeterminate]:border-destructive",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Icon 
        className="h-4 w-4 pointer-events-none" 
        aria-hidden="true"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ✅ Extension : support de l'état indéterminé via prop
type ExtendedCheckboxProps = CheckboxProps & {
  indeterminate?: boolean;
  indeterminateIcon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

const CheckboxExtended = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ExtendedCheckboxProps
>(({ 
  indeterminate,
  indeterminateIcon: IndeterminateIcon = Minus,
  ...props 
}, ref) => {
  const internalRef = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    if (internalRef.current) {
      (internalRef.current as HTMLInputElement).indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={mergeRefs(ref, internalRef)}
      indicatorIcon={indeterminate ? IndeterminateIcon : props.indicatorIcon}
      aria-checked={indeterminate ? "mixed" : undefined}
      {...props}
    />
  );
});
CheckboxExtended.displayName = "CheckboxExtended";

// ✅ Helper pour fusionner plusieurs refs (nécessaire pour `indeterminate`)
const mergeRefs = <T,>(...refs: React.Ref<T>[]) => {
  return (value: T) => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(value);
      else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
};

export { Checkbox, CheckboxExtended };
