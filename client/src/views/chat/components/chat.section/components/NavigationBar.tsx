import Avatar from "../../../../../components/interface/Avatar";
import convertTime from "../../../../../utils/ConvertTime";
import {
  MdClose,
  MdMoreVert,
  MdOutlineAccessTime,
  MdOutlineVideocam,
  MdSearch,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  insertCurrentChatData,
  setCallState,
  setChatDetails,
} from "../../../../../app/Redux";
import { TUser } from "../../../../../app/Types";

import ToolTip from "../../../../../components/interface/Tooltip";
import Icon from "../../../../../components/interface/Icon";

type Props = {
  props: {
    selectedContact: TUser | undefined;
  };
};

function NavigationBar({ props }: Props) {
  const dispatch = useDispatch();

  return (
    <div className="flex sticky z-20 top-0 flex-row justify-between items-center p-4 dark:bg-bunker-910/50 bg-bunker-100/50 backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <Avatar rounded={true} data={props?.selectedContact} />
        <div>
          <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
            {props?.selectedContact?.fullName}
          </h1>
          <p
            className={`${
              props?.selectedContact?.status === "online"
                ? "text-green-400"
                : "text-bunker-500"
            } text-sm flex gap-2 items-center !transition-none`}
          >
            {props?.selectedContact?.status}{" "}
            {props?.selectedContact?.status === "offline" && (
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
      <div className="flex gap-3 items-center">
        <Icon variant="transparent">
          <MdSearch />
        </Icon>
        <Icon
          onClick={() =>
            dispatch(
              setCallState({
                do: { video: { visible: true, data: props?.selectedContact } },
              })
            )
          }
          variant="transparent"
        >
          <MdOutlineVideocam />
        </Icon>
        {/* <Icon
          onClick={() =>
            dispatch(
              setCallState({
                do: { voice: { visible: true, data: props?.selectedContact } },
              })
            )
          }
          variant="transparent"
        >
          <MdOutlineCall />
        </Icon> */}
        <Icon
          onClick={() => {
            dispatch(
              setChatDetails({
                visible: true,
                id: props?.selectedContact?._id,
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
  );
}

export default NavigationBar;
