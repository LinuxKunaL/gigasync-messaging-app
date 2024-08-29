import { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import Input from "../../../../../components/interface/Input";
import Icon from "../../../../../components/interface/Icon";
import TabNavigation from "../../../../../components/interface/TabNavigation";
import Contacts from "../Contacts";

import Groups from "./Groups";
import AllChats from "./AllChats";

type Props = {};

function Index({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const [activeTab, setActiveTab] = useState("All Chats");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="flex flex-col gap-2 xs:gap-4 h-full">
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-lg xs:text-2xl font-semibold dark:text-bunker-300">
            Chat
          </h1>
          <p className="text-xs xs:text-sm dark:text-bunker-500">
            Start New Conversation
          </p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible && (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="text"
              placeholder="Search contact, group, or message"
              className="absolute bottom-0 top-0 placeholder:text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon
              onClick={() => {
                setIsSearchVisible(false);
                setSearchQuery("");
              }}
              className="absolute bottom-1.5 right-2 sm:bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        )}
      </div>
      <div className="dark:bg-bunker-950 bg-bunker-50 p-1.5 sm:p-2 rounded-lg flex space-x-4 w-full lg:w-max">
        <TabNavigation
          tabTitle={["All Chats", "Groups", "Contacts"]}
          onTabActive={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="flex flex-col gap-1 sm:gap-4 h-full -2 overflow-auto scrollbar-bunker">
        {activeTab === "All Chats" ? (
          <AllChats searchQuery={searchQuery} />
        ) : null}
        {activeTab === "Groups" ? <Groups searchQuery={searchQuery} /> : null}
        {activeTab === "Contacts" ? (
          <Contacts searchQuery={searchQuery} />
        ) : null}
      </div>
    </div>
  );
}

export default Index;
