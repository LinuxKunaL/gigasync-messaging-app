import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TGroup, TMessages, TUser } from "../../../../../app/Types";
import { toastError } from "../../../../../app/Toast";
import { setCallState } from "../../../../../app/Redux";

import api from "../../../../../utils/api";
import socket from "../../../../../app/Socket";
import Chats from "./components/Chats";
import InputMessage from "./components/InputMessage";
import Navigation from "./components/NavigationBar";

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

function Body() {
  const dispatch = useDispatch();
  const [selectedGroup, setSelectedGroup] = useState<TGroup>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });

  const [loadUserData, setLoadUserData] = useState<number>(0);
  const [messageLoading, setMessageLoading] = useState<Boolean>(false);

  const SActiveGroupChat: TUser = useSelector(
    (state: any) => state.currentGroupChat
  );

  useEffect(() => {
    api
      .post("api/user/group/getById", {
        _id: SActiveGroupChat?._id,
      })
      .then((res) => {
        console.log(res.data);
        setSelectedGroup(res.data);
      });
  }, [loadUserData, SActiveGroupChat]);

  // useEffect(() => {
  //   socket.on("status", (data: []) => {
  //     data?.forEach(
  //       (user: { _id: string }) =>
  //         user._id === SUserProfile._id && setLoadUserData(loadUserData + 1)
  //     );
  //   });
  //   return () => {
  //     socket.off("status");
  //   };
  // }, [selectedContact]);

  return (
    <div className="dark:bg-bunker-950 h-full w-full flex flex-col relative">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <Navigation props={{ selectedGroup }} />
        {/* <Chats
          props={{
            selectedGroup,
            messageLoading,
            setReplyMessage,
          }}
        /> */}
      </div>
      <InputMessage
        props={{
          setReplyMessage,
          replyMessage,
        }}
      />
      <div className="aa absolute h-full w-full -z-1" />
      {/* <div className="absolute p-2 bg-red-400 bottom-0 text-white  text-2xl z-40">
        {SUserProfile._id}
      </div> */}
    </div>
  );
}

export default Body;
