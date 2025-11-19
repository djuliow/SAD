import * as React from "react";
import { cn } from "@/lib/utils";

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="relative w-full overflow-auto rounded-xl border border-slate-200 bg-white">
    <table className={cn("w-full text-sm text-slate-600", className)} {...props} />
  </div>
);

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500", className)} {...props} />
);

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("border-b border-slate-100 last:border-none", className)} {...props} />
);

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("", className)} {...props} />
);

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-slate-100", className)} {...props} />
);

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3", className)} {...props} />
);

export { Table, TableHead, TableRow, TableHeader, TableBody, TableCell };
