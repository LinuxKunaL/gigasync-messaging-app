import React, { useEffect, useRef, useState } from "react";
import { MdDownload, MdPause, MdPlayArrow } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

type Props = {
  src: string;
  variant: "sender" | "receiver";
  id: string;
};

const WaveAudio = ({ src, variant, id }: Props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlayIcon, setIsPlayIcon] = useState<boolean>(false);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();

  const variantStyle = {
    sender: "text-bunker-100",
    receiver: "text-bunker-600 dark:text-bunker-200",
  };

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const responsive = window.outerWidth >= 600 ? false : true;

    const option = {
      container: `#id-${id}` as any,
      height: responsive ? 24 : 30,
      width: responsive ? 120 : 170,
      splitChannels: false,
      normalize: false,
      waveColor: variant == "receiver" ? "#565c73" : "#b3b8c6",
      progressColor: "rgb(6 182 212)",
      cursorColor: "rgb(6 182 212)",
      cursorWidth: 2,
      barWidth: 2,
      barGap: responsive ? 2 : 4,
      barRadius: 25,
      barHeight: 1.5,
      barAlign: "",
      minPxPerSec: 1,
      fillParent: true,
      url: src,
      mediaControls: false,
      autoplay: false,
      interact: true,
      dragToSeek: true,
      hideScrollbar: false,
      audioRate: 1,
      autoScroll: false,
      autoCenter: true,
    };

    const waveSurfer = WaveSurfer.create(option as any);

    setWaveSurfer(waveSurfer);

    waveSurfer.on("ready", () => {
      setDuration(waveSurfer.getDuration());
    });

    waveSurfer.on("timeupdate", () => {
      setCurrentTime(waveSurfer.getCurrentTime());
    });
  }, []);

  return (
    <div
      className={`${variantStyle[variant]} w-full rounded-md p-0 sm:p-1 flex items-center gap-2 mt-1`}
    >
      {isPlayIcon ? (
        <MdPause
          onClick={() => {
            waveSurfer?.pause();
            setIsPlayIcon(false);
          }}
          className="cursor-pointer"
        />
      ) : (
        <MdPlayArrow
          onClick={() => {
            waveSurfer?.play();
            setIsPlayIcon(true);
          }}
          className="cursor-pointer"
        />
      )}
      <div className="flex w-full justify-between flex-row items-center gap-1 sm:gap-2">
        <div id={`id-${id}`} />
        <div className="font-normal text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1">
          <span className="w-10 text-center">{formatTime(currentTime)}</span>
          <div className="h-1 w-1 dark:bg-bunker-200 bg-bunker-600 rounded-full" />
          <span className="w-10 text-center">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default WaveAudio;
