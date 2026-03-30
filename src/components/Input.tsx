import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends ComponentPropsWithoutRef<"div"> {
  label?: string;
  labelProps?: ComponentPropsWithoutRef<"p">;
  inputProps?: ComponentPropsWithoutRef<"input">;
}

export default function Input({
  label,
  labelProps,
  inputProps,
  ...rest
}: InputProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        "flex flex-row justify-center items-center",
        rest?.className,
      )}>
      {label ?? (
        <p {...labelProps} className={twMerge("", labelProps?.className)}>
          {label}
        </p>
      )}
      <input
        {...inputProps}
        className={twMerge(
          "bg-transparent border border-transparent border-b-black",
          inputProps?.className,
        )}></input>
    </div>
  );
}
