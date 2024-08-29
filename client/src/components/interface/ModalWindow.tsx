import React from "react";

type Props = {
  children: JSX.Element;
};

const ModalWindow = ({ children }: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50 sm:p-0 p-3">
      {children}
    </div>
  );
};

export default ModalWindow;
