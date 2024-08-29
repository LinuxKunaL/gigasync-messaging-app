import {
  MdAttachFile,
  MdDownload,
  MdPlayArrow,
  MdOutlineFileDownload,
} from "react-icons/md";
import { TMessages } from "../../../../../../app/Types";
import convertTime from "../../../../../../utils/ConvertTime";
import Avatar from "../../../../../../components/interface/Avatar";
import Audio from "../../../../../../components/interface/Audio";
import WaveAudio from "../../../../../../components/interface/WaveAudio";
import ToolTip from "../../../../../../components/interface/Tooltip";
import MessageCorner from "../../../../../../assets/svgs/MessageCorner";
import downloadFile from "../../../../../../utils/DownloadFile";

type Props = {
  props: {
    message: TMessages;
    isSamePrevious: boolean;
    isOwnMessage: boolean;
    groupId: string | undefined;
    handlePointReplyMessage: (param: any) => void;
    setPlayVideo: (param: any) => void;
  };
};

function Message({ props }: Props) {
  return (
    <div
      key={props.message?._id}
      id={props.message?._id}
      className={`flex flex-row gap-2 sm:gap-3 relative animate-fade-in ${
        props.isOwnMessage ? "flex-row-reverse" : "justify-start"
      }`}
    >
      {!props.isSamePrevious && !props.isOwnMessage && (
        <Avatar data={props.message?.sender} size="xxl" rounded />
      )}
      {props.isSamePrevious && !props.isOwnMessage && (
        <div className="sm:w-14 sm:text-md w-10 text-sm" />
      )}
      <div
        className={`flex self-center flex-col p-2 sm:px-4 relative rounded-b-xl ${
          props.isOwnMessage
            ? "flex-row-reverse self-end rounded-l-lg dark:bg-cyan-700 bg-cyan-400"
            : "justify-start self-start rounded-r-lg dark:bg-bunker-900 bg-bunker-100"
        } ${props.isSamePrevious && "rounded-r-lg rounded-l-lg"}`}
      >
        {!props.isSamePrevious && (
          <MessageCorner isOwnMessage={props.isOwnMessage} />
        )}
        {!props.isSamePrevious && !props.isOwnMessage && (
          <ColoredName color={props?.message?.sender?.avatarColor as any}>
            {props.message?.sender?.fullName}
          </ColoredName>
        )}
        <div className="flex flex-col w-full">
          {props.message?.message.file.type === "image" && (
            <div className="relative">
              <img
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props.groupId}/images/${props.message?.message.file.name}`}
                className="sw-[400px] h-[350px] object-cover rounded-md"
              />
              <div
                onClick={() =>
                  downloadFile(
                    `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props.groupId}/images/${props.message?.message.file.name}`,
                    props.message?.message.file.name as string
                  )
                }
                className={`absolute ${
                  props.isOwnMessage
                    ? "dark:bg-cyan-700 bg-cyan-400 text-white"
                    : "dark:bg-bunker-900 bg-bunker-200s text-bunker-800"
                }  dark:text-white p-3 cursor-pointer rounded-bl-md top-0 right-0`}
              >
                <MdOutlineFileDownload />
              </div>
            </div>
          )}
          {props.message?.message.file.type === "video" && (
            <div className="relative rounded-md overflow-hidden">
              <video
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props?.groupId}/videos/${props.message?.message.file.name}`}
                contextMenu="none"
                controls={false}
                className="blur-sm h-[14pc] w-full object-cover rounded-md"
                muted
              />
              <MdPlayArrow
                onClick={() => {
                  props?.setPlayVideo({
                    visible: true,
                    url: `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props?.groupId}/videos/${props.message?.message.file.name}`,
                  });
                }}
                className="size-10 p-1 cursor-pointer rounded-full text-white bg-cyan-600 absolute z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          )}
          {props.message?.message.file.type === "audio" && (
            <Audio
              src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props.groupId}/audios/${props.message?.message.file.name}`}
              fileName={props.message?.message.file.name as string}
              variant={props.isOwnMessage ? "sender" : "receiver"}
              className="!h-auto"
            />
          )}
          {props.message?.message.file.type === "recording" && (
            <>
              <WaveAudio
                id={props.message?._id as string}
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props.groupId}/recordings/${props.message?.message.file.name}`}
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
                className={`p-2 sm:p-3 cursor-pointer ${
                  props.isOwnMessage ? "bg-cyan-600" : "bg-bunker-700"
                } rounded-md text-bunker-50 flex flex-row gap-2 items-center`}
              >
                <MdAttachFile />
                <p className="w-[8pc] sm:text-base text-xs truncate">
                  {props.message?.message.file.name &&
                    props.message?.message.file.name.slice(14)}
                </p>
                <MdDownload
                  onClick={() =>
                    downloadFile(
                      `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/group-${props.groupId}/files/${props.message?.message.file.name}`,
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
                  ? "bg-cyan-600 hover:bg-cyan-600/50"
                  : "dark:bg-bunker-700 bg-bunker-200 over:bg-bunker-700/50"
              } w-full cursor-pointer p-2 rounded-md`}
              onClick={() =>
                props.handlePointReplyMessage(props.message.replyMessage?.id)
              }
            >
              <h3 className="text-sm sm:text-lg font-semibold dark:text-bunker-200 text-bunker-500">
                {props.message?.replyMessage.to.fullName}
              </h3>
              <p
                className={`text-xs sm:text-base dark:text-bunker-300 text-bunker-600 truncate ${
                  props.message?.replyMessage.message.text.length < 30
                    ? "w-[8pc]"
                    : "w-[13pc]"
                } `}
              >
                {props.message?.replyMessage.message.text}
              </p>
            </div>
          )}
          {props.message?.message.file.type !== "text" &&
            props.message?.message.file.type !== "del" && (
              <div className="w-14 h-3.5" />
            )}
          {props.message.message.text && (
            <p
              className={`dark:text-bunker-200 text-bunker-50d text-sm sm:text-base flex gap-1 ${
                props.message?.message.file.type === "del" &&
                "opacity-70 italic"
              } ${props.message?.message.text.length > 30 && "w-[15pc]"}
                 ${props.isOwnMessage ? "text-bunker-50" : "text-bunker-700"}`}
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

function ColoredName({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string | any;
}) {
  const TextColor: any = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    pink: "text-pink-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    gray: "text-gray-500",
    cyan: "text-cyan-500",
    emerald: "text-emerald-500",
    lime: "text-lime-500",
    indigo: "text-indigo-500",
    fuchsia: "text-fuchsia-500",
    sky: "text-sky-500",
    violet: "text-violet-500",
    rose: "text-rose-500",
    slate: "text-slate-500",
    neutral: "text-neutral-500",
  };
  return (
    <h1 className={`${TextColor[color]} text-sm sm:text-lg font-semibold`}>
      {children}
    </h1>
  );
}

export default Message;
