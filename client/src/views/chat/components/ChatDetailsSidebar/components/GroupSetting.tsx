import { useRef, useState } from "react";
import { TGroupSetting } from "../Types";
import {
  toastChoice,
  toastSuccess,
  toastWarning,
} from "../../../../../app/Toast";
import {
  MdAttachFile,
  MdChat,
  MdClose,
  MdInfo,
  MdMic,
  MdMusicNote,
  MdOutlineSaveAs,
  MdPhoto,
  MdPrivacyTip,
  MdSave,
  MdVideocam,
} from "react-icons/md";
import { handleCatchError } from "../../../../../utils/ErrorHandle";
import dataURLtoBlob from "../../../../../utils/dataURLtoBlob";

import api from "../../../../../utils/api";
import ModalWindow from "../../../../../components/interface/ModalWindow";
import ToolTip from "../../../../../components/interface/Tooltip";
import Icon from "../../../../../components/interface/Icon";
import Input from "../../../../../components/interface/Input";
import HrLine from "../../../../../components/interface/HrLine";
import Switch from "../../../../../components/interface/Switch";
import Button from "../../../../../components/interface/Button";

function GroupSetting({ props }: TGroupSetting) {
  const [groupData, setGroupData] = useState({
    groupDetails: {
      ...props.groupChatDetails?.groupDetails,
      avatar: null,
    },
    groupSetting: {
      ...props.groupChatDetails?.groupSetting,
    },
  });
  const RAvatarPreview = useRef<HTMLImageElement>(null);

  const handleUploadAvatar = (
    param: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = param.target.files?.[0];

    if (file) {
      if (file?.size > 2 * 1024 * 1024)
        return toastWarning("File size should be less than 2MB");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const blobImage = dataURLtoBlob(reader.result as string);
        setGroupData((pre: any) => ({
          ...pre,
          groupDetails: { ...groupData.groupDetails, avatar: blobImage },
        }));
        if (RAvatarPreview?.current) {
          RAvatarPreview.current!.src = reader.result as string;
        }
      };
    }
  };

  const handleSave = () => {
    if (!groupData.groupDetails.name)
      return toastWarning("Please add group name");

    if (!groupData.groupDetails.description)
      return toastWarning("Please add group description");

    api
      .post(
        "api/user/group/updateSetting",
        {
          groupId: props?.groupChatDetails?._id,
          groupData,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastSuccess("Group updated");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((err) => handleCatchError(err));
  };

  const handleClearChat = () => {
    api
      .post("api/user//group/clearChat", {
        groupId: props?.groupChatDetails?._id,
      })
      .then((res) => {
        toastSuccess("Group chat cleared");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((err) => handleCatchError(err));
  };

  const handleDeleteGroup = () => {
    api
      .post("api/user/group/delete", {
        groupId: props?.groupChatDetails?._id,
      })
      .then((res) => {
        toastSuccess("Group deleted");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <div className="flex h-full sm:h-2/4 w-[30pc] relative flex-col gap-3 p-4 sm:p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Group setting
          </p>
          <div className="flex gap-2 items-center">
            <ToolTip id="save-details" content="Save">
              <Icon onClick={handleSave} variant="transparent">
                <MdSave />
              </Icon>
            </ToolTip>
            <Icon
              onClick={() => props?.setIsSettingsWindowVisible(false)}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        </div>
        <div className="h-full w-full flex flex-col gap-3 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="avatar-upload"
              className="relative size-20 cursor-pointer self-center object-cover"
            >
              <img
                className="dark:bg-bunker-900 bg-white rounded-full size-full object-cover"
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${props.groupChatDetails?._id}&type=group`}
                ref={RAvatarPreview}
                alt="Transparent Image"
              />
              <MdOutlineSaveAs className="absolute m-auto dark:text-bunker-300 text-bunker-600 text-lg top-0 bottom-0 right-0 left-0" />
              <input
                onChange={handleUploadAvatar}
                type="file"
                hidden
                accept="image/*"
                id="avatar-upload"
              />
            </label>
            <Input
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  groupDetails: {
                    ...groupData.groupDetails,
                    name: e.target.value,
                  },
                })
              }
              defaultValue={props?.groupChatDetails?.groupDetails?.name}
              placeholder="Group Name"
              className="w-auto sm:w-full h-10"
            />
            <Input
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  groupDetails: {
                    ...groupData.groupDetails,
                    description: e.target.value,
                  },
                })
              }
              defaultValue={props?.groupChatDetails?.groupDetails?.description}
              placeholder="Group Description"
              className="w-auto sm:w-full h-10"
            />
          </div>
          <HrLine />
          <h2 className="text-sm sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Privacy
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdPrivacyTip className="text-lg text-cyan-500" />
                group private
                <ToolTip
                  id="group-private"
                  content="group visible for public search"
                >
                  <MdInfo className=" cursor-pointer" />
                </ToolTip>
              </span>
              <Switch
                isCheck={props.groupChatDetails?.groupSetting?.private}
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      private: e.currentTarget?.checked,
                    },
                  })
                }
                size="small"
              />
            </div>
          </div>
          <HrLine />
          <h2 className="text-sm sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Permissions
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdPhoto className="text-lg text-cyan-500" />
                photo allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isPhotoAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isPhotoAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdVideocam className="text-lg text-cyan-500" />
                video allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isVideoAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isVideoAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdMusicNote className="text-lg text-cyan-500" />
                Audio allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isAudioAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isAudioAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdAttachFile className="text-lg text-cyan-500" />
                File allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isFileAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isFileAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdMic className="text-lg text-cyan-500" />
                Voice allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isVoiceAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isVoiceAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdChat className="text-lg text-cyan-500" />
                chat allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isChatAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isChatAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
          </div>
          <HrLine />
          <h2 className="text-sm sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Danger
            <p className="text-xs sm:text-sm font-medium dark:text-bunker-300/80 text-bunker-500">
              This will delete the all the messages and media
            </p>
          </h2>
          <div className="flex flex-row gap-3">
            <Button
              onClick={() =>
                toastChoice(() => handleClearChat(), "Are you sure ?")
              }
              type="secondary"
              className="scale-90f"
            >
              Clear chat
            </Button>

            <Button
              onClick={() =>
                toastChoice(() => handleDeleteGroup(), "Are you sure ?")
              }
              type="secondary"
              className="scale-90f !from-red-600 !to-red-400"
            >
              Delete Group
            </Button>
          </div>
        </div>
      </div>
    </ModalWindow>
  );
}

export default GroupSetting;
