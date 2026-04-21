import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#2f3a4d] bg-[#0d1117] px-3 py-2 text-sm text-[#e6edf3] placeholder:text-[#718096] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3fb950] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
