import React, { useEffect, useRef, useState } from "react";
import { MdDownload, MdPause, MdPlayArrow } from "react-icons/md";
import downloadFile from "../../utils/DownloadFile";

type Props = {
  src: string;
  variant: "sender" | "receiver";
  fileName?: string;
  className?: string;
  isDownload?: boolean;
};

const Audio = ({
  src,
  fileName,
  variant,
  isDownload,
  className,
}: Props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlayIcon, setIsPlayIcon] = useState<boolean>(false);

  const RAudio = useRef<HTMLAudioElement>(null);
  const RInputRageAudio = useRef<HTMLInputElement>(null);

  const variantStyle = {
    sender: "text-bunker-100",
    receiver: "text-bunker-600 dark:text-bunker-200",
  };

  useEffect(() => {
    if (RAudio.current) {
      RAudio.current.ontimeupdate = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        const currentTime = audioElement.currentTime;

        setCurrentTime(currentTime);

        if (RInputRageAudio.current) {
          const percentage = (currentTime / duration) * 100;
          RInputRageAudio.current.value = percentage as any;
        }
      };
      RAudio.current.onloadedmetadata = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        setDuration(audioElement.duration);
      };
    }
  }, [duration]);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const audioSeek = (e: any) => {
    const audio = RAudio?.current;
    if (audio) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  };

  return (
    <div
      className={`${variantStyle[variant]} ${className} justify-between h-[3pc] rounded-md bg-bunker-910s flex items-center gap-2 p-1 sm:p-2`}
    >
      {isPlayIcon ? (
        <MdPause
          onClick={() => {
            RAudio.current?.pause();
            setIsPlayIcon(false);
          }}
          className="cursor-pointer"
        />
      ) : (
        <MdPlayArrow
          onClick={() => {
            RAudio.current?.play();
            setIsPlayIcon(true);
          }}
          className="cursor-pointer"
        />
      )}
      <div className="flex w-full justify-between flex-row items-center gap-2">
        <audio src={src} ref={RAudio} hidden />
        <input
          type="range"
          ref={RInputRageAudio}
          defaultValue={0}
          onChange={audioSeek}
          className="w-full h-1 accent-cyan-600 dark:bg-bunker-700 rounded-full appearance-none cursor-pointer"
        />
        <div className="font-normal text-sm flex items-center gap-1">
          <span className="w-10 text-center">{formatTime(currentTime)}</span>
          <div className="h-1 w-1 dark:bg-bunker-100 bg-bunker-700 rounded-full" />
          <span className="w-10 text-center">{formatTime(duration)}</span>
        </div>
        {downloadFile && fileName && isDownload && (
          <MdDownload
            onClick={() => downloadFile(src, fileName)}
            className="size-7 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default Audio;
