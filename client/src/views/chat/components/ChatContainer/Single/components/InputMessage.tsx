import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import Icon from "../../../../../../components/interface/Icon";
import {
  MdMic,
  MdSend,
  MdClose,
  MdAttachment,
  MdEmojiEmotions,
  MdOutlineImage,
  MdOutlineAudioFile,
  MdOutlineVideoFile,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import Dropdown from "../../../../../../components/interface/Dropdown";
import { useSelector } from "react-redux";
import { TUser } from "../../../../../../app/Types";
import socket from "../../../../../../app/Socket";

type Props = {
  props: {
    replyMessage: any;
    setReplyMessage: (perms: any) => void;
  };
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

function InputMessage({ props }: Props) {
  const [emojiBox, setEmojiBox] = useState<Boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [UFiles, setUFiles] = useState<TUfile>({
    visible: {
      image: false,
      video: false,
      document: false,
      audio: false,
    },
  });
  
  const RSendImagePreview = useRef<HTMLImageElement>(null);
  const RSendVideoPreview = useRef<HTMLVideoElement>(null);

  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  const handleKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
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

  const sendMessage = () => {
    if (message === "" && UFiles.fileType === undefined) return;

    // setMessageLoading(true);

    const Message = {
      me: SUserProfile?._id,
      to: SActiveChat?._id,
      message: {
        file: {
          type: UFiles.fileType ? UFiles.fileType : "text",
          data: UFiles.data ? UFiles.data : "text",
        },
        text: message,
      },
      replyMessage: {
        to: props.replyMessage.data?.sender._id,
        message: props.replyMessage.data?.message,
      },
    };

    socket.emit("sendMessage", Message);

    setUFiles({
      visible: { image: false, video: false, document: false },
      data: undefined,
      fileType: undefined,
    });

    setMessage("");

    props.setReplyMessage({ visible: false, data: null });
  };

  return (
    <div className="flex absolute !bottom-4 left-4 right-4 flex-row items-center justify-between p-3 gap-3 border-[1px] border-cyan-500/40 dark:bg-bunker-900/50 backdrop-blur-sm rounded-md z-10">
      {emojiBox ? (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            setMessage((pre: string) => pre + emoji.emoji);
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
      {props?.replyMessage.visible ? (
        <div className="absolute border-2 left-0 bottom-[4.5pc] dark:!bg-bunker-900 !border-cyan-500/40 rounded-md p-2 border-l-8 ">
          <div className="flex items-center gap-4 w-full justify-between">
            <h3 className="text-lg font-semibold text-cyan-500">
              {props?.replyMessage.data?.sender.fullName}
            </h3>
            <MdClose
              className="text-cyan-500 cursor-pointer"
              onClick={() =>
                props?.setReplyMessage({ visible: false, data: null })
              }
            />
          </div>

          <p className="text-lg text-bunker-300">
            {props?.replyMessage.data?.message.text}
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
          placement="bottom"
          className="bottom-16"
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
  );
}

export default InputMessage;
