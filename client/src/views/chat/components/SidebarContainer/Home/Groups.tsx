import { useEffect, useRef, useState } from "react";

import {
  MdAdd,
  MdClose,
  MdSearch,
  MdGroups,
  MdPerson,
  MdDoneAll,
  MdGroupAdd,
  MdOutlineSaveAs,
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import { TGroup, TUser } from "../../../../../app/Types";
import { useDispatch, useSelector } from "react-redux";
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
import GroupAvatar from "../../../../../components/interface/GroupAvatar";

type TAddGroupMembers = {
  props: {
    setIsAddMemberVisible: (param: any) => void;
    handleAddMember: (param: any) => void;
  };
};

type TSeachGroup = {
  props: {
    setIsSearchGroup: (param: any) => void;
  };
};

function Groups({ searchQuery }: { searchQuery: string | undefined }) {
  const [isLayoutVisible, setIsLayoutVisible] = useState<Boolean>(false);
  const [isSearchGroup, setIsSearchGroup] = useState<boolean>(false);
  const [filteredGroups, setFilteredGroups] = useState<TGroup[]>([]);
  const [listGroups, setListGroups] = useState<TGroup[]>([]);
  const dispatch = useDispatch();
  const SCurrentGroupChat: TGroup = useSelector(
    (state: any) => state.currentGroupChat
  );
  const SChatDetails = useSelector((state: any) => state.chatDetails);

  useEffect(() => {
    api
      .post("api/user/group/list")
      .then((res) => {
        setListGroups(res.data);
      })
      .catch((err) => handleCatchError(err));
  }, [isSearchGroup, isLayoutVisible, SChatDetails]);

  useEffect(() => {
    const filteredGroups = listGroups.filter((group) =>
      group.groupDetails?.name
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() as string)
    );
    setFilteredGroups(filteredGroups);
  }, [searchQuery, listGroups]);

  const handleGroupChat = (param: TGroup): void => {
    dispatch(insertCurrentChatData({}));
    dispatch(insertCurrentGroupChatData(param));
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-md sm:text-xl font-semibold dark:text-bunker-300">
          groups
        </h1>
        <div className="flex flex-row gap-3 items-center">
          <ToolTip id="search-group" className="z-10" content="search group">
            <Icon
              onClick={() => setIsSearchGroup(!isSearchGroup)}
              variant="transparent"
            >
              <MdSearch />
            </Icon>
          </ToolTip>
          <ToolTip id="make-group" className="z-10" content="create group">
            <Icon
              onClick={() => setIsLayoutVisible(!isLayoutVisible)}
              variant="transparent"
            >
              <MdGroupAdd />
            </Icon>
          </ToolTip>
        </div>
      </div>
      {filteredGroups.length > 0 ? (
        filteredGroups?.map((group) => (
          <div
            key={group._id}
            className={`flex flex-row justify-between sm:p-4 p-2 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer ${
              SCurrentGroupChat._id === group._id &&
              "dark:bg-bunker-900/60 bg-bunker-100/70"
            }`}
            onClick={() => handleGroupChat(group)}
          >
            <div className="flex gap-2 items-center">
              <GroupAvatar groupId={group._id as string} />
              <div className="flex flex-col gap-1">
                <h1 className="text-md sm:text-lg font-medium dark:text-bunker-50 text-bunker-600">
                  {group.groupDetails?.name}
                </h1>
                <p className="text-bunker-400 text-xs sm:text-sm">
                  <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                    {group?.groupMembers && group?.groupMembers?.length + 1}{" "}
                    members
                    <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                    3 online
                  </p>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end gap-1">
              <p className="text-xs xs:text-sm text-bunker-400">11:30 AM</p>
              <MdDoneAll className="size-4 xs:size-6 text-cyan-400" />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3 w-full h-full items-center justify-center">
          <MdGroups className="text-xl sm:text-2xl text-cyan-400 " />
          <p className="text-bunker-400 text-xs sm:text-sm">No groups found</p>
        </div>
      )}
      {isLayoutVisible && <CreateGroup props={{ setIsLayoutVisible }} />}
      {isSearchGroup && <SearchGroup props={{ setIsSearchGroup }} />}
    </>
  );
}

type TCreateGroup = {
  props: { setIsLayoutVisible: (param: any) => void };
};

function CreateGroup({ props }: TCreateGroup) {
  const [isAddMemberVisible, setIsAddMemberVisible] = useState<Boolean>(false);
  const [groupMembers, setGroupMembers] = useState<TUser[]>([]);
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
    avatar: null,
  });
  const RAvatarPreview = useRef<HTMLImageElement>(null);

  const handleAddMember = (param: TUser): void => {
    const isMemberPresent = groupMembers.some(
      (Member) => Member._id === param._id
    );

    if (isMemberPresent) {
      return toastWarning("Member already added");
    }

    setGroupMembers([...groupMembers, param]);
    setIsAddMemberVisible(false);
  };

  const handleCreateGroup = () => {
    if (!groupDetails.name) return toastWarning("Please add group name");

    if (!groupDetails.description)
      return toastWarning("Please add group description");

    if (!(groupMembers.length > 0)) return toastWarning("Please add members");

    if (!groupDetails.avatar) return toastWarning("Please add group avatar");
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
        props?.setIsLayoutVisible(false);
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
      if (file?.size > 2 * 1024 * 1024)
        return toastWarning("File size should be less than 2MB");

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

  const handleRemoveMember = (param: TUser): void => {
    setGroupMembers(groupMembers.filter((Member) => Member._id !== param._id));
  };

  return (
    <ModalWindow>
      <div className="flex xs:w-auto w-full relative flex-col gap-3 p-4 sm:p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md justify-between">
        <div className="flex flex-col gap-3 h-full">
          <div className="flex gap-2 items-center justify-between">
            <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
              Create groups
            </p>
            <Icon
              onClick={() => props.setIsLayoutVisible((pre: any) => !pre)}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
          <label
            htmlFor="avatar-upload"
            className="relative cursor-pointer size-20 self-center"
          >
            <img
              className="size-20 dark:bg-bunker-900 bg-white rounded-full"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ejLXNwAAAAASUVORK5CYII="
              ref={RAvatarPreview}
              alt="Transparent Image"
            />
            {!groupDetails.avatar && (
              <MdOutlineSaveAs className="absolute m-auto dark:text-bunker-300 text-bunker-600 text-lg top-0 bottom-0 right-0 left-0" />
            )}
            <input
              onChange={handleUploadAvatar}
              type="file"
              hidden
              accept="image/*"
              id="avatar-upload"
            />
          </label>
          <div className="flex flex-row items-center w-full gap-2">
            <Input
              onChange={(e) =>
                setGroupDetails({ ...groupDetails, name: e.target.value })
              }
              placeholder="Group Name"
              className="w-auto sm:w-max h-10"
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
              className="h-10 w-full"
            />
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto h-[13pc]">
            {groupMembers?.map((user) => (
              <div
                key={user._id}
                className="flex flex-row  justify-between items-center p-2 sm:p-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  <Avatar rounded={true} data={user} size="xxl" />
                  <div>
                    <h1 className=" text-md sm:text-lg font-medium dark:text-bunker-50 text-bunker-600">
                      {user.fullName}
                    </h1>
                    <p className="text-bunker-400 text-xs sm:text-sm">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end gap-1">
                  <ToolTip id="remove-member" content="remove member">
                    <Icon
                      onClick={() => handleRemoveMember(user)}
                      variant="transparent"
                    >
                      <MdClose />
                    </Icon>
                  </ToolTip>
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
            onClick={() => setIsAddMemberVisible(!isAddMemberVisible)}
          >
            Add members
          </Button>
        </div>
        {isAddMemberVisible ? (
          <AddGroupMembers
            props={{
              setIsAddMemberVisible,
              handleAddMember,
            }}
          />
        ) : null}
      </div>
    </ModalWindow>
  );
}

function AddGroupMembers({ props }: TAddGroupMembers) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userList, setUserList] = useState<TUser[]>();

  const handleSearchContact = () => {
    api
      .post("api/user/profile/search", { query: searchQuery })
      .then((res) => setUserList(res.data))
      .then((Err) => console.log(Err));
  };

  return (
    <ModalWindow>
      <div className="flex h-2/4 relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Add Member
          </p>
          <Icon
            onClick={() => props?.setIsAddMemberVisible(false)}
            variant="transparent"
          >
            <MdClose />
          </Icon>
        </div>
        <div className="flex flex-row gap-3">
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search members ex @username"
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
          {userList && userList.length > 0 ? (
            userList.map((user: TUser) => (
              <div
                key={user._id}
                className="flex flex-row justify-between items-center p-2 sm:p-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  <Avatar rounded={true} data={user} size="xxl" />
                  <div>
                    <h1 className="xs:text-lg text-base font-normal dark:text-bunker-50 text-bunker-600">
                      {user.fullName}
                    </h1>
                    <p className="text-bunker-400 text-xs xs:text-sm">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end gap-1">
                  <ToolTip id="add-member" content="add member">
                    <Icon
                      onClick={() => props?.handleAddMember(user)}
                      variant="transparent"
                    >
                      <MdAdd />
                    </Icon>
                  </ToolTip>
                </div>
              </div>
            ))
          ) : (
            <div className="m-auto flex flex-col gap-3 items-center text-center">
              <MdPerson className="text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-xs sm:text-sm">
                you can add members by searching <br /> them from the search bar
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  );
}

function SearchGroup({ props }: TSeachGroup) {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [groups, setGroups] = useState<TGroup[]>();

  const handleSearchGroup = () => {
    api
      .post("api/user/group/search", { query: searchQuery })
      .then((res) => {
        if (res.data.length === 0) return toastWarning("No groups found");
        setGroups(res.data);
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleJoinGroup = (groupId: string) => {
    api
      .post("api/user/group/join", { groupId })
      .then((res) => {
        toastSuccess(res.data);
        props?.setIsSearchGroup(false);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <div className="flex h-2/4 relative flex-col gap-3 p-3 sm:p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            search group
          </p>
          <Icon
            onClick={() => props?.setIsSearchGroup(false)}
            variant="transparent"
          >
            <MdClose />
          </Icon>
        </div>
        <div className="flex flex-row gap-3">
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search group ex group1"
          />
          <Button onClick={handleSearchGroup} className="!w-max" type="primary">
            search
          </Button>
        </div>
        <div className="h-full w-full flex flex-col gap-3">
          {groups?.length && groups?.length > 0 ? (
            groups?.map((group: TGroup) => (
              <div
                key={group._id}
                className="flex flex-row justify-between items-center p-2 sm:p-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  <GroupAvatar groupId={group._id as string} />
                  <div>
                    <h1 className="text-md sm:text-lg font-normal dark:text-bunker-50 text-bunker-600">
                      {group.groupDetails?.name}
                    </h1>
                    <p className="text-bunker-400 text-xs sm:text-sm">
                      <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                        {group?.groupMembers && group?.groupMembers?.length + 1}{" "}
                        members
                        <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                        3 online
                      </p>
                    </p>
                  </div>
                </div>
                <ToolTip id="join-group" content="join group">
                  <Icon
                    onClick={() => handleJoinGroup(group._id as string)}
                    variant="transparent"
                  >
                    <MdOutlineSubdirectoryArrowRight />
                  </Icon>
                </ToolTip>
              </div>
            ))
          ) : (
            <div className="m-auto flex flex-col gap-3 items-center text-center">
              <MdGroups className="text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-xs sm:text-sm">
                you can add group by searching <br /> them from the search bar
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  );
}

export { AddGroupMembers };

export default Groups;
