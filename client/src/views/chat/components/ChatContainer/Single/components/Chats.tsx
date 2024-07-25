import { memo, useEffect, useRef, useState } from "react";
import { TMessages, TUser } from "../../../../../../app/Types";
import { MdClose, MdDownload, MdOutlineMessage } from "react-icons/md";
import { useSelector } from "react-redux";

import LoadingAnimation from "../../../../../../assets/svgs/LoadingAnimation";
import Icon from "../../../../../../components/interface/Icon";
import Message from "./Message";
import socket from "../../../../../../app/Socket";
import ReactPlayer from "react-player";

type Props = {
  props: {
    selectedContact: TUser | undefined;
    messageLoading: Boolean;
    setReplyMessage: (param: any) => void;
  };
};

function Chats({ props }: Props) {
  const [playVideo, setPlayVideo] = useState({
    url: "",
    visible: false,
  });
  const [chatMessages, setChatMessages] = useState<TMessages[]>([]);
  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const RChatBody = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("initialMessage", (OldMessage) => {
      setChatMessages(OldMessage);
    });

    socket.on("receiveMessage", (receivedMessage) => {
      const msg = receivedMessage;

      if (
        (msg.sender._id === SUserProfile?._id &&
          msg.receiver._id === SActiveChat?._id) ||
        (msg.sender._id === SActiveChat?._id &&
          msg.receiver._id === SUserProfile?._id)
      ) {
        setChatMessages((prev) => [...prev, msg]);
        setTimeout(() => {
          RChatBody?.current?.classList.add("scroll-smooth");
          RChatBody?.current?.scrollTo(0, RChatBody.current.scrollHeight);
        }, 100);
        // setMessageLoading(false);
      }
    });

    return () => {
      socket.off("initialMessage");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (props?.selectedContact) {
      socket.emit("selectContact", {
        me: SUserProfile?._id,
        to: SActiveChat?._id,
        socketId: socket.id,
      });
      setTimeout(() => {
        RChatBody.current?.scrollTo(0, RChatBody.current.scrollHeight);
      }, 100);
    }
    return () => {
      socket.off("selectContact");
    };
  }, [SUserProfile, props?.selectedContact]);

  const downloadFile = async (link: string, filename: string) => {
    const data = await fetch(link);
    const blob = await data.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-col w-full h-full relative mb-24 overflow-hidden">
      {chatMessages?.length > 0 ? (
        <div
          ref={RChatBody}
          className="w-full h-full flex flex-col gap-5 overflow-y-auto no-scrollbar px-6"
        >
          {chatMessages?.map((message: TMessages) => (
            <Message
              props={{
                message,
                setReplyMessage: props?.setReplyMessage,
                downloadFile,
                setPlayVideo,
              }}
            />
          ))}
          {props?.messageLoading ? (
            <div className="flex gap-4 flex-row-reverse">
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-center flex-row-reverse"></div>
                <div className="p-1 flex flex-col gap-2 rounded-l-xl rounded-b-xl dark:bg-cyan-700 bg-cyan-400">
                  <p className="w-[400px] contents dark:text-bunker-200 text-bunker-700">
                    <LoadingAnimation />
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon variant="transparent">
            <MdOutlineMessage />
          </Icon>
          <p className="text-bunker-400 text-sm">No messages yet</p>
          <p className="text-bunker-400 text-sm">Start a conversation</p>
          <p className="text-cyan-400 text-sm">
            with {props?.selectedContact?.fullName}
          </p>
        </div>
      )}
      {playVideo.visible ? (
        <div className="absolute top-0 flex flex-col gap-5 justify-center items-center left-0 right-0 bottom-0 h-full w-full bg-bunker-950/80">
          <div className="flex gap-2">
            <Icon variant="transparent">
              <MdDownload />
            </Icon>
            <Icon
              onClick={() => setPlayVideo({ visible: false, url: "" })}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
          <div className="border-cyan-500 border-2 rounded-lg overflow-hidden w-[30pc]s w-auto h-[40pc] h-[10pc]d">
            <ReactPlayer
              height={"100%"}
              width={"100%"}
              url={playVideo.url}
              controls
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(Chats);
