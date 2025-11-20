import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-navy/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/20 focus-visible:border-teal transition-colors text-navy",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
