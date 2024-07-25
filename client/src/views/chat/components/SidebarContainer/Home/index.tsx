import { useEffect, useRef, useState } from "react";

import {
  MdClose,
  MdSearch,
  MdDoneAll,
  MdGroupAdd,
  MdMessage,
  MdAdd,
  MdPerson,
  MdOutlineSaveAs,
} from "react-icons/md";
import { TGroup, TUser } from "../../../../../app/Types";
import { useDispatch } from "react-redux";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
} from "../../../../../app/Redux";
import { toastSuccess, toastWarning } from "../../../../../app/Toast";
import { handleCatchError } from "../../../../../utils/ErrorHandle";

import Input from "../../../../../components/interface/Input";
import Icon from "../../../../../components/interface/Icon";
import TabNavigation from "../../../../../components/interface/TabNavigation";
import Contacts from "../Contacts";
import ToolTip from "../../../../../components/interface/Tooltip";
import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import Button from "../../../../../components/interface/Button";
import ModalWindow from "../../../../../components/interface/ModalWindow";
import dataURLtoBlob from "../../../../../utils/dataURLtoBlob";
import Groups from "./Groups";
import AllChats from "./AllChats";
type Props = {};

function Index({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const [activeTab, setActiveTab] = useState("All Chats");

  return (
    <>
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">Chat</h1>
          <p className="text-sm dark:text-bunker-500">Start New Conversation</p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="search"
              placeholder="Search chat"
              className=" absolute bottom-0 top-0"
            />
            <Icon
              onClick={() => setIsSearchVisible(false)}
              className="absolute right-2 bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        ) : null}
      </div>
      <div className="dark:bg-bunker-950 bg-bunker-50 p-2 rounded-lg flex space-x-4 w-max">
        <TabNavigation
          tabTitle={["All Chats", "Groups", "Contacts"]}
          onTabActive={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="flex flex-col gap-4 h-full">
        {activeTab === "All Chats" ? <AllChats /> : null}
        {activeTab === "Groups" ? <Groups /> : null}
        {activeTab === "Contacts" ? <Contacts /> : null}
      </div>
    </>
  );
}

export default Index;
