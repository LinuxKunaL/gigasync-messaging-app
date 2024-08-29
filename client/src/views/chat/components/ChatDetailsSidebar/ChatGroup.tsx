import { useEffect, useState } from "react";
import { MdArrowBack, MdExitToApp, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";
import { TGroupChatDetails } from "./Types";
import { TUser } from "../../../../app/Types";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import {
  setChatDetails,
  insertCurrentGroupChatData,
} from "../../../../app/Redux";
import { FilesTab, LinksTab, MediaTab, VoiceTab } from "./components/Tabs";
import { toastChoice } from "../../../../app/Toast";

import Icon from "../../../../components/interface/Icon";
import GroupAvatar from "../../../../components/interface/GroupAvatar";
import ToolTip from "../../../../components/interface/Tooltip";
import HrLine from "../../../../components/interface/HrLine";
import Avatar from "../../../../components/interface/Avatar";
import TabNavigation from "../../../../components/interface/TabNavigation";
import GroupMembers from "./components/GroupMembers";
import GroupSetting from "./components/GroupSetting";
import api from "../../../../utils/api";

function ChatGroup({ id }: { id: string }) {
  const [filesTab, setFilesTab] = useState<string>("media");
  const [groupChatDetails, setGroupChatDetails] = useState<TGroupChatDetails>();
  const [refreshTrigger, setRefreshTrigger] = useState(true);
  const [isMemberWindowVisible, setIsMemberWindowVisible] = useState(false);
  const [isSettingsWindowVisible, setIsSettingsWindowVisible] = useState(false);
  const SMyProfileDetails: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/user/getGroupChatData", {
        groupId: id,
      })
      .then((res) => {
        setGroupChatDetails(res.data);
      })
      .catch((Err) => handleCatchError(Err));
  }, [refreshTrigger]);

  const handleExitGroup = () => {
    api
      .post("api/user/group/exit", {
        groupId: id,
      })
      .then((res) => {
        dispatch(
          setChatDetails({
            visible: false,
            id: null,
          })
        );
        dispatch(insertCurrentGroupChatData({}));
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <div className="dark:bg-bunker-920 xl:relative absolute right-0 bg-white h-full w-screen sm:w-[25pc] p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 z-20 items-stretch ">
      <div className="flex w-full justify-between items-center">
        <Icon
          onClick={() => {
            dispatch(
              setChatDetails({
                visible: false,
                id: null,
              })
            );
          }}
          variant="transparent"
        >
          <MdArrowBack />
        </Icon>
        <div className="self-center">
          <h1 className="text-lg sm:text-2xl font-semibold dark:text-bunker-300">
            Group details
          </h1>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <GroupAvatar groupId={groupChatDetails?._id as string} />
          <div>
            <h1 className="text-md sm:text-lg font-normal dark:text-bunker-50 text-bunker-600">
              {groupChatDetails?.groupDetails?.name}
            </h1>
            <p className="dark:text-cyan-500 text-cyan-600 font-semibold text-xs sm:text-sm">
              {groupChatDetails?.groupMembers &&
                groupChatDetails?.groupMembers?.length + 1}{" "}
              members
            </p>
          </div>
        </div>
        {groupChatDetails?.createdBy?._id === SMyProfileDetails._id ? (
          <ToolTip id="group-settings" content="group settings">
            <Icon
              onClick={() => setIsSettingsWindowVisible(true)}
              variant="transparent"
            >
              <MdSettings />
            </Icon>
          </ToolTip>
        ) : (
          <Icon
            onClick={() => toastChoice(() => handleExitGroup(), "Leave Group")}
            variant="transparent"
          >
            <MdExitToApp />
          </Icon>
        )}
      </div>
      <p className="text-sm sm:text-md font-normal dark:text-bunker-300 text-bunker-500">
        {groupChatDetails?.groupDetails?.description}
      </p>
      <HrLine />
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-md font-medium dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <FaUsers className="text-lg text-cyan-500" />
          Members
        </span>
        <ToolTip id="window-members" content="View members">
          <div
            onClick={() => setIsMemberWindowVisible(true)}
            className="relative w-full h-full flex -space-x-4 rtl:space-x-reverse flex-row justify-end cursor-pointer"
          >
            {groupChatDetails?.groupMembers &&
              groupChatDetails.groupMembers.slice(0, 2).map((member, index) => (
                <div key={index} className="cursor-pointer hover:z-10">
                  <Avatar data={member} rounded size="lg" />
                </div>
              ))}
            {groupChatDetails?.groupMembers &&
              groupChatDetails?.groupMembers?.length > 2 && (
                <div className="cursor-pointer flex items-center justify-center w-10 h-10 bg-bunker-50 dark:bg-bunker-800 text-bunker-800 dark:text-bunker-100 font-semibold text-sm z-10 rounded-full">
                  +{groupChatDetails.groupMembers.length - 1}
                </div>
              )}
          </div>
        </ToolTip>
      </div>
      <HrLine />
      <div className="dark:bg-bunker-950 bg-bunker-50 p-2 rounded-lg flex space-x-4 w-full lg:w-max">
        <TabNavigation
          activeTab={filesTab}
          onTabActive={setFilesTab}
          tabTitle={["media", "files", "links", "voice"]}
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar w-full h-full">
        {filesTab === "media" && (
          <MediaTab
            mediaImages={groupChatDetails?.media?.images}
            mediaVideos={groupChatDetails?.media?.videos}
            mediaAudios={groupChatDetails?.media?.audios}
          />
        )}
        {filesTab === "files" && <FilesTab files={groupChatDetails?.files} />}
        {filesTab === "links" && <LinksTab links={groupChatDetails?.links} />}
        {filesTab === "voice" && <VoiceTab voices={groupChatDetails?.voices} />}
      </div>
      {isMemberWindowVisible && (
        <GroupMembers
          props={{
            groupChatDetails,
            setIsMemberWindowVisible,
            setRefreshTrigger,
          }}
        />
      )}
      {isSettingsWindowVisible && (
        <GroupSetting
          props={{
            groupChatDetails,
            setIsSettingsWindowVisible,
            setRefreshTrigger,
          }}
        />
      )}
    </div>
  );
}

export default ChatGroup;
