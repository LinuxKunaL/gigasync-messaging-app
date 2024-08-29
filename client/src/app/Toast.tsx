import toast from "react-hot-toast";
import { MdClose, MdReplay } from "react-icons/md";
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
  BsFillXCircleFill,
} from "react-icons/bs";
import { TMessages } from "./Types";
import Avatar from "../components/interface/Avatar";
import Button from "../components/interface/Button";

const toastSuccess = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920 backdrop-blur-md border-[1px]s dark:border-bunker-600/30 border-bunker-500/30 border-[1px] bg-bunker-50 rounded-md overflow-hidden">
        <BsFillCheckCircleFill className="text-green-400 outline-4 outline outline-green-400/30 rounded-full" />
        <div className="relative z-10 text-xs sm:text-sm dark:text-bunker-200 font-normal text-bunker-600">
          {message}
        </div>
        <MdClose
          onClick={() => toast.dismiss(t.id)}
          className="text-green-400 cursor-pointer"
        />
      </div>
    ),
    { duration: 1000 }
  );
};

const toastWarning = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920 backdrop-blur-md border-[1px]s dark:border-bunker-600/30 border-bunker-500/30 border-[1px] bg-bunker-50 rounded-md overflow-hidden">
        <BsFillExclamationCircleFill className="text-yellow-400 outline-4 outline outline-yellow-400/30 rounded-full" />
        <div className="relative text-xs sm:text-sm z-10 dark:text-bunker-200 font-medium text-bunker-600">
          {message}
        </div>
        <MdClose
          onClick={() => toast.dismiss(t.id)}
          className="text-yellow-400 cursor-pointer"
        />
      </div>
    ),
    { duration: 1000 }
  );
};

const toastError = (message: string | any) => {
  toast.custom(
    (t) => (
      <div className="flex animate-enter relative gap-4 items-center justify-start p-4 dark:bg-bunker-920 backdrop-blur-md border-[1px]s dark:border-bunker-600/30 border-bunker-500/30 border-[1px] bg-bunker-50 rounded-md overflow-hidden">
        <BsFillXCircleFill className="text-red-400 outline-4 outline outline-red-400/30 rounded-full" />
        <div className="relative z-10 text-xs sm:text-sm dark:text-bunker-100 font-medium text-bunker-600">
          {message}
        </div>
        <MdClose
          onClick={() => toast.dismiss(t.id)}
          className="text-red-400 cursor-pointer"
        />
      </div>
    ),
    { duration: 1000 }
  );
};

const toastChoice = (triggerFunction: any, message: any) => {
  toast.custom(
    (t) => (
      <div className="flex flex-col animate-enter relative gap-2 sm:gap-4 items-center justify-start p-3 sm:p-4 dark:bg-bunker-920 backdrop-blur-md dark:border-bunker-600/30 border-bunker-500/30 border-[1px] bg-bunker-50 rounded-md overflow-hidden">
        <div className="relative text-sm z-10 dark:text-bunker-200 font-normal text-bunker-600">
          {message}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              triggerFunction();
              toast.dismiss(t.id);
            }}
            type="primary"
            className="sm:!h-10 sm:!w-16 !h-8 !w-15"
          >
            Yes
          </Button>
          <Button
            onClick={() => toast.dismiss(t.id)}
            type="secondary"
            className="sm:!h-10 sm:!w-16 !h-8 !w-15"
          >
            No
          </Button>
        </div>
      </div>
    ),
    {
      duration: 5000,
    }
  );
};

const toastNotification = (
  NotificationMessage: TMessages,
  replyMessage: any
) => {
  toast.custom(
    (t) => (
      <div className="flex flex-row animate-enter relative gap-2 sm:gap-4 justify-start dark:bg-bunker-920 backdrop-blur-md border-[1px] border-bunker-600/30 bg-bunker-50/60 rounded-md overflow-hidden">
        <audio
          src="https://cdn.pixabay.com/audio/2022/12/12/audio_e6f0105ae1.mp3"
          autoPlay
          hidden
        />
        <div className="flex flex-row gap-2 sm:gap-4 p-2 sm:p-4">
          <div className="w-m">
            <Avatar
              rounded={false}
              data={NotificationMessage.sender}
              size="xxl"
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 w-full flex-1">
            <div className="flex items-center gap-2 w-full justify-between">
              <h1 className="font-medium sm:text-base text-sm dark:text-bunker-50 text-bunker-700 w-max">
                {NotificationMessage.sender.fullName}
              </h1>
              <b className="text-xs sm:text-sm font-medium text-cyan-400">
                Now
              </b>
            </div>
            <p className="dark:text-bunker-400 sm:text-base text-xs text-bunker-700 truncate w-[10pc]">
              {NotificationMessage.message.text != ""
                ? NotificationMessage.message.text
                : NotificationMessage.message.file.name}
            </p>
          </div>
        </div>
        <div className="flex items-center w-10 flex-col gap-1s divide-y-2 divide-cyan-700">
          <div
            onClick={() => toast.dismiss(t.id)}
            className="bg-cyan-500 w-full flex-1 flex items-center justify-center"
          >
            <MdClose className="text-white" />
          </div>
          <div
            onClick={() => {
              replyMessage();
              toast.dismiss(t.id);
            }}
            className="bg-cyan-500 w-full flex-1 flex items-center justify-center"
          >
            <MdReplay className="text-white bg-cyan-500" />
          </div>
        </div>
      </div>
    ),
    { duration: 2000 }
  );
};

export {
  toastSuccess,
  toastWarning,
  toastError,
  toastNotification,
  toastChoice,
};
