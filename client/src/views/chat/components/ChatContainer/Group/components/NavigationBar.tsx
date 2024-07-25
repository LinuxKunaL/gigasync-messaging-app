import Avatar from "../../../../../../components/interface/Avatar";
import convertTime from "../../../../../../utils/ConvertTime";
import {
  MdClose,
  MdSearch,
  MdMoreVert,
  MdOutlineAccessTime,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
  setChatDetails,
} from "../../../../../../app/Redux";
import { TGroup } from "../../../../../../app/Types";

import Icon from "../../../../../../components/interface/Icon";

type Props = {
  props: {
    selectedGroup: TGroup | undefined;
  };
};

function NavigationBar({ props }: Props) {
  const dispatch = useDispatch();

  return (
    <div className="flex sticky z-20 top-0 flex-row justify-between items-center p-4 dark:bg-bunker-910/50 bg-bunker-100/50 backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <img
          className="size-14 rounded-full"
          src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${props.selectedGroup?._id}&type=group`}
        />
        <div>
          <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
            {props?.selectedGroup?.groupDetails?.name}
          </h1>
          <p className="text-xs flex gap-2 items-center !transition-none text-cyan-600 font-semibold">
            {props?.selectedGroup?.groupMembersLength} members
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Icon variant="transparent">
          <MdSearch />
        </Icon>
        <Icon
          onClick={() => {
            dispatch(
              setChatDetails({
                visible: true,
                id: props?.selectedGroup?._id,
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

export default NavigationBar;
