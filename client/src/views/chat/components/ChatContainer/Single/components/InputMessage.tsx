import EmojiPicker from "emoji-picker-react";
import {  useState } from "react";
import Icon from "../../../../../../components/interface/Icon";
import {
  MdMic,
  MdSend,
  MdClose,
  MdAttachment,
  MdAttachFile,
  MdEmojiEmotions,
  MdOutlineImage,
  MdOutlineAudioFile,
  MdOutlineVideoFile,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { TUser } from "../../../../../../app/Types";

import socket from "../../../../../../app/Socket";
import Dropdown from "../../../../../../components/interface/Dropdown";
import UploadFilePreview from "../../components/UploadFilePreview";
import useFileUpload from "../../../../../../hooks/useFileUpload";
import VoiceRecording from "../../components/VoiceRecording";

type Props = {
  props: {
    isBlockedForMe: Boolean | undefined;
    isBlockedForUser: Boolean | undefined;
    replyMessage: any;
    setReplyMessage: (perms: any) => void;
    setMessageLoading: (perms: any) => void;
  };
};

function InputMessage({ props }: Props) {
  const [emojiBox, setEmojiBox] = useState<Boolean>(false);
  const [sendVoice, setSendVoice] = useState({
    visible: false,
    data: "",
  });
  const [message, setMessage] = useState<string>("");
  const { UFiles, setUFiles, handleUpload, readerResults } = useFileUpload();
  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const attachmentSelectOptions = [
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
          <input
            type="file"
            id="upload-audio"
            accept="audio/*"
            onChange={handleUpload}
            hidden
          />
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
        <label
          htmlFor="upload-file"
          className="flex gap-3 items-center cursor-pointer"
        >
          <input
            type="file"
            id="upload-file"
            accept=""
            onChange={handleUpload}
            hidden
          />
          <MdAttachFile className="size-6" />
          Upload file
        </label>
      ),
    },
  ];

  const handleKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message === "" && UFiles.fileType === undefined) return;

    props.setMessageLoading(true);

    const Message = {
      me: SUserProfile?._id,
      to: SActiveChat?._id,
      message: {
        file: {
          type: UFiles.fileType ? UFiles.fileType : "text",
          data: UFiles.data ? UFiles.data : "text",
        },
        text: message,
        links: extractLinks(message),
      },
      replyMessage: {
        to: props.replyMessage.data?.sender._id,
        message: props.replyMessage.data?.message,
      },
    };

    socket.emit("sendMessage", Message);

    setUFiles({
      visible: { image: false, video: false, file: false },
      data: undefined,
      fileType: undefined,
    });

    setMessage("");
    setSendVoice({ visible: false, data: "" });
    props.setReplyMessage({ visible: false, data: null });
  };

  const extractLinks = (text: string) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;

    const urls = text.match(urlRegex);

    return urls || [];
  };

  return !props.isBlockedForMe && !props.isBlockedForUser ? (
    <div className="flex flex-row items-center justify-between p-3 sm:p-5 gap-3 dark:bg-bunker-920/50  bg-bunker-50 dark:backdrop-blur-md z-10">
      {emojiBox && (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            setMessage((pre: string) => pre + emoji.emoji);
          }}
          skinTonesDisabled
          className="z-10 xs:scale-100 bottom-[2pc] -right-4 scale-[85%] !absolute xs:bottom-[3.9pc] xs:right-2 sm:bottom-[5pc] sm:right-5 dark:!bg-bunker-900 !border-cyan-500/40 "
        />
      )}
      <UploadFilePreview
        UFiles={UFiles}
        readerResults={readerResults}
        setUFiles={setUFiles}
      />
      {props?.replyMessage.visible && (
        <div className="absolute border-[1px] bottom-[3.8pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 !border-bunker-700/40 !border-cyan-500/40s rounded-md p-1 px-2 sm:p-2 sm:px-4 border-l-8">
          <div className="flex relative items-center gap-4 w-full justify-between">
            <h3 className="text-sm sm:text-lg font-semibold text-cyan-500">
              {props?.replyMessage.data?.sender.fullName}
            </h3>
            <div
              onClick={() =>
                props?.setReplyMessage({ visible: false, data: null })
              }
              className="relative cursor-pointer -top-[5px] -right-[9px] sm:-top-2 sm:-right-4 bg-cyan-600 rounded-tr-md rounded-bl-md text-bunker-50 z-10 p-1 sm:p-2"
            >
              <MdClose />
            </div>
          </div>
          <p className="text-xs sm:text-lg text-bunker-300">
            {props?.replyMessage.data?.message.text}
          </p>
        </div>
      )}
      {sendVoice.visible && (
        <div className="absolute border-[1px] bottom-[3.8pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 !border-bunker-700/40 rounded-md p-2 px-2 sm:p-2 sm:px-4">
          <VoiceRecording props={{ setSendVoice, setUFiles }} />
        </div>
      )}
      <div className="flex gap-3 items-center p">
        <Dropdown
          options={attachmentSelectOptions}
          placement="bottom"
          className="bottom-14 -left-1 sm:bottom-16 sm:-left-3"
          disabled={sendVoice.visible}
        >
          <Icon variant="transparent">
            <MdAttachment />
          </Icon>
        </Dropdown>
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-transparent w-full outline-none text-bunker-400 sm:text-base text-sm"
          value={message}
          onKeyDownCapture={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sendVoice.visible}
        />
      </div>
      <div className="flex gap-3 items-center">
        <Icon onClick={sendMessage} variant="transparent">
          <MdSend />
        </Icon>
        <div className="bg-cyan-500/40 h-[2pc] w-[1px]" />
        <Icon
          onClick={() =>
            setSendVoice({ visible: !sendVoice.visible, data: "" })
          }
          variant="transparent"
        >
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
  ) : (
    <div className="flex cursor-not-allowed sm:h-20 items-center justify-center p-3 sm:p-5 gap-3 dark:bg-bunker-920/50  bg-bunker-50 backdrop-blur-md z-10">
      <h1 className="text-bunker-300">
        {props.isBlockedForUser
          ? "This user has blocked you"
          : "You have blocked this user"}
      </h1>
    </div>
  );
}

export default InputMessage;
