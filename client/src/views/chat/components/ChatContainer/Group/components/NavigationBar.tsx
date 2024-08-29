import { MdClose, MdSearch, MdMoreVert } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
  setChatDetails,
} from "../../../../../../app/Redux";
import { TGroup } from "../../../../../../app/Types";

import Icon from "../../../../../../components/interface/Icon";
import GroupAvatar from "../../../../../../components/interface/GroupAvatar";
import { memo } from "react";

type Props = {
  props: {
    isSearchVisible: boolean;
    setIsSearchVisible: (param: any) => void;
    selectedGroup: TGroup | undefined;
  };
};

function NavigationBar({ props }: Props) {
  const dispatch = useDispatch();
  return (
    <div className="flex sticky z-20 top-0 flex-row justify-between items-center p-2 sm:p-4 dark:bg-bunker-910/50 bg-bunker-50 dark:backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <GroupAvatar groupId={props.selectedGroup?._id as string} />
        <div className="flex flex-col gap-1">
          <h1 className="text-sm sm:text-lg font-medium dark:text-bunker-50 text-bunker-600 truncate">
            {props?.selectedGroup?.groupDetails?.name}
          </h1>
          <p className="text-xs flex gap-2 items-center !transition-none text-cyan-600 font-semibold">
            {props?.selectedGroup?.groupMembersLength &&
              props?.selectedGroup?.groupMembersLength + 1}{" "}
            members
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3 items-center">
        <Icon
          active={props?.isSearchVisible}
          onClick={() => props?.setIsSearchVisible(!props?.isSearchVisible)}
          variant="transparent"
        >
          <MdSearch />
        </Icon>
        <Icon
          onClick={() => {
            dispatch(
              setChatDetails({
                visible: true,
                id: props?.selectedGroup?._id,
                type: "group",
              })
            );
          }}
          variant="transparent"
        >
          <MdMoreVert />
        </Icon>
        <Icon
          onClick={() => {
            dispatch(insertCurrentChatData(null));
            dispatch(insertCurrentGroupChatData(null));
          }}
          variant="transparent"
        >
          <MdClose />
        </Icon>
      </div>
    </div>
  );
}

export default memo(NavigationBar);
