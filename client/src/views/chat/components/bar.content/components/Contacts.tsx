import ToolTip from "../../../../../components/interface/Tooltip";
import Icon from "../../../../../components/interface/Icon";
import {
  MdAdd,
  MdAddCall,
  MdCall,
  MdClose,
  MdContactPhone,
  MdContacts,
  MdContactSupport,
  MdDelete,
  MdMoreVert,
  MdPerson,
  MdVideoCall,
} from "react-icons/md";
import Dropdown from "../../../../../components/interface/Dropdown";
import Input from "../../../../../components/interface/Input";
import Button from "../../../../../components/interface/Button";
import { useEffect, useState } from "react";
import api from "../../../../../utils/api";
import Avatar from "../../../../../components/interface/Avatar";
import { toastSuccess } from "../../../../../app/Toast";
import { handleCatchError } from "../../../../../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { insertCurrentChatData } from "../../../../../app/Redux";

type Props = {};

type User = {
  _id: string;
  fullName: string;
  username: string;
  isAvatar: boolean;
  avatarColor: string;
  status: string;
  lastSeen: string;
};

function Contacts({}: Props) {
  const [isSearchContactBox, setIsSearchContactBox] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchUsersList, setSearchUsersList] = useState<User[]>([]);
  const [contactList, setContactList] = useState<User[]>([]);
  const [refreshContacts, setRefreshContacts] = useState<number>(0);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get("api/user/contact").then((res) => {
      setContactList(res.data);
    });
  }, [refreshContacts, isSearchContactBox]);

  const handleSearchContact = () => {
    api
      .post("api/user/profile/search", { query: searchQuery })
      .then((res) => {
        setSearchUsersList(res.data);
      })
      .then((Err) => console.log(Err));
  };

  const handleAddContact = (param: User): void => {
    api
      .put("api/user/contact", { contactId: param._id })
      .then((res) => {
        setSearchUsersList(res.data);
        toastSuccess(`${param.username} Added`);
        setIsSearchContactBox(false);
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleDeleteContact = (contactId: string): void => {
    api.delete("api/user/contact", { params: { contactId } }).then((res) => {
      toastSuccess("Contact Deleted");
      setRefreshContacts((pre: number) => pre + 1);
    });
  };

  const handleChat = (param: User): void => {
    dispatch(insertCurrentChatData(param));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-bunker-300">
          {contactList.length} Contacts
        </h1>
        <ToolTip id="add-contact" className="z-10" content="Add Contacts">
          <Icon
            onClick={() => setIsSearchContactBox(!isSearchContactBox)}
            variant="transparent"
          >
            <MdAddCall />
          </Icon>
        </ToolTip>
      </div>
      {contactList.length > 0 ? (
        contactList.map((contact) => (
          <div
            onClick={() => handleChat(contact)}
            className="flex flex-row justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <Avatar rounded={true} data={contact} />
              <div>
                <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                  {contact.fullName}
                </h1>
                <p className="text-bunker-400 text-sm">@{contact.username}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end gap-1">
              <Dropdown
                options={[
                  {
                    element: (
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="block"
                          className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer"
                        >
                          <MdVideoCall className="text-lg text-cyan-500" />{" "}
                          video call
                        </label>
                      </div>
                    ),
                  },
                  {
                    element: (
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="block"
                          className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer"
                        >
                          <MdCall className="text-lg text-cyan-500" /> voice
                          call
                        </label>
                      </div>
                    ),
                  },
                  {
                    element: (
                      <div
                        className="flex items-center justify-between gap-2"
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        <label
                          htmlFor="block"
                          className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer"
                        >
                          <MdDelete className="text-lg text-cyan-500" /> delete
                        </label>
                      </div>
                    ),
                  },
                ]}
                placement="left"
              >
                <Icon variant="transparent">
                  <MdMoreVert />
                </Icon>
              </Dropdown>
            </div>
          </div>
        ))
      ) : (
        <div className="m-auto flex flex-col gap-3 items-center text-center">
          <MdContacts className="text-2xl text-cyan-400 " />
          <p className="text-bunker-400 text-sm">
            You have no contacts. Add contacts to get started
          </p>
          <ToolTip id="add-contact" className="z-10" content="Add Contacts">
            <Icon
              onClick={() => setIsSearchContactBox(!isSearchContactBox)}
              variant="transparent"
            >
              <MdAddCall />
            </Icon>
          </ToolTip>
        </div>
      )}
      {isSearchContactBox ? (
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <div className="flex h-2/4 relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md">
            <div className="flex gap-2 items-center justify-between">
              <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
                Add Contact
              </p>
              <Icon
                onClick={() => setIsSearchContactBox(!isSearchContactBox)}
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
              {searchUsersList.length > 0 ? (
                searchUsersList.map((user) => (
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
                        onClick={() => handleAddContact(user)}
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
                    you can add contacts by searching <br /> them from the
                    search bar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Contacts;
