import { InputHTMLAttributes } from "react";

export default function Input({ type = "text", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} {...rest} className="p-2 w-[200px] bg-white text-black rounded-[10px] outline-0 transition-shadow focus:shadow-[box-shadow:var(--inputBoxShadow)]" />;
}