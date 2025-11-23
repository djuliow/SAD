import { cn } from "/src/lib/utils.js";
import React from 'react';

const Tabs = ({ children, value, onValueChange, className, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(value || '');

  const contextValue = React.useMemo(() => ({
    value: value !== undefined ? value : internalValue,
    onValueChange: (newValue) => {
      setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    },
  }), [value, internalValue, onValueChange]);

  return (
    <div className={cn("relative", className)} {...props}>
      <TabsContext.Provider value={contextValue}>
        {children}
      </TabsContext.Provider>
    </div>
  );
};

const TabsList = ({ className, ...props }) => (
  <div
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, value, ...props }) => {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow",
        isSelected && "data-[state=active]:bg-white data-[state=active]:text-slate-950",
        className
      )}
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => context.onValueChange(value)}
      {...props}
    />
  );
};

const TabsContent = ({ className, value, ...props }) => {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  if (!isSelected) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
};

const TabsContext = React.createContext({});

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};