import { ComponentType } from "react";

interface ModalProps<T extends object> {
  active: boolean;
  Child: ComponentType<T>;
  childProps?: T;
}

export default function Modal<T extends object>({
  active,
  Child,
  childProps,
}: ModalProps<T>) {
  if (!active) return null;

  return (
    <div className="fixed w-screen h-screen bg-black/30 z-50">
      <Child {...(childProps as T)} />
    </div>
  );
}
