import { useEffect, useState } from "react";

import { MdDoneAll, MdMessage } from "react-icons/md";
import { TUser } from "../../../../../app/Types";
import { useDispatch } from "react-redux";
import { insertCurrentChatData } from "../../../../../app/Redux";

import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";

function AllChats() {
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
                <Avatar rounded={true} data={chat?.user} size="xxl" />
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

export default AllChats;
