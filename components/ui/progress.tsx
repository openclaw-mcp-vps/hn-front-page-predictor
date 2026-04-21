import { cn } from "@/lib/utils";

interface ProgressProps {
  className?: string;
  value: number;
}

export function Progress({ className, value }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[#273142]", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#2ea043] to-[#3fb950] transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
