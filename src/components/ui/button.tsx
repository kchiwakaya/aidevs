import * as React from "react";
import { cn } from "../utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getVariantClasses(variant: ButtonVariant = "default") {
  switch (variant) {
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:opacity-90";
    case "outline":
      return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    case "ghost":
      return "hover:bg-accent hover:text-accent-foreground";
    case "link":
      return "text-primary underline-offset-4 hover:underline";
    case "default":
    default:
      return "bg-primary text-primary-foreground hover:opacity-90";
  }
}

function getSizeClasses(size: ButtonSize = "default") {
  switch (size) {
    case "sm":
      return "h-8 rounded-md px-3";
    case "lg":
      return "h-10 rounded-md px-8";
    case "icon":
      return "h-9 w-9";
    case "default":
    default:
      return "h-9 px-4 py-2";
  }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  return <button ref={ref} className={cn(base, getVariantClasses(variant), getSizeClasses(size), className)} {...props} />;
});
Button.displayName = "Button";


