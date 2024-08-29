import { useEffect, useState } from "react";

import { MdAttachFile, MdDoneAll, MdMessage } from "react-icons/md";
import { TUser } from "../../../../../app/Types";
import { useDispatch, useSelector } from "react-redux";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
} from "../../../../../app/Redux";

import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import convertTime from "../../../../../utils/ConvertTime";
import socket from "../../../../../app/Socket";
import { handleCatchError } from "../../../../../utils/ErrorHandle";

type TAllChats = {
  isMessageSeen: boolean;
  message: { text: string };
  timestamp: Date;
  user: TUser;
};

function AllChats({ searchQuery }: { searchQuery: string | undefined }) {
  const [allChat, setAllChat] = useState<TAllChats[]>([]);
  const [filteredChats, setFilteredChats] = useState<TAllChats[]>([]);
  const dispatch = useDispatch();
  const SCurrentChat: TUser = useSelector((state: any) => state.currentChat);
  useEffect(() => handleLoadChats(), []);
  
  useEffect(() => {
    socket.on("loadChats", handleLoadChats);
    return () => {
      socket.off("loadChats", handleLoadChats);
    };
  }, []);

  useEffect(() => {
    const filteredChats = allChat.filter((chat) =>
      chat.user.fullName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() as string)
    );
    setFilteredChats(filteredChats);
  }, [searchQuery, allChat]);

  const handleLoadChats = () => {
    api
      .get("api/user/allChats")
      .then((Res) => {
        setAllChat(Res.data);
      })
      .catch((err) => handleCatchError(err));
  };

  const handleSelectChat = (param: TUser): void => {
    dispatch(insertCurrentGroupChatData({}));
    dispatch(insertCurrentChatData(param));
  };

  return (
    <div className="h-full w-full justify-center flex items-center !transition-none">
      {filteredChats.length > 0 ? (
        <div className="flex flex-col gap-1 xs:gap-3 w-full h-full">
          {filteredChats?.map((chat: any, index: number) => (
            <div
              key={index}
              onClick={() => handleSelectChat(chat?.user)}
              className={`flex flex-row w-full h-max justify-between p-2.5 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer ${
                SCurrentChat._id === chat?.user?._id &&
                "bg-bunker-100/70 dark:bg-cyan-900/70"
              }`}
            >
              <div className="flex gap-2 items-center">
                <Avatar rounded={true} data={chat?.user} size="xxl" />
                <div className="flex flex-col gap-1">
                  <h1 className="xs:text-lg text-base font-medium dark:text-bunker-50 text-bunker-600">
                    {chat?.user?.fullName}
                  </h1>
                  <p className="text-bunker-400 text-xs xs:text-sm truncate w-[10pc]">
                    {chat?.message?.file.type && (
                      <div className="flex flex-row gap-1 items-center">
                        <p className="truncate w-min">
                          {chat?.message?.file.name}
                        </p>
                      </div>
                    )}
                    {chat?.message?.text}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-1 mr-3">
                <p className="text-xs xs:text-sm text-bunker-400">
                  {convertTime(chat?.timestamp as any, "day")}
                </p>
                <div className="size-2.5 rounded-full bg-cyan-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="m-auto flex flex-col gap-2 sm:gap-3 items-center text-center">
            <MdMessage className="text-xl sm:text-2xl text-cyan-400 " />
            <p className="text-bunker-400 text-xs sm:text-sm">
              You have no messages. <br /> Start a conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllChats;
