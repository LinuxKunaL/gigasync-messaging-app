import React from "react";
import ToolTip from "./Tooltip";

type Props = {
  size: "normal" | "small" | "tiny";
  id?: string;
  isCheck?: boolean;
  onChange?: (event: any) => void;
  disabled?: boolean;
  name?: string | any;
};

function Switch({ size, id, isCheck, onChange, disabled, name }: Props) {
  var sizeStyle;

  if (size === "normal") {
    sizeStyle = "w-11 h-6 after:h-5 after:w-5";
  } else if (size === "small") {
    sizeStyle = "w-9 h-5 after:h-4 after:w-4";
  } else if (size === "tiny") {
    sizeStyle = "w-7 h-4 after:h-3 after:w-3";
  }

  return (
    <ToolTip
      id={name}
      className=" z-50"
      content={disabled ? "Edit mode is disable" : ""}
    >
      <label
        className={`inline-flex items-center ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <input
          id={id}
          name=""
          type="checkbox"
          defaultChecked={isCheck}
          disabled={disabled}
          className="sr-only peer"
          onChange={onChange}
        />
        <div
          className={`${sizeStyle} relative bg-bunker-100 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-bunker-950 peer-checked:after:translate-x-full ring-transparent rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-bunker-100 after:border-bunker-300 after:border after:rounded-full after:transition-all peer-checked:bg-cyan-600`}
        />
      </label>
    </ToolTip>
  );
}

export default Switch;
