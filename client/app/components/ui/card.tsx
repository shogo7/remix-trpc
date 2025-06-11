import * as React from "react";
import { cn } from "~/lib/utils.js";

type CardVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted"
  | "accent";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClass = {
    default:
      "bg-background text-background-foreground dark:bg-dark-background dark:text-dark-background-foreground",
    primary:
      "bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground",
    secondary:
      "bg-secondary text-secondary-foreground dark:bg-dark-secondary dark:text-dark-secondary-foreground",
    success:
      "bg-success text-success-foreground dark:bg-dark-success dark:text-dark-success-foreground",
    warning:
      "bg-warning text-warning-foreground dark:bg-dark-warning dark:text-dark-warning-foreground",
    destructive:
      "bg-destructive text-destructive-foreground dark:bg-dark-destructive dark:text-dark-destructive-foreground",
    info: "bg-info text-info-foreground dark:bg-dark-info dark:text-dark-info-foreground",
    muted:
      "bg-muted text-muted-foreground dark:bg-dark-muted dark:text-dark-muted-foreground",
    accent:
      "bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground",
  }[variant];

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border shadow-sm", variantClass, className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
