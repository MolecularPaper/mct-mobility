import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends ComponentPropsWithoutRef<"div"> {
  label?: string;
  labelProps?: ComponentPropsWithoutRef<"p">;
  inputProps?: ComponentPropsWithoutRef<"input">;
}

export default function Input(props: InputProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex flex-row justify-center items-center",
        props?.className,
      )}>
      {props.label ?? (
        <p
          {...props.labelProps}
          className={twMerge("", props.labelProps?.className)}>
          {props.label}
        </p>
      )}
      <input
        {...props.inputProps}
        className={twMerge(
          "bg-transparent border border-transparent border-b-black",
          props.inputProps?.className,
        )}></input>
    </div>
  );
}
