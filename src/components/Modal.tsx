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
        "fixed w-screen h-screen bg-black/30 z-50",
        className,
      )}>
      {children}
    </div>
  );
}
