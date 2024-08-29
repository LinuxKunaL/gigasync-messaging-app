import React, { useEffect, useState } from "react";
import { MdClose, MdFavorite, MdSearch, MdStar } from "react-icons/md";
import Icon from "../../../../components/interface/Icon";
import Input from "../../../../components/interface/Input";
import useFavoriteContact from "../../../../hooks/useFavoriteContact";
import api from "../../../../utils/api";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { TUser } from "../../../../app/Types";
import Avatar from "../../../../components/interface/Avatar";
import convertTime from "../../../../utils/ConvertTime";
import { useDispatch } from "react-redux";
import { insertCurrentChatData } from "../../../../app/Redux";

type Props = {};

function Favorite({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const [favoriteContactList, setFavoriteContactList] = useState<TUser[]>([]);
  const [filteredContactList, setFilteredContactList] = useState<TUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { listContacts } = useFavoriteContact();

  const dispatch = useDispatch();
  useEffect(() => {
    api
      .post("api/user/populateFavorite", { contacts: listContacts() })
      .then((res) => {
        setFavoriteContactList(res.data);
      })
      .catch((Err) => handleCatchError(Err));
  }, []);

  useEffect(() => {
    const filteredContacts = favoriteContactList.filter((contact) =>
      contact.fullName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase() as string)
    );
    setFilteredContactList(filteredContacts);
  }, [searchQuery, favoriteContactList]);

  const handleChat = (param: TUser): void => {
    dispatch(insertCurrentChatData(param));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold dark:text-bunker-300">
            Favorite
          </h1>
          <p className="text-xs sm:text-sm dark:text-bunker-500">
            {favoriteContactList?.length} favorite chats
          </p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="text"
              placeholder="Search favorite chats"
              className=" absolute bottom-0 top-0"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon
              onClick={() => {
                setIsSearchVisible(false);
                setSearchQuery("");
              }}
              className="absolute bottom-1.5 right-2 sm:bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        ) : null}
      </div>
      {filteredContactList && filteredContactList?.length > 0 ? (
        filteredContactList?.map((contact) => (
          <div
            onClick={() => handleChat(contact)}
            className="flex flex-row justify-between items-center p-2 sm:p-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <Avatar data={contact} size="xxl" rounded />
              <div className="flex flex-col gap-1">
                <h1 className="xs:text-lg text-base font-medium dark:text-bunker-50 text-bunker-600">
                  {contact.fullName}
                </h1>
                <p className="text-bunker-400 text-xs sm:text-sm flex flex-row gap-2 items-center">
                  {convertTime(contact.lastSeen as any, "day")}
                  <div className="dark:bg-bunker-100 bg-bunker-600 size-1 rounded-full" />
                  {contact.status}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end gap-1">
              <MdStar className="size-4 sm:size-6 text-cyan-400" />
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex justify-center items-center flex-col gap-2">
          <MdFavorite className="text-xl sm:text-2xl text-cyan-400 " />
          <p className="text-bunker-400 text-xs sm:text-sm">
            No Favorite Contacts
          </p>
        </div>
      )}
    </div>
  );
}

export default Favorite;
