import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleCatchError } from "../../utils/ErrorHandle";
import { insertData } from "../../app/Redux";
import { TUser } from "../../app/Types";

import SideBar from "./components/SidebarMenu";
import ContentBar from "./components/SidebarContainer";
import ChatSection from "./components/ChatContainer/Single/body";
import GroupChatSection from "./components/ChatContainer/Group/body";
import ChatDetailsBar from "./components/ChatDetailsSidebar/Index";
import api from "../../utils/api";
import socket from "../../app/Socket";
import PhoneChat from "../../assets/svgs/PhoneChat";


function Main() {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/auth/me")
      .then((Response) => {
        dispatch(insertData(Response.data));
        socket.emit("register", Response.data._id);
        socket.emit("status", {
          userId: Response.data._id,
          status: "online",
        });
        window.scrollBy(0, -100);
      })
      .catch((Err) => handleCatchError(Err));
  }, [dispatch]);

  return (
    <div className="h-full flex flex-row">
      <SideBar />
      <ContentBar />
      <ChatsSections />
      <ChatDetails />
    </div>
  );
}

export default Main;

function ChatDetails() {
  const SChatDetails: { visible: boolean; id: string; type: string } =
    useSelector((state: any) => state.chatDetails);

  return SChatDetails.visible ? (
    <ChatDetailsBar props={{ ...SChatDetails }} />
  ) : null;
}

function ChatsSections() {
  const SCurrentChat: TUser = useSelector((state: any) => state.currentChat);

  const SCurrentGroupChat: TUser = useSelector(
    (state: any) => state.currentGroupChat
  );

  if (SCurrentChat?._id) return <ChatSection />;
  if (SCurrentGroupChat?._id) return <GroupChatSection />;

  return (
    <div className="dark:bg-bunker-950 h-full w-full p-5 lg:p-0 hidden md:flex flex-col justify-center items-center relative">
      <div className="flex gap-2 flex-col justify-center items-center">
        <PhoneChat />
        <h1 className="text-2xl font-semibold dark:text-bunker-300">
          GigaSync
        </h1>
        <p className="text-bunker-400 text-sm text-center">
          Send and receive files and messages with GigaSync app , <br /> on your
          website. fast and secure.
        </p>
      </div>
    </div>
  );
}
