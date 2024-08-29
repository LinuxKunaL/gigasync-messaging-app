import { Fragment, useEffect, useRef, useState } from "react";
import { TReaderResult, TUfile } from "../../../../../app/Types";
import { MdClose, MdFilePresent, MdPlayArrow } from "react-icons/md";

type TUloadFilePreview = {
  UFiles: TUfile;
  setUFiles: (param: any) => void;
  readerResults: TReaderResult | any;
};

const UploadFilePreview = ({
  setUFiles,
  UFiles,
  readerResults,
}: TUloadFilePreview) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const RSendAudioPreview = useRef<HTMLAudioElement>(null);
  const RInputRageAudio = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (UFiles.visible.audio) {
      if (RSendAudioPreview.current) {
        RSendAudioPreview.current.play();
        RSendAudioPreview.current.ontimeupdate = (e: Event) => {
          if (RInputRageAudio.current) {
            const audioElement = e.target as HTMLAudioElement;
            const currentTime = audioElement.currentTime;
            const duration = audioElement.duration;

            setCurrentTime(currentTime);
            setDuration(duration);

            RInputRageAudio.current.value = ((currentTime / duration) *
              100) as any;
          }
        };
      }
    }
  }, [UFiles.visible.audio]);

  const audioHandle = () => {
    const audio = RSendAudioPreview?.current;
    if (audio?.paused) {
      audio?.play();
    } else {
      audio?.pause();
    }
  };

  const audioSeek = (e: any) => {
    const audio = RSendAudioPreview?.current;
    if (audio) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  };

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Fragment>
      {UFiles.visible.image && (
        <div className="absolute h-[25pc] border-[1px] bottom-[4pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 bg-bunker-50 dark:!border-bunker-700/40 rounded-md p-2">
          <CloseFilePreviewButton setUFiles={setUFiles} />
          <img
            src={readerResults?.image as string}
            alt=""
            className="w-full h-full rounded-md"
          />
        </div>
      )}
      {UFiles.visible.video && (
        <div className="absolute h-[25pc] border-[1px] bottom-[4pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 bg-bunker-50 dark:!border-bunker-700/40 rounded-md p-2">
          <CloseFilePreviewButton setUFiles={setUFiles} />
          <video
            src={readerResults?.video}
            className="w-full h-full rounded-md"
            controls
            autoPlay={false}
          />
        </div>
      )}
      {UFiles.visible.audio && (
        <div className="absolute border-[1px] bottom-[4pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 h-[4pc] pr-10 items-center bg-bunker-50 flex gap-2 dark:!border-bunker-700/40 rounded-md p-2 px-4">
          <CloseFilePreviewButton setUFiles={setUFiles} />
          <MdPlayArrow
            onClick={audioHandle}
            className="text-bunker-700 dark:text-bunker-100 cursor-pointer"
          />
          <div className="flex w-full justify-between flex-row items-center gap-2">
            <audio src={readerResults?.audio} ref={RSendAudioPreview} hidden />
            <input
              type="range"
              ref={RInputRageAudio}
              defaultValue={0}
              onChange={audioSeek}
              className="w-full h-1 accent-cyan-500 bg-bunker-200 rounded-full appearance-none cursor-pointer dark:bg-bunker-700"
            />
            <div className="dark:text-bunker-300 text-bunker-700 font-normal text-sm flex items-center gap-1">
              <span className="w-10 text-center">
                {formatTime(currentTime)}
              </span>
              <div className="h-1 w-1 bg-bunker-700 dark:bg-bunker-100 rounded-full" />
              <span className="w-10 text-center">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
      {UFiles.visible.file && (
        <div className="absolute size-[12pc] border-[1px] bottom-[4pc] left-1 sm:bottom-[5.6pc] sm:left-3 dark:!bg-bunker-920 bg-bunker-50 dark:!border-bunker-700/40 rounded-md p-2">
          <CloseFilePreviewButton setUFiles={setUFiles} />
          <div className="w-full justify-center h-full rounded-md flex items-center gap-2 p-2">
            <div className="flex flex-col gap-1 items-center justify-center">
              <MdFilePresent className="text-bunker-700 dark:text-bunker-100 size-10" />
              <div className="flex flex-col items-center gap-2 text-bunker-700 dark:text-bunker-300">
                <div className="text-center flex text-sm font-medium sm:text-base">
                  <p
                    className={`${
                      UFiles.data?.name &&
                      UFiles.data?.name.split(".")[0].length > 10
                        ? "w-[4pc]"
                        : ""
                    } truncate`}
                  >
                    {UFiles.data?.name.split(".")[0]}
                  </p>
                  <p>.{UFiles.data?.name.split(".")[1]}</p>
                </div>
                <p className="text-center text-xs sm:text-base font-medium">
                  {formatFileSize(UFiles.data?.size as number)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

function CloseFilePreviewButton({
  setUFiles,
}: {
  setUFiles: (pre: any) => void;
}) {
  return (
    <div
      onClick={() =>
        setUFiles({
          visible: {
            image: false,
            video: false,
            audio: false,
            file: false,
          },
        })
      }
      className="absolute cursor-pointer -top-0 -right-0 bg-cyan-600 rounded-tr-md rounded-bl-md text-bunker-50 z-10 p-2"
    >
      <MdClose />
    </div>
  );
}

export default UploadFilePreview;
