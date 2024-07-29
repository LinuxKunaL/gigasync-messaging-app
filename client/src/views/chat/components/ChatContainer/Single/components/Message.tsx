import {
  MdContentCopy,
  MdDelete,
  MdMoreVert,
  MdOutlineFileDownload,
  MdPlayArrow,
  MdReply,
} from "react-icons/md";
import { TMessages, TUser } from "../../../../../../app/Types";
import { useSelector } from "react-redux";
import { deleteMessage } from "../../../../../../utils/deleteMessage";
import { toastSuccess, toastWarning } from "../../../../../../app/Toast";

import Dropdown from "../../../../../../components/interface/Dropdown";
import convertTime from "../../../../../../utils/ConvertTime";

type Props = {
  props: {
    message: TMessages;
    setReplyMessage: (param: any) => void;
    downloadFile: (link: string, filename: string) => void;
    setPlayVideo: (param: any) => void;
  };
};

function Message({ props }: Props) {
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  return (
    <div
      key={props.message?._id}
      className={`flex flex-col relative ${
        SUserProfile?._id === props.message?.sender?._id
          ? "flex-row-reverse"
          : "justify-start"
      }`}
    >
      <div
        className={` flex flex-col gap-1 relative ${
          SUserProfile?._id === props.message?.sender?._id
            ? "flex-row-reverse self-end"
            : "justify-start self-start"
        }`}
      >
        <span className="dark:text-bunker-200/70 text-bunker-600 text-xs flex justify-between items-center">
          {convertTime(props.message?.timestamp as any, "day")}
          <Dropdown
            options={[
              SUserProfile?._id === props.message?.sender?._id
                ? {
                    element: (
                      <div className="flex gap-1 items-center">
                        <MdDelete /> delete
                      </div>
                    ),
                    onClick() {
                      deleteMessage({
                        messageId: props.message?._id,
                        receiver: props.message?.receiver._id,
                        sender: props.message?.sender._id,
                      });
                      toastSuccess("Message deleted");
                    },
                  }
                : {},
              {
                element: (
                  <div className="flex gap-1 items-center">
                    <MdContentCopy /> copy
                  </div>
                ),
              },
              {
                element: (
                  <div className="flex gap-1 items-center">
                    <MdReply /> reply
                  </div>
                ),
                onClick() {
                  props?.setReplyMessage({
                    visible: props.message?.message.text ? true : false,
                    data: props.message?.message.text ? props?.message : null,
                  });
                },
              },
            ]}
            placement={
              SUserProfile?._id === props.message?.sender?._id
                ? "right"
                : "left"
            }
            className={
              SUserProfile?._id === props.message?.sender?._id
                ? "right-1"
                : "left-7"
            }
          >
            <MdMoreVert className="text-lg cursor-pointer" />
          </Dropdown>
        </span>
        <div
          className={`p-4 flex flex-col gap-2 overflow-hidden
                    ${
                      SUserProfile?._id === props.message?.sender?._id
                        ? "rounded-l-xl rounded-b-xl dark:bg-cyan-700 bg-cyan-400 self-end"
                        : "rounded-r-xl rounded-b-xl dark:bg-bunker-900 bg-bunker-100 self-start"
                    } ${
            props.message?.message.text.length < 6
              ? ""
              : ""
              ? "max-w-[500px]"
              : "max-w-[500px]"
          }`}
        >
          {props.message?.message.file.type === "image" ? (
            <div className="relative">
              <img
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?filename=${props.message?.message.file.name}&_id=${props.message?.sender._id}&type=user`}
                className="w-[400px] h-[400px] object-cover rounded-md"
              />
              <div
                onClick={() =>
                  props?.downloadFile(
                    `${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?filename=${props.message?.message.file.name}&_id=${props}&type=user`,
                    props.message?.message.file.name as string
                  )
                }
                className={`absolute ${
                  SUserProfile?._id === props.message?.sender?._id
                    ? "bg-cyan-700"
                    : "bg-bunker-900"
                }  text-white p-3 cursor-pointer rounded-bl-md top-0 right-0`}
              >
                <MdOutlineFileDownload />
              </div>
            </div>
          ) : props.message?.message.file.type === "video" ? (
            <div className="relative rounded-md overflow-hidden">
              <video
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageVideo/user-${props.message?.sender._id}/videos/${props.message?.message.file.name}`}
                contextMenu="none"
                controls={false}
                className="blur-sm h-[14pc] w-full object-cover rounded-md"
                muted
              />
              <MdPlayArrow
                onClick={() => {
                  props?.setPlayVideo({
                    visible: true,
                    url: `${process.env.REACT_APP_BACKEND_HOST}/api/default/messageVideo/user-${props.message?.sender._id}/videos/${props.message?.message.file.name}`,
                  });
                }}
                className="size-10 p-1 cursor-pointer rounded-full text-white bg-cyan-600 absolute z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          ) : null}
          {props.message?.replyMessage ? (
            <div
              className={`${
                SUserProfile?._id === props.message?.sender?._id
                  ? "bg-cyan-600"
                  : "dark:bg-bunker-700 bg-bunker-200"
              } ${
                props.message?.replyMessage.message.text.length < 30
                  ? "w-[10pc]"
                  : "w-[40pc]"
              }  p-2 rounded-md`}
            >
              <h3 className="text-base font-semibold dark:text-bunker-200 text-bunker-500">
                {props.message?.replyMessage.to.fullName}
              </h3>
              <p className="text-base dark:text-bunker-300 text-bunker-600">
                {props.message?.replyMessage.message.text}
              </p>
            </div>
          ) : null}
          <p
            className={`dark:text-bunker-200 text-bunker-700 ${
              props.message?.message.file.type === "del"
                ? " opacity-70 italic"
                : ""
            }`}
          >
            {props.message?.message.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Message;
