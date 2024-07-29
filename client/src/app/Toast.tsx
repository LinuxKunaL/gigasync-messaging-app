import toast from "react-hot-toast";
import { FaExclamation } from "react-icons/fa";
import { MdCheck, MdClose, MdMessage, MdWarning } from "react-icons/md";
import { BsExclamationLg, BsFillExclamationCircleFill } from "react-icons/bs";
import React, { ReactNode } from "react";
import { TMessages } from "./Types";
import Avatar from "../components/interface/Avatar";

const toastSuccess = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920/40 backdrop-blur-md  border-[1px] dark:border-bunker-700/60 border-bunker-300/50 bg-bunker-50/60 rounded-md overflow-hidden">
        <div className="size-6 outline-3 outline outline-green-400/40 font-semibold items-center justify-center flex bg-green-400 text-bunker-900 rounded-full">
          <MdCheck />
        </div>
        <div className=" absolute top-0 bottom-0 w-10 bg-green-400/50 left-0 blur-xl" />
        <div className="relative z-10 dark:text-bunker-100 font-normal text-bunker-600">
          {message}
        </div>
      </div>
    ),
    { duration: 1000 }
  );
};

const toastWarning = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920 backdrop-blur-md border-[1px]s dark:border-bunker-700/60s border-bunker-300/50 bg-bunker-50/60 rounded-md overflow-hidden">
        {/* <div className="size-6 outline-3 outline outline-yellow-400/40 font-semibold items-center justify-center flex bg-yellow-400 text-bunker-900 rounded-full"> */}
          <BsFillExclamationCircleFill className="text-yellow-400 outline-4 outline outline-yellow-400/30 rounded-full" />
        {/* </div> */}
        <div className=" absolute top-0 bottom-0 w-10 bg-yellow-400/50 left-0 blur-xl" />
        <div className="relative z-10 dark:text-bunker-100 font-normal text-bunker-600">
          {message}
        </div>
      </div>
    ),
    { duration: 1000 }
  );
};

const toastError = (message: string | any) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920/40 backdrop-blur-md border-[1px] dark:border-bunker-700/60 border-bunker-300/50 bg-bunker-50/60 rounded-md overflow-hidden">
        <div className="size-6 outline-3 outline outline-red-400/40 font-semibold items-center justify-center flex bg-red-400 text-bunker-900 rounded-full">
          <MdClose />
        </div>
        <div className=" absolute top-0 bottom-0 w-10 bg-red-400/50 left-0 blur-xl" />
        <div className="relative z-10 dark:text-bunker-100 font-normal text-bunker-600">
          {message}
        </div>
      </div>
    ),
    { duration: 1000 }
  );
};

const toastNotification = (NotificationMessage: TMessages) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920/40 backdrop-blur-md border-[1px] dark:border-bunker-700/60 border-bunker-300/50 bg-white rounded-md overflow-hidden">
        <div className="flex flex-row gap-4">
          <audio
            src="https://cdn.pixabay.com/audio/2022/12/12/audio_e6f0105ae1.mp3"
            autoPlay
            hidden
          />
          <div className="w-max">
            <Avatar rounded={false} data={NotificationMessage.sender} size="xxl" />
          </div>
          <div className="flex flex-col gap-2 w-full flex-1">
            <div className="flex items-center gap-2 w-full justify-between">
              <h1 className="font-semibold dark:text-bunker-50 text-bunker-700 w-max">
                {NotificationMessage.sender.fullName}
              </h1>
              <b className="text-sm font-normal text-bunker-400"> Now</b>
            </div>
            <p className="dark:text-bunker-200 text-bunker-700">
              {NotificationMessage.message.text}
            </p>
          </div>
        </div>
      </div>
    ),
    { duration: 1000 }
  );
};

export { toastSuccess, toastWarning, toastError, toastNotification };
