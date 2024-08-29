import React, { memo } from "react";

type Props = {
  variant: "filled" | "outlined" | "transparent" | "active" | "dark-filled";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: Boolean;
};

const variantStyles = {
  filled: "bg-cyan-400 dark:text-bunker-100 hover:dark:bg-bunker-900",
  outlined:
    "border-[2px] border-bunker-400/60 dark:border-bunker-700/40 dark:text-bunker-400 hover:dark:bg-cyan-300/20 hover:border-transparent hover:dark:text-cyan-500",
  transparent:
    "hover:bg-cyan-400/20 hover:dark:text-cyan-400 dark:text-bunker-400 text-bunker-600 hover:text-cyan-500",
  active:
    "flex dark:text-cyan-300 dark:bg-cyan-500/20 text-cyan-600/70 bg-cyan-400/30 items-center justify-center size-9 p-2 rounded-lg cursor-pointer",
  "dark-filled":
    "border-[1px] dark:text-bunker-100 text-bunker-700 dark:border-bunker-700/40 rounded-md bg-white dark:bg-bunker-900 dark:active:bg-bunker-900/60 active:bg-white/70 flex items-center justify-center hover:bg-white/60 dark:hover:bg-bunker-700/60",
};

const activeStyle = "bg-cyan-400/20 dark:text-cyan-400 text-cyan-500";

function Icon({ variant, children, className, onClick, active }: Props) {
  const iconStyle = variantStyles[variant];
  const appliedActiveStyle =
    variant === "transparent" && active ? activeStyle : "";

  return (
    <div
      onClick={onClick}
      className={`${iconStyle} ${className} ${appliedActiveStyle} text-lg sm:text-xl flex items-center justify-center size-8 sm:size-9 p-1 rounded-lg cursor-pointer`}
    >
      {children}
    </div>
  );
}

export default memo(Icon);
