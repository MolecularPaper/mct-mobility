import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Button(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={twMerge(
        "bg-white hover:bg-gray-200 focus:bg-gray-300 border border-black px-4 py-2 rounded",
        props.className,
      )}>
      {props.children}
    </button>
  );
}
