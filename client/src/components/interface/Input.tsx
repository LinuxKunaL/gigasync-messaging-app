import React from "react";

type Props = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  defaultValue?: string;
};

function Input({
  className,
  type,
  placeholder,
  onChange,
  value,
  name,
  defaultValue,
}: Props) {
  return (
    <input
      name={name}
      className={`px-4 py-2 ${className} border-[1px] dark:text-bunker-200 dark:border-bunker-700/40 dark:bg-bunker-900 focus:dark:!bg-bunker-920 focus:!bg-bunker-50 focus:!border-cyan-500 outline-none transition-all w-full bg-white rounded-lg`}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
    />
  );
}

export default Input;
