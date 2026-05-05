import { Loader2 } from "lucide-react";
import { cx } from "./utils";

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
  iconClassName?: string;
}

export default function Loading({
  label,
  fullScreen = false,
  className,
  iconClassName,
}: LoadingProps) {
  return (
    <div
      className={cx(
        "flex items-center justify-center",
        fullScreen ? "h-screen bg-slate-50" : "h-full w-full",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2
          className={cx(
            "size-8 animate-spin text-slate-900",
            iconClassName
          )}
        />
        {label ? (
          <span className="text-sm font-medium text-blue-900">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
