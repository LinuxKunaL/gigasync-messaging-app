import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TCallStates, TMessages, TUser } from "../../../../../app/Types";
import api from "../../../../../utils/api";
import socket from "../../../../../app/Socket";
import Navigation from "./NavigationBar";
import Chats from "./Chats";
import InputMessage from "./InputMessage";
import VideoCall from "./VideoCall";
import { toastError, toastSuccess } from "../../../../../app/Toast";
import { setCallState } from "../../../../../app/Redux";

type TReplyMessage = {
  visible: Boolean;
  data: TMessages | null;
};

function Body() {
  const dispatch = useDispatch();
  const [selectedContact, setSelectedContact] = useState<TUser>();
  const [replyMessage, setReplyMessage] = useState<TReplyMessage>({
    visible: false,
    data: null,
  });

  const [loadUserData, setLoadUserData] = useState<number>(0);
  const [messageLoading, setMessageLoading] = useState<Boolean>(false);

  const SActiveChat: TUser = useSelector((state: any) => state.currentChat);
  const SUserProfile: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  useEffect(() => {
    api
      .post("api/user/profile/getById", { _id: SActiveChat?._id })
      .then((res) => {
        setSelectedContact(res.data);
      });
  }, [loadUserData, SActiveChat]);

  useEffect(() => {
    socket.on("status", (data: []) => {
      data?.forEach(
        (user: { _id: string }) =>
          user._id === SUserProfile._id && setLoadUserData(loadUserData + 1)
      );
    });

    socket.on("OnIncomingCall", (data) => {
      dispatch(
        setCallState({
          pick: {
            video: {
              visible: true,
              data: data.user,
              signal: data.signal,
              streamSetting: data.streamSetting,
            },
          },
        })
      );
    });

    socket.on("OnCallCanceled", ({ fullName }) => {
      dispatch(
        setCallState({
          pick: {
            video: {
              visible: false,
              data: null,
              signal: null,
            },
          },
        })
      );
      toastError(`Call Canceled by ${fullName}`);
    });

    return () => {
      socket.off("status");
      socket.off("OnIncomingCall");
      socket.off("OnCallCanceled");
    };
  }, [selectedContact]);

  return (
    <div className="dark:bg-bunker-950 h-full w-full flex flex-col relative">
      <div className="h-full w-full flex flex-col overflow-y-auto no-scrollbar z-10">
        <Navigation props={{ selectedContact }} />
        <Chats
          props={{
            selectedContact,
            messageLoading,
            setReplyMessage,
          }}
        />
      </div>
      <InputMessage
        props={{
          setReplyMessage,
          replyMessage,
        }}
      />
      <div className="aa absolute h-full w-full -z-1" />
      <Calls />
      {/* <div className="absolute p-2 bg-red-400 bottom-0 text-white  text-2xl z-40">
        {SUserProfile._id}
      </div> */}
    </div>
  );
}

export default Body;

function Calls() {
  const SCallStates: TCallStates = useSelector(
    (state: any) => state.callStates
  );

  return SCallStates.do.video.visible ? (
    <VideoCall props={SCallStates} />
  ) : SCallStates.pick.video.visible ? (
    <VideoCall props={SCallStates} />
  ) : null;
}
