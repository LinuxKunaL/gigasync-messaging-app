import React, { useEffect } from "react";
import SideBar from "./components/Bar.side";
import ContentBar from "./components/bar.content";
import ChatSection from "./components/Section.chat";
import ChatDetailsBar from "./components/Bar.chatDetails";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { handleCatchError } from "../../utils/ErrorHandle";
import { insertData } from "../../app/Redux";
import socket from "../../app/Socket";
import { TMessages, TUser } from "../../app/Types";
import { toastNotification } from "../../app/Toast";

type Props = {};

function Main({}: Props) {
  const SChatDetails = useSelector((state: any) => state.chatDetails);
  const SLoadAccountData = useSelector(
    (state: any) => state.loadUserAccountData
  );
  const SCurrentChat: TUser = useSelector((state: any) => state.currentChat);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/auth/me")
      .then((Response) => {
        dispatch(insertData(Response.data));
        socket.emit("register", Response.data._id);
        socket.emit("status", {
          userId: Response.data._id,
          status: "online",
        });
      })
      .catch((Err) => handleCatchError(Err));
  }, [dispatch, SLoadAccountData]);

  useEffect(() => {
    socket.on("NewMessageNotification", (message: TMessages) => {
      if (!SCurrentChat._id) {
        toastNotification(message);
      }
    });
    return () => {
      socket.off("NewMessageNotification");
    };
  }, [SCurrentChat]);
  return (
    <div className="h-full flex flex-row">
      <SideBar />
      <ContentBar />
      <ChatSection />
      {SChatDetails.visible ? <ChatDetailsBar /> : null}
    </div>
  );
}

export default Main;
