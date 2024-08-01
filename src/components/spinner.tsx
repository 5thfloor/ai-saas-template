import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <LoaderCircle
      strokeWidth={3}
      className={cn("text-primary animate-spin", className)}
    />
  );
}
