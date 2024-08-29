import {
  MdDownload,
  MdAttachFile,
  MdPlayArrow,
  MdOutlineFileDownload,
} from "react-icons/md";
import { TMessages } from "../../../../../../app/Types";

import convertTime from "../../../../../../utils/ConvertTime";
import Audio from "../../../../../../components/interface/Audio";
import WaveAudio from "../../../../../../components/interface/WaveAudio";
import ToolTip from "../../../../../../components/interface/Tooltip";
import MessageCorner from "../../../../../../assets/svgs/MessageCorner";
import downloadFile from "../../../../../../utils/DownloadFile";

type Props = {
  props: {
    message: TMessages;
    isOwnMessage: boolean;
    isSamePrevious: boolean;
    setReplyMessage: (param: any) => void;
    setPlayVideo: (param: any) => void;
  };
};

function Message({ props }: Props) {
  return (
    <div
      className={`flex flex-col relative select-none animate-fade-in ${
        props.isOwnMessage ? "flex-row-reverse" : "justify-start"
      }`}
      id={props.message?._id}
    >
      <div
        className={`flex flex-col gap-1 relative ${
          props.isOwnMessage
            ? "flex-row-reverse self-end"
            : "justify-start self-start"
        }`}
      >
        {!props.isSamePrevious && (
          <MessageCorner isOwnMessage={props.isOwnMessage} />
        )}
        <div
          className={`relative p-2 sm:p-4 rounded-b-xl flex flex-col gap-2 overflow-hidden
                    ${
                      props.isOwnMessage
                        ? " rounded-l-lg dark:bg-cyan-700 bg-cyan-400 self-end"
                        : "rounded-r-lg dark:bg-bunker-900 bg-bunker-100 self-start"
                    } ${props.isSamePrevious && "rounded-r-lg rounded-l-lg"}`}
        >
          {props.message?.message.file.type === "image" && (
            <div className="relative w-48 sm:w-auto">
              <img
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/images/${props.message?.message.file.name}`}
                className="sm:w-[400px] sm:h-[400px] object-cover rounded-md"
              />
              <div
                onClick={() =>
                  downloadFile(
                    `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/images/${props.message?.message.file.name}`,
                    props.message?.message.file.name as string
                  )
                }
                className={`absolute ${
                  props.isOwnMessage
                    ? "dark:bg-cyan-700 bg-cyan-400 text-white"
                    : "dark:bg-bunker-900 bg-bunker-200s text-bunker-800 "
                }  dark:text-white p-3 cursor-pointer rounded-bl-md top-0 right-0`}
              >
                <MdOutlineFileDownload />
              </div>
            </div>
          )}
          {props.message?.message.file.type === "video" && (
            <div className="relative rounded-md overflow-hidden">
              <video
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/videos/${props.message?.message.file.name}`}
                contextMenu="none"
                controls={false}
                className="blur-sm h-[14pc] w-full object-cover rounded-md"
                muted
              />
              <MdPlayArrow
                onClick={() => {
                  props?.setPlayVideo({
                    visible: true,
                    url: `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/videos/${props.message?.message.file.name}`,
                  });
                }}
                className="size-10 p-1 cursor-pointer rounded-full text-white bg-cyan-600 absolute z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          )}
          {props.message?.message.file.type === "audio" && (
            <>
              <Audio
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/audios/${props.message?.message.file.name}`}
                fileName={props.message?.message.file.name as string}
                variant={props.isOwnMessage ? "sender" : "receiver"}
                className="!h-auto"
              />
            </>
          )}
          {props.message?.message.file.type === "recording" && (
            <>
              <WaveAudio
                id={props.message?._id as string}
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/recordings/${props.message?.message.file.name}`}
                variant={props.isOwnMessage ? "sender" : "receiver"}
              />
            </>
          )}
          {props.message?.message.file.type === "file" && (
            <ToolTip
              id={props.message?._id as string}
              content={props.message?.message.file.name as string}
            >
              <div
                className={`p-3 cursor-pointer ${
                  props.isOwnMessage
                    ? "dark:bg-cyan-600 bg-cyan-500/50 dark:text-bunker-50 text-bunker-50"
                    : "dark:bg-bunker-700 bg-bunker-200 dark:text-bunker-50 text-bunker-700"
                } rounded-md flex flex-row gap-2 items-center`}
              >
                <MdAttachFile />
                <p className="w-[8pc] sm:text-base text-xs truncate">
                  {props.message?.message.file.name &&
                    props.message?.message.file.name.slice(14)}
                </p>
                <MdDownload
                  onClick={() =>
                    downloadFile(
                      `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props.message?.sender._id}/files/${props.message?.message.file.name}`,
                      props.message?.message.file.name as string
                    )
                  }
                />
              </div>
            </ToolTip>
          )}
          {props.message?.replyMessage && (
            <div
              className={`${
                props.isOwnMessage
                  ? "bg-cyan-600/70"
                  : "dark:bg-bunker-700/70 bg-bunker-200"
              } ${
                props.message?.replyMessage.message.text.length < 30
                  ? "w-[10pc]"
                  : "w-[40pc]"
              }  p-1.5 sm:p-2 rounded-md`}
            >
              <h3 className="text-sm sm:text-base font-semibold dark:text-bunker-200 text-bunker-500">
                {props.message?.replyMessage.to.fullName}
              </h3>
              <p className="text-sm sm:text-base dark:text-bunker-300 text-bunker-600">
                {props.message?.replyMessage.message.text}
              </p>
            </div>
          )}
          {props.message?.message.file.type !== "text" &&
            props.message?.message.file.type !== "del" &&
            !props.message.message.text && <div className="w-14 h-3.5" />}
          {props.message.message.text && (
            <p
              className={`dark:text-bunker-200 text-sm sm:text-base flex gap-1 ${
                props.message?.message.file.type === "del" &&
                "opacity-70 italic"
              } ${props.isOwnMessage ? "text-bunker-50" : "text-bunker-700"} ${
                props.message?.message.text.length > 30 && "w-[15.2pc]"
              }`}
            >
              {props.message?.message.text}
              <div className="w-14" />
            </p>
          )}
          <p
            className={`text-xs rounded-md backdrop-blur-sm px-0.5 absolute bottom-2 font-normal dark:text-bunker-300  
                 ${
                   props.isOwnMessage ? "text-bunker-100" : "text-bunker-600"
                 } self-end translate-y-1`}
          >
            {convertTime(props.message?.timestamp as any, "day")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Message;
