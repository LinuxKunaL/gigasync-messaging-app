import ToolTip from "../../../../components/interface/Tooltip";
import Icon from "../../../../components/interface/Icon";
import {
  MdAdd,
  MdAddCall,
  MdCall,
  MdClose,
  MdContacts,
  MdDelete,
  MdMoreVert,
  MdPerson,
  MdVideoCall,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { toastChoice, toastSuccess } from "../../../../app/Toast";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { insertCurrentChatData } from "../../../../app/Redux";

import Dropdown from "../../../../components/interface/Dropdown";
import Input from "../../../../components/interface/Input";
import Button from "../../../../components/interface/Button";
import api from "../../../../utils/api";
import Avatar from "../../../../components/interface/Avatar";
import ModalWindow from "../../../../components/interface/ModalWindow";

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

function Contacts({ searchQuery = "" }: { searchQuery?: string | undefined }) {
  const [isSearchContactBox, setIsSearchContactBox] = useState<boolean>(false);
  const [contactList, setContactList] = useState<User[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<User[]>([]);
  const [refreshContacts, setRefreshContacts] = useState<number>(0);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get("api/user/contact").then((res) => {
      setContactList(res.data);
    });
  }, [refreshContacts, isSearchContactBox]);

  useEffect(() => {
    const filteredGroups = contactList.filter((contact) =>
      contact.fullName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() as string)
    );
    setFilteredContacts(filteredGroups);
  }, [searchQuery, contactList]);

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
        <h1 className="text-md xs:text-xl font-semibold dark:text-bunker-300">
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
      {filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <div className="flex flex-row justify-between items-center p-2 sm:p-3 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
            <div
              onClick={() => handleChat(contact)}
              className="flex gap-2 items-center w-full"
            >
              <Avatar rounded={true} data={contact} size="xxl" />
              <div className="flex flex-col gap-1">
                <h1 className="xs:text-lg text-base font-medium dark:text-bunker-50 text-bunker-600">
                  {contact.fullName}
                </h1>
                <p className="text-bunker-400 text-xs xs:text-sm">
                  @{contact.username}
                </p>
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
                      <div
                        className="flex items-center justify-between gap-2"
                        onClick={() =>
                          toastChoice(
                            () => handleDeleteContact(contact._id),
                            <div className="text-center">
                              Are you sure <br /> you want to delete{" "}
                              {contact.username}
                            </div>
                          )
                        }
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
                placement="right"
              >
                <Icon variant="transparent">
                  <MdMoreVert />
                </Icon>
              </Dropdown>
            </div>
          </div>
        ))
      ) : (
        <div className="m-auto flex flex-col gap-2 sm:gap-3 items-center text-center">
          <MdContacts className="text-xl sm:text-2xl text-cyan-400 " />
          <p className="text-bunker-400 text-xs sm:text-sm">
            You have no contacts. <br /> Add contacts to get started
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
      {isSearchContactBox && <AddContact props={{ setIsSearchContactBox }} />}
    </>
  );
}

type TAddContact = {
  props: {
    setIsSearchContactBox: (param: any) => void;
  };
};

function AddContact({ props }: TAddContact) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchUsersList, setSearchUsersList] = useState<User[]>([]);

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
        props?.setIsSearchContactBox(false);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <div className="flex h-2/4 relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Add Contact
          </p>
          <Icon
            onClick={() => props?.setIsSearchContactBox((pre: any) => !pre)}
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
                className="flex flex-row justify-between items-center p-2 sm:p-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  <Avatar rounded={true} data={user} size="xxl" />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-md sm:text-lg font-medium dark:text-bunker-50 text-bunker-600">
                      {user.fullName}
                    </h1>
                    <p className="text-bunker-400 text-xs sm:text-sm">
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
              <p className="text-bunker-400 text-xs sm:text-sm">
                you can add contacts by searching <br /> them from the search
                bar
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  );
}

export default Contacts;
