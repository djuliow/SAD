import { cn } from "/src/lib/utils.js";

const Badge = ({ className, variant = "default", ...props }) => {
  const variantClasses = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/80",
    outline: "text-slate-900 border border-slate-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
    success: "bg-sky-100 text-sky-800 hover:bg-sky-100/80",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };