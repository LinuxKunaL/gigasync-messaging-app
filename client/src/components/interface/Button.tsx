import React from "react";

type Props = {
  type: "primary" | "secondary" | "outline" | "link" | "transparent";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function Button({ type, className, children, onClick }: Props) {
  var buttonStyle;

  if (type === "primary") {
    buttonStyle =
      "flex items-center justify-center gap-2 bg-gradient-to-tl from-cyan-500 to-cyan-400 hover:from-cyan-500 hover:to-cyan-500 border-[3px] border-transparent active:dark:border-bunker-800 active:border-cyan-400 w-full transition-all font-semibold text-white rounded-lg outline-none";
  } else if (type === "secondary") {
    buttonStyle =
      "flex items-center justify-center gap-2 bg-gradient-to-tl dark:from-bunker-700 dark:to-bunker-600 from-bunker-100 to-bunker-200 text-bunker-600 hover:dark:from-bunker-800 hover:dark:to-bunker-800 hover:from-bunker-200 hover:to-bunker-200 font-medium dark:text-white rounded-lg w-full";
  } else if (type === "outline") {
    buttonStyle =
      "flex items-center justify-center gap-2 border-2 dark:border-bunker-600 text-bunker-400 hover:dark:border-bunker-500 border-bunker-400 hover:border-bunker-300 hover:text-bunker-300 font-medium rounded-lg w-full";
  } else if (type === "link") {
  } else if (type === "transparent") {
  }

  return (
    <div className={`${className} ${buttonStyle} px-4 py-2 cursor-pointer`} onClick={onClick}>
      {children}
    </div>
  );
}

export default Button;
