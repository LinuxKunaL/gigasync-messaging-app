import { act, Fragment, memo, useEffect, useRef, useState } from "react";
import { TMessages, TUser } from "../../../../../../app/Types";
import {
  MdClose,
  MdCopyAll,
  MdDelete,
  MdDownload,
  MdLocationSearching,
  MdOutlineMessage,
  MdReplay,
  MdReply,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import LoadingAnimation from "../../../../../../assets/svgs/LoadingAnimation";
import Icon from "../../../../../../components/interface/Icon";
import Message from "./Message";
import socket from "../../../../../../app/Socket";
import LongPressButton from "../../../../../../components/interface/LongPress";
import { toastSuccess } from "../../../../../../app/Toast";
import {
  insertCurrentChatData,
  setChatDetails,
} from "../../../../../../app/Redux";
import VideoPlayer from "../../../../../../components/interface/VideoPlayer";
import ActionMenu from "../../components/ActionMenu";

type Props = {
  props: {
    isSearchVisible: boolean;
    selectedContact: TUser | undefined;
    messageLoading: Boolean;
    setReplyMessage: (param: any) => void;
    setMessageLoading: (param: any) => void;
    setIsSearchVisible: (param: any) => void;
  };
};

function Chats({ props }: Props) {
  const [playVideo, setPlayVideo] = useState({
    url: "",
    visible: false,
  });
  const [chatMessages, setChatMessages] = useState<TMessages[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [foundMessages, setFoundMessages] = useState<TMessages[]>([]);
  const [actionMenu, setActionMenu] = useState<{
    visible: Boolean;
    message?: TMessages;
  }>({
    visible: false,
  });
  const [count, setCount] = useState<number>(0);
  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const RChatBody = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    RChatBody?.current?.classList.add("scroll-smooth");
    RChatBody?.current?.scrollTo(0, RChatBody.current.scrollHeight);
  }, [props.messageLoading]);

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
        props.setMessageLoading(false);
      }
    });

    socket.on("refreshBlockedUser", (userId) => {
      if (userId === SActiveChat?._id) {
        dispatch(insertCurrentChatData(null));
        dispatch(
          setChatDetails({
            visible: false,
            id: null,
          })
        );
      }
    });

    return () => {
      socket.off("initialMessage");
      socket.off("receiveMessage");
      socket.off("refreshBlockedUser");
    };
  }, []);

  useEffect(() => {
    const searched = chatMessages.filter((message) => {
      if (searchMessage != "") {
        return message.message.text
          .toLocaleLowerCase()
          .includes(searchMessage.toLocaleLowerCase());
      }
    });
    setFoundMessages(searched);
  }, [searchMessage]);

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

  const handlePointMessage = () => {
    const foundMessage = document.getElementById(
      foundMessages[count]?._id as string
    );
    foundMessage?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });

    if (foundMessage) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(foundMessage);
      selection?.removeAllRanges();
      selection?.addRange(range);
      foundMessage.classList.toggle("animate-point");
      setCount((count) => count + 1);
      if (count === foundMessages.length - 1) {
        setCount(0);
        setFoundMessages([]);
        setSearchMessage("");
        setTimeout(() => {
          props?.setIsSearchVisible(false);
        }, 2000);
      }
    }
  };

  const handleLongPress = (message: TMessages): any => {
    navigator.vibrate(100);
    const pressedMessage = document.getElementById(message._id as string);
    if (pressedMessage) {
      pressedMessage?.classList?.remove("animate-fade-in");
      pressedMessage?.classList?.add("animate-point");
      setTimeout(() => {
        pressedMessage?.classList?.remove("animate-point");
      }, 800);
      setActionMenu({
        visible: true,
        message,
      });
    }
  };

  const handleDeleteMessage = () => {
    socket.emit("deleteMessage", {
      messageId: actionMenu.message?._id,
      receiver: actionMenu.message?.receiver._id,
      sender: actionMenu.message?.sender._id,
    });
    toastSuccess("Message deleted");
  };

  const calculateMessageDisplay = (message: TMessages, index: number) => {
    const currentMessageDate = new Date(
      message?.timestamp as any
    ).toLocaleString("default", { month: "long", day: "numeric" });

    const previousMessageDate =
      index > 0
        ? new Date(chatMessages[index - 1]?.timestamp as any).toLocaleString(
            "default",
            { month: "long", day: "numeric" }
          )
        : null;

    const showDate = currentMessageDate !== previousMessageDate;
    const isSamePrevious =
      index > 0 &&
      message?.sender?._id === chatMessages[index - 1]?.sender?._id;

    return { showDate, isSamePrevious, currentMessageDate };
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {props?.isSearchVisible && (
        <div className="absolute left-0 p-2 dark:bg-bunker-920/60 bg-bunker-200/70 sm:p-2 w-full z-20 flex justify-between items-center animate-fade-in backdrop-blur-md">
          <div className="dark:bg-bunker-920 bg-bunker-50 backdrop-blur-mds p-1 w-full sm:p-3 rounded-lg flex justify-between items-center">
            <input
              className="bg-transparent p-1 text-bunker-800 dark:text-bunker-100 outline-none w-[8pc] sm:text-base text-sm"
              placeholder="Search chat"
              onChange={(e) => setSearchMessage(e.target.value)}
            />
            <div className="flex flex-row gap-2 items-center">
              <div className="flex gap-2 text-bunker-800 dark:text-bunker-100 text-sm">
                <p>{chatMessages.length}</p>
                <p>of</p>
                <p>{foundMessages.length}</p>
              </div>
              <Icon variant="transparent">
                <MdLocationSearching
                  onClick={handlePointMessage}
                  className="text-lg dark:text-bunker-50 cursor-pointer"
                />
              </Icon>
            </div>
          </div>
        </div>
      )}
      {actionMenu.visible && (
        <ActionMenu
          props={props}
          RChatBody={RChatBody}
          actionMenu={actionMenu}
          setActionMenu={setActionMenu}
          SUserProfile={SUserProfile}
          handleDeleteMessage={handleDeleteMessage}
        />
      )}
      {chatMessages?.length > 0 ? (
        <div
          ref={RChatBody}
          className="w-full h-full flex flex-col gap-2 sm:gap-5 overflow-y-auto no-scrollbar px-3 py-2 sm:px-6 sm:py-4"
        >
          {chatMessages?.map((message: TMessages, index: number) => {
            const { isSamePrevious, showDate, currentMessageDate } =
              calculateMessageDisplay(message, index);
            return (
              <LongPressButton
                onLongPress={() => handleLongPress(message)}
                delay={400}
              >
                <div
                  className="flex flex-col gap-3"
                  key={message?._id || index}
                >
                  {showDate && (
                    <p className="text-center dark:bg-bunker-910/40 backdrop-blur-[2px] bg-bunker-100 z-10 sticky top-0 py-1 px-3 rounded-md w-max text-xs dark:text-bunker-300 text-bunker-600 font-medium m-auto">
                      {currentMessageDate}
                    </p>
                  )}
                  <Message
                    props={{
                      message,
                      setPlayVideo,
                      isSamePrevious,
                      setReplyMessage: props?.setReplyMessage,
                      isOwnMessage: message?.sender?._id === SUserProfile?._id,
                    }}
                  />
                </div>
              </LongPressButton>
            );
          })}
          {props?.messageLoading && (
            <div className="flex gap-4 flex-row-reverse">
              <div className="p-1 flex flex-col gap-2 rounded-xl dark:bg-cyan-700 bg-cyan-400">
                <p className="w-[8pc] flex gap-1 items-center justify-evenly text-bunker-200">
                  <LoadingAnimation />
                  <p className="sm:text-base text-xs">sending...</p>
                </p>
              </div>
            </div>
          )}
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
      {playVideo.visible && (
        <div className="absolute p-2 z-10 top-0 flex flex-col gap-5 justify-center items-center left-0 right-0 bottom-0 h-full w-full bg-bunker-950/80">
          <div className="relative">
            <div
              onClick={() => setPlayVideo({ visible: false, url: "" })}
              className="absolute cursor-pointer -top-0 -right-0 bg-cyan-600 rounded-tr-md rounded-bl-md text-bunker-50 z-10 p-2"
            >
              <MdClose />
            </div>
            <VideoPlayer src={playVideo.url} />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Chats);
