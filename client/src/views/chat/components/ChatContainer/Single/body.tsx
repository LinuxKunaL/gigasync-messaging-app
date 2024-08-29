import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TCallStates, TMessages, TUser } from "../../../../../app/Types";

import api from "../../../../../utils/api";
import Chats from "./components/Chats";
import InputMessage from "./components/InputMessage";
import Navigation from "./components/NavigationBar";
import VideoCall from "./components/VideoCall";

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

type TSelectedContact = TUser & {
  isBlockedForMe: Boolean;
  isBlockedForUser: Boolean;
};

function Body() {
  const [selectedContact, setSelectedContact] = useState<TSelectedContact>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });
  const isBlockedForMe = selectedContact?.isBlockedForMe;
  const isBlockedForUser = selectedContact?.isBlockedForUser;
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);

  useEffect(() => {
    api
      .post("api/user/profile/getById", { _id: SActiveChat?._id })
      .then((res) => {
        setSelectedContact(res.data);
      });
  }, [SActiveChat]);

  return (
    <div className="dark:bg-bunker-950 bg-bunker-200 h-full w-full flex flex-col absolute lg:relative z-10">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <Navigation
          props={{ selectedContact, setIsSearchVisible, isSearchVisible }}
        />
        <Chats
          props={{
            setIsSearchVisible,
            isSearchVisible,
            selectedContact,
            messageLoading,
            setReplyMessage,
            setMessageLoading,
          }}
        />
      </div>
      <InputMessage
        props={{
          isBlockedForMe,
          isBlockedForUser,
          replyMessage,
          setReplyMessage,
          setMessageLoading,
        }}
      />
      <div className="aa absolute h-full w-full -z-1" />
    </div>
  );
}

export default Body;

export function Calls() {
  const SCallStates: TCallStates = useSelector(
    (state: any) => state.callStates
  );

  return SCallStates.do.video.visible ? (
    <VideoCall props={SCallStates} />
  ) : SCallStates.pick.video.visible ? (
    <VideoCall props={SCallStates} />
  ) : null;
}
