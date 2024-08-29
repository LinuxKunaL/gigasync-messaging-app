import React, { useEffect, useRef, useState } from "react";
import {
  MdDownload,
  MdFullscreen,
  MdFullscreenExit,
  MdOutlineVolumeOff,
  MdOutlineVolumeUp,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";
import downloadFile from "../../utils/DownloadFile";

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRangeRef = useRef<HTMLDivElement>(null);
  const RPlayerControls = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        setDuration(videoRef.current!.duration);
      });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleRangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const value = parseFloat(e.target.value);
      video.volume = value;
      setIsMuted(value === 0);
    }
  };

  const mute = () => {
    const video = videoRef.current;
    if (video) {
      if (!isMuted) {
        video.volume = 0;
        setIsMuted(true);
      } else {
        video.volume = 1;
        setIsMuted(false);
      }
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (video && progressBar) {
      const currentTime = videoRef.current!.currentTime;
      setElapsedTime(currentTime);
      progressBar.style.width = `${
        (video.currentTime / video.duration) * 100
      }%`;
    }
  };

  const setProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressRange = progressRangeRef.current;
    if (video && progressRange) {
      const newTime = e.nativeEvent.offsetX / progressRange.offsetWidth;
      progressBarRef.current!.style.width = `${newTime * 100}%`;
      video.currentTime = newTime * video.duration;
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!fullscreen) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        }
        setFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        setFullscreen(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="group relative overflow-hidden rounded-lg dark:border-bunker-800/50 border-bunker-300/50 border-[1px]">
        <video
          ref={videoRef}
          className={`${
            fullscreen ? "h-full w-full" : "w-[40pc] h-[30pc]"
          } flex justify-center items-center dark:bg-bunker-950 bg-bunker-100`}
          src={src}
          // autoPlay
          onTimeUpdate={updateProgress}
          onClick={() =>
            RPlayerControls.current?.classList.toggle("!translate-y-32")
          }
        />

        <div
          ref={RPlayerControls}
          className="flex-col group-hover:translate-y-0 translate-y-32 p-3 gap-3 flex absolute bottom-0 w-full dark:bg-bunker-900 bg-bunker-200 h-backdrop-blur-md"
        >
          <div
            className="progress-range dark:bg-bunker-950/50 bg-bunker-100 rounded-full"
            ref={progressRangeRef}
            onClick={setProgress}
            title="Jump-to"
          >
            <div
              className="progress-bar bg-cyan-500 h-2 w-full rounded-full"
              ref={progressBarRef}
            />
          </div>
          <div className="flex gap-1 justify-between dark:text-bunker-100 text-bunker-700">
            <div className="flex gap-1 sm:gap-3 justify-start items-center">
              <div className="font-medium text-xs sm:text-sm flex gap-2 items-center">
                <span className="">{formatTime(elapsedTime)}</span>●
                <span>{formatTime(duration)}</span>
              </div>
              <button onClick={togglePlay} title="Toggle Play">
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
              </button>
              <button onClick={mute}>
                {isMuted ? <MdOutlineVolumeOff /> : <MdOutlineVolumeUp />}
              </button>
              <input
                type="range"
                name="volume"
                className="player_sliderg dark:!bg-bunker-950/50 bg-bunker-100 h-1.5 rounded-full !accent-cyan-600 appearance-none"
                min="0"
                max="1"
                step="0.05"
                defaultValue="1"
                onChange={handleRangeUpdate}
              />
            </div>
            <div className="flex gap-1 sm:gap-3 justify-end items-center">
              <button onClick={() => downloadFile(src, `video-${Date.now()}`)}>
                <MdDownload />
              </button>
              <button onClick={toggleFullscreen}>
                {fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 5px;
          cursor: pointer;
          border-radius: 50px;
          border: 0.2px solid rgba(1, 1, 1, 0);
        }
        input[type='range']::-webkit-slider-thumb {
          height: 0.6em;
          width: 0.9em;
          border-radius: 0.25em;
          background: #0891b2;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -3px;
        }

        input[type='range']::-moz-range-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);
          background: #ffffff;
          border-radius: 1.3px;
          border: 0.2px solid rgba(1, 1, 1, 0);
        }
        input[type='range']::-moz-range-thumb {
          box-shadow: 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(13, 13, 13, 0);
          height: 12px;
          width: 17px;
          border-radius: 50px;
          background: blue;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
