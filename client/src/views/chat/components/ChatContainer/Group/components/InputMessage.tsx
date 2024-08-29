import EmojiPicker from "emoji-picker-react";
import { memo, useState } from "react";
import Icon from "../../../../../../components/interface/Icon";
import {
  MdMic,
  MdSend,
  MdClose,
  MdAttachment,
  MdEmojiEmotions,
  MdAttachFile,
  MdOutlineImage,
  MdOutlineAudioFile,
  MdOutlineVideoFile,
} from "react-icons/md";
import Dropdown from "../../../../../../components/interface/Dropdown";
import { useSelector } from "react-redux";
import { TGroup, TUser } from "../../../../../../app/Types";
import socket from "../../../../../../app/Socket";
import ToolTip from "../../../../../../components/interface/Tooltip";
import UploadFilePreview from "../../components/UploadFilePreview";
import useFileUpload from "../../../../../../hooks/useFileUpload";
import VoiceRecording from "../../components/VoiceRecording";

type Props = {
  props: {
    selectedGroup: TGroup | undefined;
    replyMessage: any;
    setMessageLoading: (perms: any) => void;
    setReplyMessage: (perms: any) => void;
  };
};

function InputMessage({ props }: Props) {
  const [emojiBox, setEmojiBox] = useState<Boolean>(false);
  const [sendVoice, setSendVoice] = useState({
    visible: false,
    data: "",
  });
  const { UFiles, setUFiles, handleUpload, readerResults } = useFileUpload();
  const [message, setMessage] = useState<string>("");
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const attachmentSelectOptions = [
    {
      element: props.selectedGroup?.groupSetting?.privacy.isPhotoAllowed ? (
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
      ) : (
        <ToolTip id="upload-image-not-allowed" content="Photo is disable">
          <label className="flex gap-3 items-center opacity-70 cursor-not-allowed">
            <MdOutlineImage className="size-6" />
            Upload image
          </label>
        </ToolTip>
      ),
    },
    {
      element: props.selectedGroup?.groupSetting?.privacy.isAudioAllowed ? (
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
      ) : (
        <ToolTip id="upload-audio-not-allowed" content="Audio is disable">
          <label className="flex gap-3 items-center opacity-70 cursor-not-allowed">
            <MdOutlineAudioFile className="size-6" />
            Upload image
          </label>
        </ToolTip>
      ),
    },
    {
      element: props.selectedGroup?.groupSetting?.privacy.isVideoAllowed ? (
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
      ) : (
        <ToolTip id="upload-video-not-allowed" content="Video is disable">
          <label className="flex gap-3 items-center opacity-70 cursor-not-allowed">
            <MdOutlineVideoFile className="size-6" />
            Upload Video
          </label>
        </ToolTip>
      ),
    },
    {
      element: props.selectedGroup?.groupSetting?.privacy.isFileAllowed ? (
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
      ) : (
        <ToolTip id="upload-file-not-allowed" content="file is disable">
          <label className="flex gap-3 items-center opacity-70 cursor-not-allowed">
            <MdAttachFile className="size-6" />
            Upload file
          </label>
        </ToolTip>
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
      groupId: props.selectedGroup?._id,
      sender: SUserProfile._id,
      message: {
        file: {
          type: UFiles.fileType ? UFiles.fileType : "text",
          data: UFiles.data ? UFiles.data : "text",
        },
        text: message,
        links: extractLinks(message),
      },
      replyMessage: {
        id: props.replyMessage.data?._id,
        to: props.replyMessage.data?.sender._id,
        message: props.replyMessage.data?.message,
      },
    };

    socket.emit("sendMessage-group", Message);

    setUFiles({
      visible: { image: false, video: false, file: false },
      data: undefined,
      fileType: undefined,
    });

    setMessage("");
    setSendVoice({ visible: false, data: "" });
    if (props.replyMessage.visible) {
      props.setReplyMessage({ visible: false, data: null });
    }
  };

  function extractLinks(text: string) {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;

    const urls = text.match(urlRegex);

    return urls || [];
  }

  return (
    <div className="flex flex-row items-center justify-between p-3 sm:p-5 gap-3 dark:bg-bunker-920/50  bg-bunker-50 dark:backdrop-blur-md z-10">
      {emojiBox && (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            setMessage((pre: string) => pre + emoji.emoji);
            setEmojiBox(false);
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
        <div
          className={`absolute pl-1 bottom-[4pc] left-1 sm:bottom-[5.6pc] sm:left-3 bg-bunker-300 dark:bg-bunker-800 rounded-md ${
            props?.replyMessage.data?.message.text.length > 20
              ? "w-[14pc]"
              : "w-auto"
          }`}
        >
          <div className="border-[1px] dark:border-bunker-800 border-bunker-300 rounded-l-md p-1 bg-bunker-50 dark:bg-bunker-920 px-2 sm:p-2 sm:px-4 rounded-md">
            <div className="flex items-center gap-4 w-full justify-between">
              <h3 className="text-sm sm:text-lg font-semibold text-cyan-500 flex gap-1 items-center">
                <p className="text-xs font-normal text-bunker-700 dark:text-bunker-300">
                  Reply to
                </p>{" "}
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
            <p className="text-xs sm:text-lg font-medium text-bunker-600 dark:text-bunker-300">
              {props?.replyMessage.data?.message.text}
            </p>
          </div>
        </div>
      )}
      {sendVoice.visible && (
        <div className="absolute border-[1px] bottom-[3.8pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 !bg-bunker-100  dark:!border-bunker-700/40 rounded-md p-2 px-2 sm:p-2 sm:px-4">
          <VoiceRecording props={{ setSendVoice, setUFiles }} />
        </div>
      )}
      <div className="flex gap-3 items-center">
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
        {props.selectedGroup?.groupSetting?.privacy.isChatAllowed ? (
          <input
            type="text"
            placeholder="Type a message..."
            className="bg-transparent w-full outline-none text-bunker-400 sm:text-base text-sm"
            value={message}
            onKeyDownCapture={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sendVoice.visible}
          />
        ) : (
          <p className="text-bunker-400 cursor-not-allowed ">Chat is disable</p>
        )}
      </div>
      <div className="flex gap-3 items-center">
        <Icon onClick={sendMessage} variant="transparent">
          <MdSend />
        </Icon>
        <div className="bg-cyan-500/40 h-[2pc] w-[1px]" />
        {props.selectedGroup?.groupSetting?.privacy.isVoiceAllowed ? (
          <Icon
            onClick={() =>
              setSendVoice({ visible: !sendVoice.visible, data: "" })
            }
            variant="transparent"
          >
            <MdMic />
          </Icon>
        ) : (
          <ToolTip id="send-voice-not-allowed" content="Voice is disable">
            <Icon
              className="opacity-70 cursor-not-allowed"
              variant="transparent"
            >
              <MdMic />
            </Icon>{" "}
          </ToolTip>
        )}
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

export default memo(InputMessage);
