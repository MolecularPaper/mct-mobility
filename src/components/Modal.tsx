import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  active: boolean;
}

export default function Modal(props: ModalProps) {
  if (!props.active) return null;

  return (
    <div
      {...props}
      className={twMerge(
        "fixed w-screen h-screen bg-black/30 z-50",
        props.className,
      )}>
      {props.children}
    </div>
  );
}
