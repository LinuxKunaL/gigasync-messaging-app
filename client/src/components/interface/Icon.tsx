import React, { memo } from "react";

type Props = {
  variant: "filled" | "outlined" | "transparent" | "active";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: Boolean;
};

function Icon({ variant, children, className, onClick, active }: Props) {
  var iconStyle;
  var activeStyle;

  if (variant === "filled") {
    iconStyle = "bg-cyan-400 dark:text-bunker-100 hover:dark:bg-bunker-900";
  } else if (variant === "outlined") {
    iconStyle =
      "border-[2px] border-bunker-400/60 dark:border-bunker-700/40 dark:text-bunker-400 hover:dark:bg-cyan-300/20 hover:border-transparent hover:dark:text-cyan-500";
  } else if (variant === "transparent") {
    if (active) {
      activeStyle = "bg-cyan-400/20 dark:text-cyan-400 text-cyan-500";
    }
    iconStyle =
      "hover:bg-cyan-400/20 hover:dark:text-cyan-400 dark:text-bunker-400 hover:text-cyan-500";
  } else if (variant === "active") {
    iconStyle = `flex dark:text-cyan-300 dark:bg-cyan-500/20 text-cyan-600/70 bg-cyan-400/30 items-center justify-center size-9 p-2 rounded-lg cursor-pointer`;
  }

  return (
    <div
      onClick={onClick}
      className={`${iconStyle} ${className} ${activeStyle} text-xl flex items-center justify-center size-9 p-1 rounded-lg cursor-pointer`}
    >
      {children}
    </div>
  );
}

export default memo(Icon);
