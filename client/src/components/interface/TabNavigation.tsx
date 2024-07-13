import React from "react";

type Props = {
  tabTitle: string[];
  onTabActive: any;
  activeTab: string;
};

const TabNavigation = ({ tabTitle, onTabActive, activeTab }: Props) => {
  const tabActiveStyle =
    "bg-gradient-to-tl from-cyan-500 to-cyan-300 dark:from-bunker-910 dark:to-bunker-900 !text-bunker-100";

  return (
    <>
      {tabTitle.map((tab) => (
        <button
          onClick={() => onTabActive(tab)}
          className={`${
            activeTab === tab ? tabActiveStyle : null
          } dark:text-bunker-50 text-bunker-600 font- py-2 px-4 rounded-lg `}
        >
          {tab}
        </button>
      ))}
    </>
  );
};

export default TabNavigation;
