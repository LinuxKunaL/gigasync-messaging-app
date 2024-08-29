import React from "react";
import tooltip, { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type Props = {
  id: string;
  className?: string;
  content: string;
  children?: React.ReactNode;
  place?: tooltip.PlacesType;
};

function ToolTip({ id, className, content, children, place }: Props) {
  return (
    <div>
      <div>
        <a data-tooltip-id={id} data-tooltip-content={content}>
          {children}
        </a>
        <Tooltip
          id={id}
          place={place}
          className={`${className} dark:!bg-bunker-800 !bg-bunker-50 dark:!text-bunker-50 !text-bunker-800`}
        />
      </div>
    </div>
  );
}

export default ToolTip;
