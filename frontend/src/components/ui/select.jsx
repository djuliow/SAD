import React, { useState, useRef, useEffect } from "react";
import { cn } from "/src/lib/utils.js";

// Context untuk komunikasi antar komponen Select
const SelectContext = React.createContext();

// Komponen utama Select
const Select = ({ children, value, onValueChange, className, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectContext.Provider value={{ selectedValue, isOpen, setIsOpen, handleSelect }}>
      <div ref={selectRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// Komponen SelectTrigger untuk menampilkan nilai terpilih
const SelectTrigger = ({ children, className, ...props }) => {
  const { selectedValue, isOpen, setIsOpen } = React.useContext(SelectContext);

  // Mencari komponen SelectValue di antara children untuk ditampilkan
  const selectValueChild = React.Children.toArray(children).find(
    child => child.type === SelectValue
  );

  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {selectValueChild ? selectValueChild : <span className="truncate">{selectedValue || "Pilih opsi"}</span>}
      <span className="ml-2 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </div>
  );
};

// Komponen SelectContent untuk menampilkan opsi-opsi
const SelectContent = ({ children, className, ...props }) => {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Komponen SelectItem untuk item dalam dropdown
const SelectItem = ({ children, value, ...props }) => {
  const { handleSelect } = React.useContext(SelectContext);

  return (
    <div
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      onClick={() => handleSelect(value)}
      {...props}
    >
      {children}
    </div>
  );
};

// Komponen SelectValue untuk menampilkan nilai terpilih
const SelectValue = ({ placeholder, className, children, ...props }) => {
  const { selectedValue } = React.useContext(SelectContext);
  
  // If children are provided (custom display text), use them.
  // Otherwise, fallback to selectedValue or placeholder.
  const displayContent = children || selectedValue || placeholder;

  return (
    <span className={cn("truncate", className)} {...props}>
      {displayContent}
    </span>
  );
};

// Ekspor untuk kompatibilitas dengan Select sederhana bawaan HTML
const SimpleSelect = ({ children, value, onValueChange, className, ...props }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

// Ekspor semua komponen yang digunakan di berbagai bagian aplikasi
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SimpleSelect as SelectInput
};

// Juga menyediakan komponen Select lama sebagai fallback jika diperlukan
// Ini untuk kompatibilitas dengan kode yang mungkin masih mengharapkan implementasi sebelumnya
const LegacySelect = ({ children, value, onValueChange, className, ...props }) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export { LegacySelect as SelectOld };