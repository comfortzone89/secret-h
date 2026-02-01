import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={clsx(
        "relative px-6 py-3 bg-amber-600 text-white rounded-xl shadow-theme uppercase transition-all",
        "enabled:hover:bg-amber-500 enabled:active:shadow-none! enabled:active:translate-y-[5px] cursor-pointer",
        "disabled:cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
