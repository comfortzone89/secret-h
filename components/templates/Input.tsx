import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export default function Input({
  type = "text",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      {...rest}
      className={clsx(
        type !== "range"
          ? "p-2 w-max-[200px] w-full bg-white text-black rounded-[10px] outline-0 transition-shadow focus:shadow-[box-shadow:var(--inputBoxShadow)]"
          : "range-input"
      )}
    />
  );
}
