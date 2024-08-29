import { useState } from "react";
import { TUser } from "../../../../../app/Types";
import {
  toastChoice,
  toastSuccess,
  toastWarning,
} from "../../../../../app/Toast";
import { TGroupMembers } from "../Types";
import { useSelector } from "react-redux";
import { handleCatchError } from "../../../../../utils/ErrorHandle";
import { MdClose, MdMoreVert, MdPersonAdd } from "react-icons/md";
import { AddGroupMembers } from "../../SidebarContainer/Home/Groups";

import ModalWindow from "../../../../../components/interface/ModalWindow";
import ToolTip from "../../../../../components/interface/Tooltip";
import Icon from "../../../../../components/interface/Icon";
import Avatar from "../../../../../components/interface/Avatar";
import api from "../../../../../utils/api";
import Dropdown from "../../../../../components/interface/Dropdown";


function GroupMembers({ props }: TGroupMembers) {
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
  const SMyProfileDetails: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  const handleAddMember = (param: TUser): void => {
    const isMemberPresent = props.groupChatDetails?.groupMembers?.some(
      (member) => member._id === param._id
    );

    if (isMemberPresent) {
      return toastWarning("Member already added");
    }

    setIsAddMemberVisible(false);

    api
      .post("api/user/group/update", {
        groupId: props?.groupChatDetails?._id,
        update: {
          operation: "addMember",
          data: param._id,
        },
      })
      .then((Res) => {
        toastSuccess(Res.data.message);
        props.setRefreshTrigger((pre: boolean) => !pre);
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleRemoveMember = (param: TUser): void => {
    if (props?.groupChatDetails?.groupMembers?.length === 1)
      return toastWarning("Can't delete last member");

    api
      .post("api/user/group/update", {
        groupId: props?.groupChatDetails?._id,
        update: {
          operation: "deleteMember",
          data: param._id,
        },
      })
      .then((Res) => {
        toastSuccess(Res.data.message);
        props.setRefreshTrigger((pre: boolean) => !pre);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <>
        <div className="flex h-2/4 w-[30pc] relative flex-col gap-3 p-4 sm:p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md">
          <div className="flex gap-2 items-center justify-between">
            <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
              Group members
            </p>
            <div className="flex gap-2 items-center">
              {props?.groupChatDetails?.createdBy?._id ===
                SMyProfileDetails?._id && (
                <ToolTip id="add-members" content="Add members">
                  <Icon
                    onClick={() => setIsAddMemberVisible(true)}
                    variant="transparent"
                  >
                    <MdPersonAdd />
                  </Icon>
                </ToolTip>
              )}
              <Icon
                onClick={() => props?.setIsMemberWindowVisible(false)}
                variant="transparent"
              >
                <MdClose />
              </Icon>
            </div>
          </div>
          <div className="h-full w-full flex flex-col gap-3 overflow-y-auto scrollbar-bunker">
            <div className="flex flex-row justify-between items-center sm:p-4 p-2 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
              <div className="flex gap-2 items-center">
                <Avatar
                  rounded={true}
                  data={props?.groupChatDetails?.createdBy}
                  size="xxl"
                />
                <div>
                  <h1 className="text-base sm:text-lg font-medium dark:text-bunker-50 text-bunker-600">
                    {props?.groupChatDetails?.createdBy?.fullName}
                  </h1>
                  <p className="text-bunker-400 text-xs sm:text-sm">
                    @{props?.groupChatDetails?.createdBy?.username}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-1">
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-cyan-400 border border-cyan-400">
                  Admin
                </span>
              </div>
            </div>
            {props?.groupChatDetails?.groupMembers &&
              props?.groupChatDetails?.groupMembers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-row justify-between items-center sm:p-4 p-2 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar rounded={true} data={user} size="xxl" />
                    <div>
                      <h1 className="sm:text-lg text-base font-medium dark:text-bunker-50 text-bunker-600">
                        {user.fullName}
                      </h1>
                      <p className="text-bunker-400 text-xs sm:text-sm">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  {props?.groupChatDetails &&
                    SMyProfileDetails._id ==
                      props?.groupChatDetails.createdBy?._id && (
                      <div className="flex flex-col justify-between items-end gap-1">
                        <Dropdown
                          options={[
                            {
                              element: <div>remove</div>,
                              onClick() {
                                toastChoice(
                                  () => handleRemoveMember(user),
                                  "you want to remove"
                                );
                              },
                            },
                          ]}
                          placement="right"
                        >
                          <MdMoreVert className="text-bunker-400" />
                        </Dropdown>
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
        {isAddMemberVisible && (
          <AddGroupMembers props={{ setIsAddMemberVisible, handleAddMember }} />
        )}
      </>
    </ModalWindow>
  );
}

export default GroupMembers;
