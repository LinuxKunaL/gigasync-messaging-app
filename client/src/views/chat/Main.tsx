import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleCatchError } from "../../utils/ErrorHandle";
import { insertData } from "../../app/Redux";

import SideBar from "./components/Bar.side";
import ContentBar from "./components/bar.content";
import ChatSection from "./components/chat.section/index";
import ChatDetailsBar from "./components/Bar.chatDetails";
import api from "../../utils/api";
import socket from "../../app/Socket";

type Props = {};

function Main({}: Props) {
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
  }, [dispatch]);

  return (
    <div className="h-full flex flex-row">
      <SideBar />
      <ContentBar />
      <ChatSection />
      <ChatDetails />
    </div>
  );
}

export default Main;

function ChatDetails() {
  const SChatDetails = useSelector((state: any) => state.chatDetails);
  return SChatDetails.visible ? <ChatDetailsBar /> : null;
}
