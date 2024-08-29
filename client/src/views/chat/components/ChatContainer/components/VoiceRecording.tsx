import { useEffect, useState } from "react";
import ToolTip from "../../../../../components/interface/Tooltip";
import { MdClose, MdPause } from "react-icons/md";
import Icon from "../../../../../components/interface/Icon";
import WaveAudio from "../../../../../components/interface/WaveAudio";

type TVoiceRecording = {
  props: {
    setSendVoice: (param: any) => void;
    setUFiles: (param: any) => void;
  };
};

function VoiceRecording({ props }: TVoiceRecording) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioURL, setAudioURL] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stream, setStream] = useState<MediaStream>();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setStream(stream);
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        recorder.onstart = () => {
          const interval = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
          }, 1000);
          setTimerInterval(interval);
        };
        recorder.ondataavailable = (event) => {
          const audioSave = [event.data];

          recorder.onstop = () => {
            const audioBlob = new Blob(audioSave, {
              type: "recording/mp3",
            });
            props.setUFiles({
              visible: {
                image: false,
                video: false,
                document: false,
                audio: false,
              },
              data: {
                name: "",
                type: audioBlob.type,
                size: audioBlob.size,
                buffer: audioBlob,
              },
              fileType: "recording",
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
          };
        };
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      stream?.getTracks().forEach((track) => track.stop());

      clearInterval(timerInterval);
    };
  }, []);

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      stream?.getTracks().forEach((track) => track.stop());
      clearInterval(timerInterval);
    }
  };

  const closeRecording = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setTimeout(() => {
      props.setUFiles({
        visible: {
          image: false,
          video: false,
          document: false,
          audio: false,
        },
        data: {},
        fileType: undefined,
      });
    }, 100);
    props?.setSendVoice({ visible: false, data: "" });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-max rounded-md flex gap-3 items-center">
      {!audioURL ? (
        <div className="flex flex-row gap-3 items-center justify-between w-full">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <p className="dark:text-bunker-300 text-bunker-600 text-xs sm:text-sm">
              Recording...
            </p>
          </div>
          <div className="dark:text-bunker-300 text-bunker-600 text-xs sm:text-base">
            {formatTime(elapsedTime)}
          </div>
          <ToolTip id="stop-recording" content="Stop Recording">
            <Icon variant="transparent" onClick={stopRecording}>
              <MdPause />
            </Icon>
          </ToolTip>
        </div>
      ) : (
        <WaveAudio id="audio-wave" src={audioURL} variant="receiver" />
      )}
      <ToolTip id="close-recording" content="close Recording">
        <Icon variant="transparent" onClick={closeRecording}>
          <MdClose />
        </Icon>
      </ToolTip>
    </div>
  );
}

export default VoiceRecording;
