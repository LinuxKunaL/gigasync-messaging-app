import { useEffect, useState } from "react";

import {
  MdClose,
  MdSearch,
  MdDoneAll,
  MdGroupAdd,
  MdMessage,
} from "react-icons/md";

import Input from "../../../../../components/interface/Input";
import Icon from "../../../../../components/interface/Icon";
import TabNavigation from "../../../../../components/interface/TabNavigation";
import Contacts from "../components/Contacts";
import ToolTip from "../../../../../components/interface/Tooltip";
import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import { TUser } from "../../../../../app/Types";
import { useDispatch, useSelector } from "react-redux";
import { insertCurrentChatData } from "../../../../../app/Redux";

type Props = {};

function Home({}: Props) {
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
        {activeTab === "All Chats" ? <Chats /> : null}
        {activeTab === "Groups" ? <Groups /> : null}
        {activeTab === "Contacts" ? <Contacts /> : null}
      </div>
    </>
  );
}

function Chats() {
  const [allChat, setAllChat] = useState<any>([]);
  const [reloadAllChats, setReloadAllChats] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("api/user/allChats")
      .then((Res) => {
        setAllChat(Res.data);
      })
      .catch(() => {});
  }, [reloadAllChats]);

  const handleChat = (param: TUser): void => {
    const { _id, username, fullName, avatarColor, isAvatar } = param;
    dispatch(
      insertCurrentChatData({ username, _id, fullName, avatarColor, isAvatar })
    );
  };

  return (
    <div className="h-full justify-center flex items-center !transition-none">
      {allChat.length > 0 ? (
        <div className="flex flex-col gap-3 w-full h-full ">
          {allChat?.map((chat?: any) => (
            <div
              onClick={() => handleChat(chat?.user)}
              className="flex flex-row w-full h-max justify-between py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <Avatar rounded={true} data={chat?.user} />
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                    {chat?.user?.fullName}
                  </h1>
                  <p className="text-bunker-400 text-sm truncate">
                    {chat?.message?.text}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-1">
                <p className="text-sm text-bunker-400">11:30 AM</p>
                <MdDoneAll className="size-6 text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="m-auto flex flex-col gap-3 items-center text-center">
            <MdMessage className="text-2xl text-cyan-400 " />
            <p className="text-bunker-400 text-sm">
              You have no messages. Start a conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Groups() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-bunker-300">groups</h1>
        <ToolTip id="add-contact" className="z-10" content="create group">
          <Icon variant="transparent">
            <MdGroupAdd />
          </Icon>
        </ToolTip>
      </div>
      <div className="flex flex-row justify-between py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
        <div className="flex gap-2 items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcRgjzzQv2TyMVCpn9xl27f0ziyDhkQVxqzA&s"
            alt=""
            className="size-14 rounded-full border-[3px] border-cyan-400/70"
          />
          <div>
            <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
              college friends
            </h1>
            <p className="text-bunker-400 text-sm">
              <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                120 members
                <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                3 online
              </p>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end gap-1">
          <p className="text-sm text-bunker-400">11:30 AM</p>
          <MdDoneAll className="size-6 text-cyan-400" />
        </div>
      </div>
    </>
  );
}

export default Home;
