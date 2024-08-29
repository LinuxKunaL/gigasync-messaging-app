import { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdClose,
  MdMoreVert,
  MdOutlineAccessTime,
  MdOutlineVideocam,
  MdSearch,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toastWarning } from "../../../../../../app/Toast";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
  setCallState,
  setChatDetails,
} from "../../../../../../app/Redux";
import { TUser } from "../../../../../../app/Types";

import ToolTip from "../../../../../../components/interface/Tooltip";
import Icon from "../../../../../../components/interface/Icon";
import Avatar from "../../../../../../components/interface/Avatar";
import convertTime from "../../../../../../utils/ConvertTime";
import socket from "../../../../../../app/Socket";

type TSelectedContact = TUser & {
  isBlockedForMe: Boolean | undefined;
  isBlockedForUser: Boolean | undefined;
};

type Props = {
  props: {
    isSearchVisible: boolean;
    setIsSearchVisible: (param: any) => void;
    selectedContact: TSelectedContact | undefined;
  };
};

function NavigationBar({ props }: Props) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<string>("");
  const SUserProfile: TUser = useSelector((state: any) => state.currentChat);

  const handleCloseChat = () => {
    dispatch(insertCurrentChatData(null));
    dispatch(insertCurrentGroupChatData(null));
  };

  useEffect(() => {
    setStatus(props.selectedContact?.status as string);
  }, [props.selectedContact?.status]);

  useEffect(() => {
    socket.on("status", ({ chat, status }: { chat: []; status: string }) => {
      chat?.forEach((user: { _id: string }) => {
        console.log(user._id === SUserProfile._id);
        user._id === SUserProfile._id && setStatus(status);
      });
    });

    return () => {
      socket.off("status");
    };
  }, []);

  const handleSearchChat = () => {
    props?.setIsSearchVisible(!props?.isSearchVisible);
  };

  const handleVideoCall = () => {
    dispatch(
      setCallState({
        do: { video: { visible: true, data: props?.selectedContact } },
      })
    );
  };

  const handleOpenChatDetails = () => {
    dispatch(
      setChatDetails({
        visible: true,
        id: props?.selectedContact?._id,
        type: "single",
      })
    );
  };

  return (
    <div className="flex sticky z-20 top-0 flex-row justify-between items-center p-2 sm:p-4 dark:bg-bunker-910/50 bg-bunker-50 dark:backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <MdArrowBack
          className="cursor-pointer text-bunker-400 size-5 lg:hidden"
          onClick={handleCloseChat}
        />
        <Avatar
          rounded={true}
          data={props?.selectedContact}
          size="xxl"
          className="sm:size-14 !w-12 !h-12 !text-xs"
        />
        <div className="flex flex-col justify-between">
          <h1 className="text-md sm:text-lg font-normal dark:text-bunker-50 text-bunker-600 mb-1">
            {props?.selectedContact?.fullName}
          </h1>
          <p
            className={`${
              status === "online" ? "text-green-400" : "text-bunker-500"
            } text-xs sm:text-sm flex gap-2 items-center !transition-none`}
          >
            {status}{" "}
            {status === "offline" && (
              <ToolTip
                id="last-seen"
                content={convertTime(
                  props?.selectedContact?.lastSeen as any,
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
      <div className="flex gap-2 sm:gap-3 items-center relative">
        <Icon
          active={props?.isSearchVisible}
          onClick={handleSearchChat}
          variant="transparent"
        >
          <MdSearch />
        </Icon>
        {!props.selectedContact?.isBlockedForMe &&
        !props.selectedContact?.isBlockedForUser ? (
          <Icon onClick={handleVideoCall} variant="transparent">
            <MdOutlineVideocam />
          </Icon>
        ) : (
          <Icon
            onClick={() =>
              toastWarning(
                props.selectedContact?.isBlockedForMe
                  ? "You have blocked this user"
                  : "This user has blocked you"
              )
            }
            variant="transparent"
          >
            <MdOutlineVideocam />
          </Icon>
        )}
        <Icon onClick={handleOpenChatDetails} variant="transparent">
          <MdMoreVert />
        </Icon>
        <Icon
          className="hidden lg:flex"
          onClick={handleCloseChat}
          variant="transparent"
        >
          <MdClose />
        </Icon>
      </div>
    </div>
  );
}

export default NavigationBar;
