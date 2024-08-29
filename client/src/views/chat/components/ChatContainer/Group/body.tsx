import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { TGroup, TMessages, TUser } from "../../../../../app/Types";

import api from "../../../../../utils/api";
import Chats from "./components/Chats";
import InputMessage from "./components/InputMessage";
import Navigation from "./components/NavigationBar";

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

function Body() {
  const [selectedGroup, setSelectedGroup] = useState<TGroup>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });
  const [messageLoading, setMessageLoading] = useState<Boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const SActiveGroupChat: TUser = useSelector(
    (state: any) => state.currentGroupChat
  );

  useEffect(() => {
    api
      .post("api/user/group/getById", {
        _id: SActiveGroupChat?._id,
      })
      .then((res) => {
        setSelectedGroup(res.data);
      });
  }, [SActiveGroupChat]);

  return (
    <div className="dark:bg-bunker-950 h-full w-full bg-bunker-200 flex flex-col absolute lg:relative z-10">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <Navigation
          props={{
            selectedGroup,
            setIsSearchVisible,
            isSearchVisible,
          }}
        />
        <Chats
          props={{
            isSearchVisible,
            setMessageLoading,
            messageLoading,
            setReplyMessage,
            selectedGroup,
            setIsSearchVisible,
          }}
        />
      </div>
      <InputMessage
        props={{
          selectedGroup,
          setReplyMessage,
          setMessageLoading,
          replyMessage,
        }}
      />
      <div className="aa absolute h-full w-full -z-1" />
    </div>
  );
}

export default memo(Body);
