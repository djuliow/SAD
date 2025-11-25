import { cn } from "/src/lib/utils.js";

const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table
      className={cn("w-full caption-bottom text-sm border-collapse border border-slate-300", className)}
      {...props}
    />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      "h-10 px-4 text-left align-middle font-medium text-navy [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] border-r border-slate-300 last:border-r-0",
      className
    )}
    {...props}
  />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={cn(
      "border-b border-slate-300 transition-colors hover:bg-sky-blue/20 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] border-r border-slate-300 last:border-r-0 text-navy",
      className
    )}
    {...props}
  />
);

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
};