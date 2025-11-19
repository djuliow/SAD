import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn("fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm", className)}
    {...props}
  />
);

const DialogContent = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 space-y-1", className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose };
