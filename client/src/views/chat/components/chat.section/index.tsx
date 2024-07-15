import React, { useEffect, useRef, useState } from "react";

import {
  MdMic,
  MdSend,
  MdSearch,
  MdClose,
  MdMoreVert,
  MdAttachment,
  MdOutlineCall,
  MdEmojiEmotions,
  MdFavoriteBorder,
  MdOutlineImage,
  MdOutlineAudioFile,
  MdOutlineVideocam,
  MdOutlineVideoFile,
  MdOutlineDocumentScanner,
  MdOutlineSupervisedUserCircle,
  MdCallEnd,
  MdCall,
  MdMicExternalOff,
  MdMicOff,
  MdTimelapse,
  MdTimer10,
  MdVideoCall,
  MdVideocamOff,
  MdOutlineMessage,
  MdOutlineFileDownload,
  MdPlayArrow,
  MdDownload,
  MdTimer,
  MdOutlineAccessTime,
  MdDelete,
  MdArrowDropDown,
  MdReplay,
  MdReply,
  MdCopyAll,
  MdContentCopy,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import ReactPlayer from "react-player";
import { TUser } from "../../../../app/Types";
import Body from "./components/Body";
import PhoneChat from "../../../../assets/svgs/PhoneChat";
type Props = {};

function Index({}: Props) {
  const { _id }: TUser = useSelector((state: any) => state.currentChat);

  return (
    <>
      {_id ? (
        <Body />
      ) : (
        <div className="dark:bg-bunker-950 h-full w-full flex flex-col justify-center items-center relative">
          <div className="flex gap-2 flex-col justify-center items-center">
            <PhoneChat />
            <h1 className="text-2xl font-semibold dark:text-bunker-300">
              GigaSync
            </h1>
            <p className="text-bunker-400 text-sm text-center">
              Send and receive files and messages with GigaSync app , <br /> on
              your website. fast and secure.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Index;
