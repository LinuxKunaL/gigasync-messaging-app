import { useEffect, useRef, useState } from "react";

import {
  MdAdd,
  MdPerson,
  MdClose,
  MdDoneAll,
  MdGroupAdd,
  MdOutlineSaveAs,
} from "react-icons/md";
import { TGroup, TUser } from "../../../../../app/Types";
import { useDispatch } from "react-redux";
import {
  insertCurrentChatData,
  insertCurrentGroupChatData,
} from "../../../../../app/Redux";
import { toastSuccess, toastWarning } from "../../../../../app/Toast";
import { handleCatchError } from "../../../../../utils/ErrorHandle";

import Input from "../../../../../components/interface/Input";
import Icon from "../../../../../components/interface/Icon";
import ToolTip from "../../../../../components/interface/Tooltip";
import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import Button from "../../../../../components/interface/Button";
import ModalWindow from "../../../../../components/interface/ModalWindow";
import dataURLtoBlob from "../../../../../utils/dataURLtoBlob";

type TUserList = {
  users: TUser[];
  visible: Boolean;
};

function Groups() {
  const [isLayoutVisible, setIsLayoutVisible] = useState<Boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
    avatar: null,
  });
  const [isUsersList, setIsUsersList] = useState<TUserList>({
    users: [],
    visible: false,
  });
  const [groupMembers, setGroupMembers] = useState<TUser[]>([]);
  const [listGroups, setListGroups] = useState<TGroup[]>([]);
  const dispatch = useDispatch();
  const RAvatarPreview = useRef<HTMLImageElement>(null);

  useEffect(() => {
    api
      .post("api/user/group/list")
      .then((res) => {
        setListGroups(res.data);
      })
      .catch((err) => handleCatchError(err));
  }, [toastSuccess]);

  const handleSearchContact = () => {
    api
      .post("api/user/profile/search", { query: searchQuery })
      .then((res) => {
        setIsUsersList((pre) => ({ ...pre, users: res.data }));
      })
      .then((Err) => console.log(Err));
  };

  const handleAddMember = (param: TUser): void => {
    setGroupMembers([...groupMembers, param]);
    setIsUsersList((pre: any) => ({ ...pre, visible: false }));
  };

  const handleCreateGroup = () => {
    if (!(groupMembers.length > 0)) return toastWarning("Please add members");

    if (!groupDetails.name) return toastWarning("Please add group name");

    if (!groupDetails.description)
      return toastWarning("Please add group description");

    api
      .post(
        "api/user/group/create",
        {
          groupDetails,
          groupMembers,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastSuccess("Group created");
        setIsLayoutVisible(false);
        setGroupDetails({
          name: "",
          description: "",
          avatar: null,
        });
        setGroupMembers([]);
      })
      .catch((err) => handleCatchError(err));
  };

  const handleUploadAvatar = (
    param: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = param.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const blobImage = dataURLtoBlob(reader.result as string);
        setGroupDetails((pre: any) => ({ ...pre, avatar: blobImage }));
        if (RAvatarPreview?.current) {
          RAvatarPreview.current!.src = reader.result as string;
        }
      };
    }
  };

  const handleGroupChat = (param: TGroup): void => {
    dispatch(insertCurrentChatData({}));
    dispatch(insertCurrentGroupChatData(param));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-bunker-300">groups</h1>
        <ToolTip id="add-contact" className="z-10" content="create group">
          <Icon
            onClick={() => setIsLayoutVisible(!isLayoutVisible)}
            variant="transparent"
          >
            <MdGroupAdd />
          </Icon>
        </ToolTip>
      </div>
      {listGroups?.map((group) => (
        <div
          key={group._id}
          className="flex flex-row justify-between py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
          onClick={() => handleGroupChat(group)}
        >
          <div className="flex gap-2 items-center">
            <img
              className="size-12 rounded-full"
              src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${group?._id}&type=group`}
              alt="group avatar"
            />
            <div>
              <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                {group.groupDetails?.name}
              </h1>
              <p className="text-bunker-400 text-sm">
                <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                  {group?.groupMembers?.length} members
                  <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                  3 online
                </p>
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end gap-1">
            <p className="text-sm text-bunker-400">11:30 AM</p>
            <MdDoneAll className="size-6 text-cyan-400" />
          </div>
        </div>
      ))}
      {isLayoutVisible ? (
        <ModalWindow>
          <div className="flex h-[30pc] relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md justify-between">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex gap-2 items-center justify-between">
                <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
                  create groups
                </p>
                <Icon
                  onClick={() => setIsLayoutVisible(!isLayoutVisible)}
                  variant="transparent"
                >
                  <MdClose />
                </Icon>
              </div>
              <div className="flex flex-row items-center w-full gap-2">
                <label
                  htmlFor="avatar-upload"
                  className="relative cursor-pointer"
                >
                  <img
                    className="size-16 bg-bunker-900 rounded-full"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ejLXNwAAAAASUVORK5CYII="
                    ref={RAvatarPreview}
                    alt="Transparent Image"
                  />
                  {!groupDetails.avatar && (
                    <MdOutlineSaveAs className="absolute m-auto text-bunker-300 text-lg top-0 bottom-0 right-0 left-0" />
                  )}
                </label>
                <input
                  onChange={handleUploadAvatar}
                  type="file"
                  hidden
                  accept="image/*"
                  id="avatar-upload"
                />
                <Input
                  onChange={(e) =>
                    setGroupDetails({ ...groupDetails, name: e.target.value })
                  }
                  placeholder="Group Name"
                  className="w-max"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Input
                  onChange={(e) =>
                    setGroupDetails({
                      ...groupDetails,
                      description: e.target.value,
                    })
                  }
                  placeholder="Group Description"
                />
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto h-[13pc]">
                {groupMembers?.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-row  justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar rounded={true} data={user} />
                      <div>
                        <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                          {user.fullName}
                        </h1>
                        <p className="text-bunker-400 text-sm">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end gap-1">
                      <Icon variant="transparent">
                        <MdClose />
                      </Icon>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="primary" onClick={handleCreateGroup}>
                Create
              </Button>
              <Button
                type="secondary"
                onClick={() =>
                  setIsUsersList((pre: any) => ({
                    ...pre,
                    visible: !pre.visible,
                  }))
                }
              >
                Add members
              </Button>
            </div>
            {isUsersList?.visible ? (
              <ModalWindow>
                <div className="flex h-2/4 relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md">
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
                      Add Member
                    </p>
                    <Icon
                      onClick={() =>
                        setIsUsersList((pre: any) => ({
                          ...pre,
                          visible: !pre.visible,
                        }))
                      }
                      variant="transparent"
                    >
                      <MdClose />
                    </Icon>
                  </div>
                  <div className="flex flex-row gap-3">
                    <Input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="search"
                      placeholder="Search contacts ex @username"
                    />
                    <Button
                      onClick={handleSearchContact}
                      className="!w-max"
                      type="primary"
                    >
                      search
                    </Button>
                  </div>
                  <div className="h-full w-full flex flex-col gap-3">
                    {isUsersList?.users?.length > 0 ? (
                      isUsersList.users.map((user) => (
                        <div
                          key={user._id}
                          className="flex flex-row  justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <Avatar rounded={true} data={user} />
                            <div>
                              <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                                {user.fullName}
                              </h1>
                              <p className="text-bunker-400 text-sm">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end gap-1">
                            <Icon
                              onClick={() => handleAddMember(user)}
                              variant="transparent"
                            >
                              <MdAdd />
                            </Icon>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="m-auto flex flex-col gap-3 items-center text-center">
                        <MdPerson className="text-2xl text-cyan-400 " />
                        <p className="text-bunker-400 text-sm">
                          you can add members by searching <br /> them from the
                          search bar
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ModalWindow>
            ) : null}
          </div>
        </ModalWindow>
      ) : null}
    </>
  );
}

export default Groups;
