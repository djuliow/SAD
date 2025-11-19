import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-b border-slate-100 px-6 py-4", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <h3 className={cn("text-base font-semibold text-slate-800", className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500", className)} {...props} />
);

export { Card, CardHeader, CardContent, CardTitle, CardDescription };
