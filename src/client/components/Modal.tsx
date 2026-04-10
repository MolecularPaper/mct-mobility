import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  active: boolean;
}

export default function Modal({
  active,
  className,
  children,
  ...rest
}: ModalProps) {
  if (!active) return null;

  return (
    <div
      {...rest}
      className={twMerge(
        "fixed inset-0 bg-black/30 z-50",
        className,
      )}>
      {children}
    </div>
  );
}
