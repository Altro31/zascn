import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function FloatingContainer({
  className,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={cn(
        "bottom-0 left-0 w-full p-4",
        className,
        "fixed bg-background mask-t-from-60%"
      )}
    />
  );
}
