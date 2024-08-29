import React from "react";

type Props = {
  tabTitle: string[];
  onTabActive: any;
  activeTab: string;
};

const TabNavigation = ({ tabTitle, onTabActive, activeTab }: Props) => {
  const tabActiveStyle =
    "bg-gradient-to-tl from-cyan-500 to-cyan-300 dark:from-bunker-920 dark:to-bunker-920 !text-bunker-50";

  return (
    <>
      {tabTitle.map((tab, index) => (
        <button
          key={index}
          // style={{
          //   boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.6)",
          // }}
          onClick={() => onTabActive(tab)}
          className={`w-full lg:w-max ${
            activeTab === tab ? tabActiveStyle : null
          } dark:text-bunker-200 text-bunker-600 py-2 px-1.5 xs:px-4 rounded-md text-xs font-medium xs:text-base`}
        >
          {tab}
        </button>
      ))}
    </>
  );
};

export default TabNavigation;
