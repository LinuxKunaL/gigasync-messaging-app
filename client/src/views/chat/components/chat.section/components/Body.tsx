import { useEffect, useState } from "react";

import {
  MdCallEnd,
  MdMicOff,
  MdTimelapse,
  MdVideoCall,
  MdVideocamOff,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { TMessages, TUser } from "../../../../../app/Types";
import api from "../../../../../utils/api";
import socket from "../../../../../app/Socket";
import ToolTip from "../../../../../components/interface/Tooltip";
import Icon from "../../../../../components/interface/Icon";
import Navigation from "./NavigationBar";
import Chats from "./Chats";
import InputMessage from "./InputMessage";

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

function Body() {
  const [isVoiceCallVisible, setIsVoiceCallVisible] = useState<Boolean>(false);
  const [isVideoCallVisible, setIsVideoCallVisible] = useState<Boolean>(false);
  const [selectedContact, setSelectedContact] = useState<TUser>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });

  const [loadUserData, setLoadUserData] = useState<number>(0);
  const [messageLoading, setMessageLoading] = useState<Boolean>(false);

  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  useEffect(() => {
    api
      .post("api/user/profile/getById", { _id: SActiveChat?._id })
      .then((res) => {
        setSelectedContact(res.data);
      });
  }, [loadUserData, SActiveChat]);

  useEffect(() => {
    socket.on("status", (data: []) => {
      data?.forEach(
        (user: { _id: string }) =>
          user._id == SUserProfile._id && setLoadUserData(loadUserData + 1)
      );
    });
    return () => {
      socket.off("status");
    };
  }, [selectedContact]);

  return (
    <div className="dark:bg-bunker-950 h-full w-full flex flex-col relative">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <Navigation props={{ selectedContact }} />
        <Chats
          props={{
            selectedContact,
            messageLoading,
            setReplyMessage,
          }}
        />
      </div>
      <InputMessage
        props={{
          setReplyMessage,
          replyMessage,
        }}
      />
      <div className="aa absolute h-full w-full -z-1" />
      {isVoiceCallVisible ? (
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
            <img
              className="size-[16pc] rounded-md"
              src="https://getchatboot.netlify.app/assets/images/avatar/10.png"
              alt=""
            />
            <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-4 rounded-md gap-4 w-full">
              <span className="dark:text-bunker-200 text-bunker-600 text-md">
                Kunal
              </span>
              <b className="dark:text-bunker-200 text-bunker-600 text-md animate-pulse">
                Calling ...
              </b>
              <div
                onClick={() => setIsVoiceCallVisible(false)}
                className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
            <img
              className="size-[16pc] rounded-md"
              src="https://getchatboot.netlify.app/assets/images/avatar/10.png"
              alt=""
            />
            <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-4 rounded-md gap-4 w-full">
              <span className="dark:text-bunker-200 text-bunker-600 text-md">
                Kunal
              </span>
              <b className="dark:text-bunker-200 text-bunker-600 text-md animate-pulse">
                <p className="dark:text-bunker-400 text-bunker-700 flex gap-2 items-center">
                  <MdTimelapse /> 12:23
                </p>
              </b>
              <div className="flex gap-3 items-center">
                <Icon variant="transparent">
                  <MdMicOff />
                </Icon>
                <div
                  onClick={() => setIsVoiceCallVisible(false)}
                  className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
                >
                  <MdCallEnd className="text-red-500 size-6" />
                </div>
                <ToolTip
                  id="video-call"
                  className="z-10"
                  content="Switch to video call"
                >
                  <Icon variant="transparent">
                    <MdVideoCall />
                  </Icon>
                </ToolTip>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isVideoCallVisible ? (
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
            <img
              className="size-[16pc] rounded-md"
              src="https://getchatboot.netlify.app/assets/images/avatar/10.png"
              alt=""
            />
            <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-4 rounded-md gap-4 w-full">
              <span className="dark:text-bunker-200 text-bunker-600 text-md">
                Kunal
              </span>
              <b className="dark:text-bunker-200 text-bunker-600 text-md animate-pulse">
                Video Calling ...
              </b>
              <div
                onClick={() => setIsVideoCallVisible(false)}
                className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
            </div>
          </div>
          <div className="backdrop-blur-sm p-4 rounded-md flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-[45pc]">
                <img
                  className="rounded-md shadow-xl w-full"
                  src="https://themes.pixelstrap.com/chitchat/assets/images/avtar/big/videocall_bg.jpg"
                  alt=""
                />
              </div>
              <div className="absolute left-5 bottom-5">
                <img
                  className="rounded-md shadow-xl w-[10pc]"
                  src="https://themes.pixelstrap.com/chitchat/assets/images/avtar/big/videocall.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="flex relative gap-3 items-center w-full justify-center p-3 dark:bg-bunker-910 bg-bunker-100 rounded-md">
              <p className="dark:text-bunker-400 text-bunker-700 font-semibold flex gap-2 items-center absolute left-4">
                <MdTimelapse /> 12:23
              </p>
              <Icon variant="transparent">
                <MdMicOff />
              </Icon>
              <div
                onClick={() => setIsVideoCallVisible(false)}
                className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
              <Icon variant="transparent">
                <MdVideocamOff />
              </Icon>
              <p className="dark:text-bunker-400 text-bunker-700 font-semibold absolute right-4">
                Kunal lokhande
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Body;
