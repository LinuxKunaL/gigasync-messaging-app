import React, { useEffect, useRef, useState } from "react";

import {
  MdMic,
  MdSend,
  MdSearch,
  MdClose,
  MdMoreVert,
  MdAttachment,
  MdOutlineCall,
  MdEmojiEmotions,
  MdFavoriteBorder,
  MdOutlineImage,
  MdOutlineAudioFile,
  MdOutlineVideocam,
  MdOutlineVideoFile,
  MdOutlineDocumentScanner,
  MdOutlineSupervisedUserCircle,
  MdCallEnd,
  MdCall,
  MdMicExternalOff,
  MdMicOff,
  MdTimelapse,
  MdTimer10,
  MdVideoCall,
  MdVideocamOff,
  MdOutlineMessage,
  MdOutlineFileDownload,
  MdPlayArrow,
  MdDownload,
  MdTimer,
  MdOutlineAccessTime,
  MdDelete,
  MdArrowDropDown,
  MdReplay,
  MdReply,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setChatDetails, insertCurrentChatData } from "../../../app/Redux";
import EmojiPicker from "emoji-picker-react";
import Icon from "../../../components/interface/Icon";
import Dropdown from "../../../components/interface/Dropdown";
import ToolTip from "../../../components/interface/Tooltip";
import PhoneChat from "../../../assets/svgs/PhoneChat";
import Avatar from "../../../components/interface/Avatar";
import { TMessages, TUser } from "../../../app/Types";
import socket from "../../../app/Socket";
import ReactPlayer from "react-player";
import ReactHlsPlayer from "react-hls-player";
import api from "../../../utils/api";
import { toastSuccess } from "../../../app/Toast";

type Props = {};

function ChatSection({}: Props) {
  const currentChat: TUser = useSelector((state: any) => state.currentChat);
  const myProfile: TUser = useSelector((state: any) => state.UserAccountData);

  return (
    <>
      {currentChat._id ? (
        <ChatBody selectedContactId={currentChat} myProfile={myProfile} />
      ) : (
        <div className="dark:bg-bunker-950 h-full w-full flex flex-col justify-center items-center relative">
          <div className="flex gap-2 flex-col justify-center items-center">
            <PhoneChat />
            <h1 className="text-2xl font-semibold dark:text-bunker-300">
              GigaSync
            </h1>
            <p className="text-bunker-400 text-sm text-center">
              Send and receive files and messages with GigaSync app , <br /> on
              your website. fast and secure.
            </p>
          </div>
        </div>
      )}
      <div className=" fixed bg-red-500 text-white font-semibold text-3xl z-50 bottom-0 p-1">
        {myProfile.fullName}
        <br />
        {/* {myProfile._id} */}
        {/* {socket.id} */}
      </div>
    </>
  );
}

type TChatBody = {
  selectedContactId?: any;
  myProfile?: any;
};

type TUfile = {
  data?: {
    name: string;
    type: string;
    size: number;
    buffer: any;
  };
  visible: {
    image?: boolean;
    video?: boolean;
    document?: boolean;
    audio?: boolean;
  };
  fileType?: "image" | "video" | "document" | "audio";
};

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

function ChatBody({ selectedContactId, myProfile }: TChatBody) {
  const [emojiBox, setEmojiBox] = useState<Boolean>(false);
  const [isVoiceCallVisible, setIsVoiceCallVisible] = useState<Boolean>(false);
  const [isVideoCallVisible, setIsVideoCallVisible] = useState<Boolean>(false);
  const [selectedContact, setSelectedContact] = useState<TUser>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });
  const [UFiles, setUFiles] = useState<TUfile>({
    visible: {
      image: false,
      video: false,
      document: false,
      audio: false,
    },
  });
  const [chatMessages, setChatMessages] = useState<TMessages[]>([]);
  const [message, setMessage] = useState<string>("");
  const [playVideo, setPlayVideo] = useState({
    url: "",
    visible: false,
  });
  const [loadUserData, setLoadUserData] = useState<number>(0);
  const [messageLoading, setMessageLoading] = useState<Boolean>(false);
  const RSendImagePreview = useRef<HTMLImageElement>(null);
  const RSendVideoPreview = useRef<HTMLVideoElement>(null);
  const RChatBody = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/user/profile/getById", { _id: selectedContactId._id })
      .then((res) => {
        setSelectedContact(res.data);
      });
  }, [loadUserData, selectedContactId]);

  useEffect(() => {
    if (selectedContact) {
      socket.emit("selectContact", {
        me: myProfile._id,
        to: selectedContact?._id,
        socketId: socket.id,
      });
      setTimeout(() => {
        RChatBody.current?.scrollTo(0, RChatBody.current.scrollHeight);
      }, 100);
    }
    return () => {
      socket.off("selectContact");
    };
  }, [myProfile, selectedContact]);

  useEffect(() => {
    socket.on("initialMessage", (OldMessage) => {
      setChatMessages(OldMessage);
    });

    socket.on("receiveMessage", (receivedMessage) => {
      const msg = receivedMessage;

      if (
        (msg.sender._id === myProfile._id &&
          msg.receiver._id === selectedContact?._id) ||
        (msg.sender._id === selectedContact?._id &&
          msg.receiver._id === myProfile._id)
      ) {
        setChatMessages((prev) => [...prev, msg]);
        setTimeout(() => {
          RChatBody?.current?.classList.add("scroll-smooth");
          RChatBody?.current?.scrollTo(0, RChatBody.current.scrollHeight);
        }, 100);
        setMessageLoading(false);
      }
    });

    socket.on("status", (data: []) => {
      data?.forEach(
        (user: { _id: string }) =>
          user._id == myProfile._id && setLoadUserData(loadUserData + 1)
      );
    });

    return () => {
      socket.off("initialMessage");
      socket.off("receiveMessage");
      socket.off("status");
    };
  }, [selectedContact]);

  const sendMessage = () => {
    if (message === "" && UFiles.fileType === undefined) return;

    setMessageLoading(true);

    const Message = {
      me: myProfile._id,
      to: selectedContact?._id,
      message: {
        file: {
          type: UFiles.fileType ? UFiles.fileType : "text",
          data: UFiles.data ? UFiles.data : "text",
        },
        text: message,
      },
      replyMessage: {
        to: replyMessage.data?.sender._id,
        message: replyMessage.data?.message,
      },
    };

    socket.emit("sendMessage", Message);

    setUFiles({
      visible: { image: false, video: false, document: false },
      data: undefined,
      fileType: undefined,
    });

    setMessage("");
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const convertTime = (param: Date, type?: string): string => {
    if (type == "full") {
      return new Date(param).toLocaleString();
    }

    if (type == "day") {
      return new Date(param).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
    return "";
  };

  const handleUpload = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    if (file.type.includes("image")) {
      setUFiles({
        visible: {
          image: true,
          video: false,
          document: false,
          audio: false,
        },
      });

      reader.onload = () => {
        if (RSendImagePreview.current) {
          RSendImagePreview.current.src = reader.result as string;

          setUFiles({
            visible: {
              image: true,
              video: false,
              document: false,
              audio: false,
            },
            data: {
              name: file.name,
              type: file.type,
              size: file.size,
              buffer: file,
            },
            fileType: "image",
          });
        }
      };
    } else if (file.type.includes("video")) {
      setUFiles({
        visible: {
          image: false,
          video: true,
          document: false,
          audio: false,
        },
      });

      reader.onload = () => {
        if (RSendVideoPreview.current) {
          RSendVideoPreview.current.src = URL.createObjectURL(file);
          setUFiles({
            visible: {
              image: false,
              video: true,
              document: false,
              audio: false,
            },
            data: {
              name: file.name,
              type: file.type,
              size: file.size,
              buffer: file,
            },
            fileType: "video",
          });
        }
      };
    }
  };

  const downloadFile = async (link: string, filename: string) => {
    const data = await fetch(link);
    const blob = await data.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  return (
    <div className="dark:bg-bunker-950 h-full w-full flex flex-col relative">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <div
          id="chatTop"
          className="flex sticky z-20 top-0 flex-row justify-between items-center p-4 dark:bg-bunker-910/50 bg-bunker-100/50 backdrop-blur-md"
        >
          <div className="flex gap-2 items-center">
            <Avatar rounded={true} data={selectedContact} />
            <div>
              <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                {selectedContact?.fullName}
              </h1>
              <p
                className={`${
                  selectedContact?.status === "online"
                    ? "text-green-400"
                    : "text-bunker-500"
                } text-sm flex gap-2 items-center !transition-none`}
              >
                {selectedContact?.status}{" "}
                {selectedContact?.status === "offline" && (
                  <ToolTip
                    id="last-seen"
                    content={convertTime(
                      selectedContact?.lastSeen as any,
                      "full"
                    )}
                    place="bottom"
                  >
                    <MdOutlineAccessTime className="cursor-pointer text-base" />
                  </ToolTip>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Icon variant="transparent">
              <MdSearch />
            </Icon>
            <Icon
              onClick={() => setIsVideoCallVisible(!isVideoCallVisible)}
              variant="transparent"
            >
              <MdOutlineVideocam />
            </Icon>
            <Icon
              onClick={() => setIsVoiceCallVisible(!isVoiceCallVisible)}
              variant="transparent"
            >
              <MdOutlineCall />
            </Icon>
            <Icon
              onClick={() => {
                dispatch(
                  setChatDetails({
                    visible: true,
                    id: selectedContact?._id,
                  })
                );
              }}
              variant="transparent"
            >
              <MdMoreVert />
            </Icon>
            <Icon
              onClick={() => dispatch(insertCurrentChatData(null))}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        </div>
        <div
          ref={RChatBody}
          id="chatBody"
          className="flex flex-col w-full h-full p-6 relative mb-24 overflow-scroll no-scrollbar"
        >
          {chatMessages?.length > 0 ? (
            <div className="w-full h-full flex flex-col">
              {chatMessages?.map((message: TMessages) => (
                <div
                  key={message?._id}
                  className={`flex flex-row gap-4 ${
                    myProfile._id === message?.sender?._id
                      ? "flex-row-reverse"
                      : "justify-start"
                  }`}
                >
                  <Dropdown
                    options={[
                      {
                        element: (
                          <div className="flex gap-1 items-center">
                            <MdDelete /> delete
                          </div>
                        ),
                      },
                      {
                        element: (
                          <div
                            onClick={() =>
                              setReplyMessage({
                                visible: message?.message.text ? true : false,
                                data: message?.message.text ? message : null,
                              })
                            }
                            className="flex gap-1 items-center"
                          >
                            <MdReply /> reply
                          </div>
                        ),
                      },
                    ]}
                    placement="left"
                  >
                    <div
                      className={`p-3 flex flex-col gap-2 mt-3 
                          ${
                            myProfile._id === message?.sender?._id
                              ? "rounded-l-xl rounded-b-xl dark:bg-cyan-700 bg-cyan-400"
                              : "rounded-r-xl rounded-b-xl dark:bg-bunker-900 bg-bunker-100"
                          } ${
                        message.message.text.length < 30 ? "" : "w-[40pc]"
                      }`}
                    >
                      {message.message.file.type === "image" ? (
                        <div className="relative">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?messageId=${message._id}&filename=${message.message.file.name}&me=${message.sender._id}`}
                            className="w-[400px] h-[400px] object-cover rounded-md"
                          />
                          <div
                            onClick={() =>
                              downloadFile(
                                `${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?messageId=${message._id}&filename=${message.message.file.name}&me=${message.sender._id}`,
                                message.message.file.name as string
                              )
                            }
                            className={`absolute ${
                              myProfile._id === message?.sender?._id
                                ? "bg-cyan-700"
                                : "bg-bunker-900"
                            }  text-white p-3 cursor-pointer rounded-bl-md top-0 right-0`}
                          >
                            <MdOutlineFileDownload />
                          </div>
                        </div>
                      ) : message.message.file.type === "video" ? (
                        <div className="relative rounded-md overflow-hidden">
                          <video
                            src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageVideo/user-${message.sender._id}/videos/${message.message.file.name}`}
                            contextMenu="none"
                            controls={false}
                            className="blur-sm h-[14pc] w-full object-cover rounded-md"
                            muted
                          />
                          <MdPlayArrow
                            onClick={() => {
                              setPlayVideo({
                                visible: true,
                                url: `${process.env.REACT_APP_BACKEND_HOST}/api/default/messageVideo/user-${message.sender._id}/videos/${message.message.file.name}`,
                              });
                            }}
                            className="size-10 p-1 cursor-pointer rounded-full text-white bg-cyan-600 absolute z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
                      ) : null}
                      {message.replyMessage ? (
                        <div
                          className={`${
                            myProfile._id === message?.sender?._id
                              ? "bg-cyan-600"
                              : "dark:bg-bunker-700 bg-bunker-200"
                          } ${
                            message.replyMessage.message.text.length < 30
                              ? ""
                              : "w-[40pc]"
                          }  p-2 rounded-md`}
                        >
                          <h3 className="text-base font-semibold dark:text-bunker-200 text-bunker-500">
                            {message.replyMessage.to.fullName}
                          </h3>
                          <p className="text-base dark:text-bunker-300 text-bunker-600">
                            {message.replyMessage.message.text}
                          </p>
                        </div>
                      ) : null}
                      <p className="w-[400px] contents dark:text-bunker-200 text-bunker-700">
                        {message.message.text}
                        <span className="dark:text-bunker-200/70 text-bunker-600 text-xs">
                          {convertTime(message?.timestamp as any, "day")}
                        </span>
                      </p>
                    </div>
                  </Dropdown>
                </div>
              ))}
              {messageLoading ? (
                <div className="flex gap-4 flex-row-reverse">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4 items-center flex-row-reverse"></div>
                    <div className="p-1 flex flex-col gap-2 rounded-l-xl rounded-b-xl dark:bg-cyan-700 bg-cyan-400">
                      <p className="w-[400px] contents dark:text-bunker-200 text-bunker-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-14 ml-3"
                          viewBox="0 0 200 200"
                        >
                          <circle
                            fill="#00c2dc"
                            stroke="#00c2dc"
                            strokeWidth={18}
                            r={15}
                            cx={40}
                            cy={100}
                          >
                            <animate
                              attributeName="opacity"
                              calcMode="spline"
                              dur="1.1"
                              values="1;0;1;"
                              keySplines=".5 0 .5 1;.5 0 .5 1"
                              repeatCount="indefinite"
                              begin="-.4"
                            />
                          </circle>
                          <circle
                            fill="#00c2dc"
                            stroke="#00c2dc"
                            strokeWidth={18}
                            r={15}
                            cx={100}
                            cy={100}
                          >
                            <animate
                              attributeName="opacity"
                              calcMode="spline"
                              dur="1.1"
                              values="1;0;1;"
                              keySplines=".5 0 .5 1;.5 0 .5 1"
                              repeatCount="indefinite"
                              begin="-.2"
                            />
                          </circle>
                          <circle
                            fill="#00c2dc"
                            stroke="#00c2dc"
                            strokeWidth={18}
                            r={15}
                            cx={160}
                            cy={100}
                          >
                            <animate
                              attributeName="opacity"
                              calcMode="spline"
                              dur="1.1"
                              values="1;0;1;"
                              keySplines=".5 0 .5 1;.5 0 .5 1"
                              repeatCount="indefinite"
                              begin={0}
                            />
                          </circle>
                        </svg>
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
                with {selectedContact?.fullName}
              </p>
            </div>
          )}
        </div>
        {playVideo.visible ? (
          <div className="absolute flex flex-col gap-5 justify-center items-center left-0 right-0 bottom-0 h-full w-full bg-bunker-950/80">
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
      <div
        id="messageInput"
        className="flex absolute !bottom-4 left-4 right-4 flex-row items-center justify-between p-3 gap-3 border-[1px] border-cyan-500/40 dark:bg-bunker-900/50 backdrop-blur-sm rounded-md z-10"
      >
        {emojiBox ? (
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setMessage(message + emoji.emoji);
              setEmojiBox(false);
            }}
            searchDisabled
            skinTonesDisabled
            className="z-10 !absolute bottom-[5pc] right-5 dark:!bg-bunker-900 !border-cyan-500/40 "
          />
        ) : null}
        {UFiles.visible.image ? (
          <div className="absolute h-[25pc] border-2 bottom-[5pc] dark:!bg-bunker-900 !border-cyan-500/40 rounded-md p-1">
            <Icon
              onClick={() =>
                setUFiles({
                  visible: {
                    image: false,
                    video: false,
                    document: false,
                  },
                })
              }
              className="absolute top-3 right-3"
              variant="filled"
            >
              <MdClose />
            </Icon>
            <img
              src=""
              alt=""
              className="w-full h-full rounded-md"
              ref={RSendImagePreview}
            />
          </div>
        ) : null}
        {UFiles.visible.video ? (
          <div className="absolute h-[25pc] border-2 bottom-[5pc] dark:!bg-bunker-900 !border-cyan-500/40 rounded-md p-1">
            <Icon
              onClick={() =>
                setUFiles({
                  visible: {
                    image: false,
                    video: false,
                    document: false,
                  },
                })
              }
              className="absolute top-3 right-3 z-10"
              variant="filled"
            >
              <MdClose />
            </Icon>
            <video
              src=""
              className="w-full h-full rounded-md"
              controls
              autoPlay={false}
              ref={RSendVideoPreview}
            />
          </div>
        ) : null}
        {replyMessage.visible ? (
          <div className="absolute border-2 left-0 bottom-[4.5pc] dark:!bg-bunker-900 !border-cyan-500/40 rounded-md p-2 border-l-8 ">
            <div className="flex items-center gap-4 w-full justify-between">
              <h3 className="text-lg font-semibold text-cyan-500">
                {replyMessage.data?.sender.fullName}
              </h3>
              <MdClose
                className="text-cyan-500 cursor-pointer"
                onClick={() => setReplyMessage({ visible: false, data: null })}
              />
            </div>

            <p className="text-lg text-bunker-300">
              {replyMessage.data?.message.text}
            </p>
          </div>
        ) : null}
        <div className="flex gap-3 items-center">
          <Dropdown
            options={[
              {
                element: (
                  <label
                    htmlFor="upload-image"
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <input
                      type="file"
                      id="upload-image"
                      accept="image/*"
                      onChange={handleUpload}
                      hidden
                    />
                    <MdOutlineImage className="size-6" />
                    Upload image
                  </label>
                ),
              },
              {
                element: (
                  <label
                    htmlFor="upload-audio"
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <MdOutlineAudioFile className="size-6" />
                    Upload Audios
                  </label>
                ),
              },
              {
                element: (
                  <label
                    htmlFor="upload-video"
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <input
                      type="file"
                      id="upload-video"
                      accept="video/*"
                      onChange={handleUpload}
                      hidden
                    />
                    <MdOutlineVideoFile className="size-6" />
                    Upload Video
                  </label>
                ),
              },
              {
                element: (
                  <div className="flex gap-3 items-center cursor-pointer">
                    <MdOutlineDocumentScanner className="size-6" />
                    Upload Document
                  </div>
                ),
              },
            ]}
            placement="top"
          >
            <Icon variant="transparent">
              <MdAttachment />
            </Icon>
          </Dropdown>
          <input
            type="text"
            placeholder="Type a message..."
            className="bg-transparent outline-none p-2 text-bunker-400"
            onKeyDownCapture={handleKeyDown}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex gap-3 items-center">
          <Icon onClick={sendMessage} variant="transparent">
            <MdSend />
          </Icon>

          <div className="bg-cyan-500/40 h-[2pc] w-[1px]" />
          <Icon variant="transparent">
            <MdMic />
          </Icon>
          <Icon
            onClick={() => setEmojiBox(!emojiBox)}
            active={emojiBox}
            variant="transparent"
          >
            <MdEmojiEmotions />
          </Icon>
        </div>
      </div>
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

export default ChatSection;
