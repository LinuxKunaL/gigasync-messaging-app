import { trace } from "console";
import React from "react";

type Props = {
  type: "primary" | "secondary" | "outline" | "link" | "transparent";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function Button({ type, className, children, onClick }: Props) {
  var buttonStyle = {
    primary:
      "bg-gradient-to-tl from-cyan-500 to-cyan-400 hover:from-cyan-500 hover:to-cyan-500",
    secondary:
      "bg-gradient-to-tl dark:from-bunker-700 dark:to-bunker-600 from-bunker-200 to-bunker-300 text-bunker-600 hover:dark:from-bunker-800 hover:dark:to-bunker-800 hover:from-bunker-200 hover:to-bunker-200",
    outline:
      "border-2 dark:border-bunker-600 text-bunker-400 hover:dark:border-bunker-500 border-bunker-400 hover:border-bunker-300 hover:text-bunker-300 font-medium rounded-lg w-full",
    link: "",
    transparent: "",
  };

  return (
    <div
      className={`${className} ${buttonStyle[type]} flex items-center justify-center gap-2 sm:text-sm text-xs px-4 py-3 sm:py-3 cursor-pointer select-none rounded-lg font-semibold text-white active:opacity-[0.85] w-full disabled:pointer-events-none disabled:opacity-50`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Button;
