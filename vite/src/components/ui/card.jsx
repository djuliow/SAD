import { cn } from "/src/lib/utils.js";

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-xl border bg-white text-slate-950 shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
);

export { Card, CardContent, CardDescription, CardHeader, CardTitle };