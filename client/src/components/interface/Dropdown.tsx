import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

type Props = {
  options: {
    onClick?: () => void;
    element?: React.ReactNode;
    className?: string;
  }[];
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left" | undefined;
  className?: string;
  disabled?: boolean;
};

function Dropdown({
  options,
  children,
  placement = "bottom",
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const placements = {
    top: "top-0",
    bottom: "bottom-0",
    right: "right-0",
    left: "left-0",
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{children}</div>
      {open && !disabled && (
        <div
          ref={dropdownMenuRef}
          className={`${placements[placement]} ${className} z-10 bg-white border-[1px] border-bunker-600/10 divide-y divide-gray-100 rounded-lg w-max dark:bg-bunker-900 absolute mt-2`}
        >
          <ul className="py-2 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
            {options.map((item, index) => (
              <div
                className={`${item.className} block  ${
                  item.element ? "sm:px-4 sm:py-2 px-3 py-1.5" : null
                } hover:bg-gray-100 dark:hover:bg-bunker-700 dark:hover:text-white cursor-pointer`}
                key={index}
                onClick={item.onClick}
              >
                {item.element}
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
