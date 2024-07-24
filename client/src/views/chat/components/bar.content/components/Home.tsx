import { useEffect, useState } from "react";

import {
  MdClose,
  MdSearch,
  MdDoneAll,
  MdGroupAdd,
  MdMessage,
  MdAdd,
  MdPerson,
} from "react-icons/md";
import { TGroups, TUser } from "../../../../../app/Types";
import { useDispatch, useSelector } from "react-redux";
import { insertCurrentChatData } from "../../../../../app/Redux";

import Input from "../../../../../components/interface/Input";
import Icon from "../../../../../components/interface/Icon";
import TabNavigation from "../../../../../components/interface/TabNavigation";
import Contacts from "../components/Contacts";
import ToolTip from "../../../../../components/interface/Tooltip";
import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import Button from "../../../../../components/interface/Button";
import ModalWindow from "../../../../../components/interface/ModalWindow";
import { toastSuccess, toastWarning } from "../../../../../app/Toast";
import { handleCatchError } from "../../../../../utils/ErrorHandle";
import { group } from "console";

type Props = {};

function Home({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const [activeTab, setActiveTab] = useState("All Chats");

  return (
    <>
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">Chat</h1>
          <p className="text-sm dark:text-bunker-500">Start New Conversation</p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="search"
              placeholder="Search chat"
              className=" absolute bottom-0 top-0"
            />
            <Icon
              onClick={() => setIsSearchVisible(false)}
              className="absolute right-2 bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        ) : null}
      </div>
      <div className="dark:bg-bunker-950 bg-bunker-50 p-2 rounded-lg flex space-x-4 w-max">
        <TabNavigation
          tabTitle={["All Chats", "Groups", "Contacts"]}
          onTabActive={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="flex flex-col gap-4 h-full">
        {activeTab === "All Chats" ? <Chats /> : null}
        {activeTab === "Groups" ? <Groups /> : null}
        {activeTab === "Contacts" ? <Contacts /> : null}
      </div>
    </>
  );
}

function Chats() {
  const [allChat, setAllChat] = useState<any>([]);
  const [reloadAllChats, setReloadAllChats] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("api/user/allChats")
      .then((Res) => {
        setAllChat(Res.data);
      })
      .catch(() => {});
  }, [reloadAllChats]);

  const handleChat = (param: TUser): void => {
    const { _id, username, fullName, avatarColor, isAvatar } = param;

    dispatch(
      insertCurrentChatData({ username, _id, fullName, avatarColor, isAvatar })
    );
  };

  return (
    <div className="h-full justify-center flex items-center !transition-none">
      {allChat.length > 0 ? (
        <div className="flex flex-col gap-3 w-full h-full ">
          {allChat?.map((chat?: any) => (
            <div
              onClick={() => handleChat(chat?.user)}
              className="flex flex-row w-full h-max justify-between py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <Avatar rounded={true} data={chat?.user} />
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                    {chat?.user?.fullName}
                  </h1>
                  <p className="text-bunker-400 text-sm truncate">
                    {chat?.message?.text}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-1">
                <p className="text-sm text-bunker-400">11:30 AM</p>
                <MdDoneAll className="size-6 text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="m-auto flex flex-col gap-3 items-center text-center">
            <MdMessage className="text-2xl text-cyan-400 " />
            <p className="text-bunker-400 text-sm">
              You have no messages. Start a conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
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
  });
  const [isUsersList, setIsUsersList] = useState<TUserList>({
    users: [],
    visible: false,
  });
  const [groupMembers, setGroupMembers] = useState<TUser[]>([]);
  const [listGroups, setListGroups] = useState<TGroups[]>([]);

  useEffect(() => {
    api
      .post("api/user/group", { operation: "getAll" })
      .then((res) => {
        setListGroups(res.data);
      })
      .catch((err) => handleCatchError(err));
  }, []);

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
      .post("api/user/group", {
        operation: "create",
        groupDetails,
        groupMembers,
      })
      .then(() => {
        toastSuccess("Group created");
        setIsLayoutVisible(false);
        setGroupDetails({
          name: "",
          description: "",
        });
        setGroupMembers([]);
      })
      .catch((err) => handleCatchError(err));
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
        <div className="flex flex-row justify-between py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
          <div className="flex gap-2 items-center">
            <Avatar rounded={true} data={group} />
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
                <div className="size-16 bg-bunker-900 rounded-full" />
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

export default Home;
