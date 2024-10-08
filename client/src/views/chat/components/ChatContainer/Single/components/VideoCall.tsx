import { memo, useEffect, useRef, useState } from "react";
import {
  MdCall,
  MdMicOff,
  MdCallEnd,
  MdTimelapse,
  MdVideocamOff,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { setCallState } from "../../../../../../app/Redux";
import { TCallStates } from "../../../../../../app/Types";
import { toastError } from "../../../../../../app/Toast";

import Avatar from "../../../../../../components/interface/Avatar";
import socket from "../../../../../../app/Socket";
import Icon from "../../../../../../components/interface/Icon";
import ModalWindow from "../../../../../../components/interface/ModalWindow";

type TMediaStream = {
  stream?: MediaStream;
  setting?: {
    width: number;
    height: number;
  };
};

function VideoCall({ props }: { props: TCallStates }) {
  const dispatch = useDispatch();
  const SUserProfile = useSelector((state: any) => state.UserAccountData);
  const [callAnswered, setCallAnswered] = useState<Boolean>(false);
  const [cameraTurnOff, setCameraTurnOff] = useState({
    my: true,
    peer: true,
  });
  const [micTurnOff, setMicTurnOff] = useState({
    my: true,
    peer: true,
  });
  const [incomingCallAnswered, setIncomingCallAnswered] =
    useState<Boolean>(false);
  const [MyStream, setMyStream] = useState<TMediaStream>();
  const [PeerStream, setPeerStream] = useState<MediaStream>();
  const RMyVideo = useRef<HTMLVideoElement>(null);
  const RPeerVideo = useRef<HTMLVideoElement>(null);

  const STUN_SERVER = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const RPeerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection(STUN_SERVER)
  );

  useEffect(() => {
    const handleOnCallAnswered = async ({ signal }: any) => {
      if (
        RPeerConnection.current &&
        !RPeerConnection.current.remoteDescription
      ) {
        setCallAnswered(true);
        await RPeerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal)
        );
      }
    };

    const handleIncomingIceCandidate = async ({ candidate }: any) => {
      if (RPeerConnection.current) {
        try {
          await RPeerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (error) {
          console.error("Error adding received ice candidate", error);
        }
      }
    };

    const handleOnCallRejected = () => {
      handleStopAllConnections();
      dispatch(
        setCallState({
          do: {
            video: {
              visible: false,
              data: null,
              signal: null,
            },
          },
        })
      );
      toastError("Call rejected");
    };

    const handleOnCallEnd = () => {
      handleStopAllConnections();
      dispatch(
        setCallState({
          pick: {
            video: {
              visible: false,
              data: null,
              signal: null,
            },
          },
          do: {
            video: {
              visible: false,
              data: null,
              signal: null,
            },
          },
        })
      );
      // window.location.reload();
    };

    const handleToggleCamera = ({ isTrackEnabled }: any) => {
      return setCameraTurnOff((prevState) => ({
        ...prevState,
        peer: isTrackEnabled,
      }));
    };

    const handleToggleMic = ({ isTrackEnabled }: any) => {
      return setMicTurnOff((prevState) => ({
        ...prevState,
        peer: isTrackEnabled,
      }));
    };

    socket.on("OnCallEnd", handleOnCallEnd);
    socket.on("OnToggleCamera", handleToggleCamera);
    socket.on("OnToggleMic", handleToggleMic);
    socket.on("OnCallAnswered", handleOnCallAnswered);
    socket.on("OnCallRejected", handleOnCallRejected);
    socket.on("OnIncomingIceCandidate", handleIncomingIceCandidate);

    return () => {
      socket.off("OnCallEnd", handleOnCallEnd);
      socket.off("OnToggleCamera", handleToggleCamera);
      socket.off("OnToggleMic", handleToggleMic);
      socket.off("OnCallAnswered", handleOnCallAnswered);
      socket.off("OnCallRejected", handleOnCallRejected);
      socket.off("OnIncomingIceCandidate", handleIncomingIceCandidate);
    };
  }, [MyStream?.stream]);

  useEffect(() => {
    if (props?.do?.video.visible) {
      handleCall();
    }
  }, [props]);

  useEffect(() => {
    if (callAnswered || incomingCallAnswered) {
      if (RMyVideo.current) {
        if (!RMyVideo.current.srcObject) {
          RMyVideo.current.srcObject = MyStream?.stream as MediaStream;
        }
      }
      if (RPeerVideo.current) {
        if (!RPeerVideo.current.srcObject) {
          RPeerVideo.current.srcObject = PeerStream as MediaStream;
        }
      }
    }
  }, [callAnswered, incomingCallAnswered, cameraTurnOff]);

  useEffect(() => {
    if (PeerStream) {
      if (RPeerVideo.current) {
        RPeerVideo.current.srcObject = PeerStream as MediaStream;
      }
    }
  }, [PeerStream]);

  const handleStopAllConnections = () => {
    RPeerConnection.current?.close();
    PeerStream?.getTracks().forEach((track) => track.stop());
    MyStream?.stream?.getTracks().forEach((track) => track.stop());
  };

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream({
      stream: stream,
      setting: {
        width: stream.getVideoTracks()[0].getSettings().width as number,
        height: stream.getVideoTracks()[0].getSettings().height as number,
      },
    });

    stream.getTracks().forEach((track) => {
      RPeerConnection.current?.addTrack(track, stream);
    });

    RPeerConnection.current.ontrack = (event) => {
      setPeerStream(event.streams[0]);
    };

    RPeerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice-candidate", {
          to: props?.do?.video?.data?._id,
          from: SUserProfile?._id,
          candidate: event.candidate,
        });
      }
    };

    const offer = await RPeerConnection.current?.createOffer();
    await RPeerConnection.current?.setLocalDescription(offer);

    socket.emit("call-user", {
      to: props?.do?.video?.data?._id,
      from: SUserProfile?._id,
      streamSetting: {
        width: stream.getVideoTracks()[0].getSettings().width as number,
        height: stream.getVideoTracks()[0].getSettings().height as number,
      },
      signal: RPeerConnection.current?.localDescription,
    });
  };

  const handleIncomingCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setIncomingCallAnswered(true);

    setMyStream({
      stream: stream,
      setting: {
        width: stream.getVideoTracks()[0].getSettings().width as number,
        height: stream.getVideoTracks()[0].getSettings().height as number,
      },
    });

    stream.getTracks().forEach((track) => {
      RPeerConnection.current?.addTrack(track, stream);
    });

    RPeerConnection.current.ontrack = (event) => {
      setPeerStream(event.streams[0]);
    };

    RPeerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-ice-candidate", {
          to: props.pick?.video?.data?._id,
          from: SUserProfile?._id,
          candidate: event.candidate,
        });
      }
    };

    await RPeerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(props.pick.video.signal)
    );

    const answer = await RPeerConnection.current?.createAnswer();
    await RPeerConnection.current?.setLocalDescription(answer);

    socket.emit("call-answered", {
      signal: RPeerConnection.current?.localDescription,
      to: props?.pick?.video?.data?._id,
      streamSetting: {
        width: stream.getVideoTracks()[0].getSettings().width as number,
        height: stream.getVideoTracks()[0].getSettings().height as number,
      },
    });
  };

  const handleCallCancel = () => {
    dispatch(setCallState({ do: { video: { visible: false } } }));

    handleStopAllConnections();

    socket.emit("call-cancel", {
      to: props?.do.video?.data?._id,
    });
  };

  const handleCallEnd = (to: string) => {
    handleStopAllConnections();

    socket.emit("call-end", {
      to,
    });

    dispatch(
      setCallState({
        pick: {
          video: {
            visible: false,
            data: null,
            signal: null,
          },
        },
        do: {
          video: {
            visible: false,
            data: null,
            signal: null,
          },
        },
      })
    );
  };

  const handleToggleVideo = () => {
    if (MyStream) {
      var isTrackEnabled;
      const videoTracks = MyStream.stream?.getVideoTracks();
      if (videoTracks) {
        if (videoTracks.length > 0) {
          videoTracks.forEach((track) => {
            track.enabled = !track.enabled;
            isTrackEnabled = track.enabled;
            setCameraTurnOff({ ...cameraTurnOff, my: track.enabled });
          });
        }
      }

      if (props.do.video.visible) {
        socket.emit("call-toggle-camera", {
          to: props.do.video.data._id,
          isTrackEnabled,
        });
      }

      if (!props.do.video.visible) {
        socket.emit("call-toggle-camera", {
          to: props.pick.video.data._id,
          isTrackEnabled,
        });
      }
    }
  };

  const handleToggleMic = () => {
    if (MyStream) {
      var isMicEnabled;
      const audioTracks = MyStream.stream?.getAudioTracks();
      if (audioTracks) {
        if (audioTracks.length > 0) {
          audioTracks.forEach((track: any) => {
            track.enabled = !track.enabled;
            isMicEnabled = track.enabled;
            setMicTurnOff({ ...micTurnOff, my: track.enabled });
          });
        }
      }
      if (props.do.video.visible) {
        socket.emit("call-toggle-mic", {
          to: props.do.video.data._id,
          isTrackEnabled: isMicEnabled,
        });
      }
      if (!props.do.video.visible) {
        socket.emit("call-toggle-mic", {
          to: props.pick.video.data._id,
          isTrackEnabled: isMicEnabled,
        });
      }
    }
  };

  if (props?.do.video?.visible && !callAnswered) {
    return (
      <ModalWindow>
        <div className="p-2 sm:p-4 rounded-md flex flex-col items-center justify-center gap-4">
          <audio
            src="https://cdn.pixabay.com/audio/2022/03/15/audio_11714ca0b9.mp3"
            autoPlay
            loop
          />
          <Avatar
            data={props.do?.video?.data}
            className="!size-[12pc]"
            size="full"
          />
          <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-2 sm:p-4 rounded-md gap-4 w-full">
            <span className="dark:text-bunker-200 text-bunker-600 text-sm sm:text-md flex flex-col gap-1 items-center">
              Video calling to
              <b className="dark:text-cyan-500 text-cyan-600 animate-pulse">
                {props.do?.video?.data?.fullName}
              </b>
            </span>
            <div
              onClick={() => handleCallCancel()}
              className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
            >
              <MdCallEnd className="text-red-500 size-6" />
            </div>
          </div>
        </div>
      </ModalWindow>
    );
  }

  if (props?.pick?.video.visible && !incomingCallAnswered) {
    return (
      <ModalWindow>
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <audio
            autoPlay
            src="https://assets.mixkit.co/active_storage/sfx/1361/1361-preview.mp3"
          />
          <div className="relative sm:p-4 p-2 rounded-md flex flex-col items-center justify-center gap-4">
            <Avatar
              size="full"
              className="!h-[14pc]"
              data={props.pick?.video?.data}
            />
            <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-2 sm:p-4 rounded-md gap-3 sm:gap-4 w-full">
              <span className="dark:text-bunker-200 text-bunker-600 text-sm sm:text-md">
                <b className="text-cyan-500 font-normal">
                  {props.pick?.video?.data?.fullName}
                </b>{" "}
                Calling you
              </span>
              <b className="dark:text-bunker-200 text-bunker-600  text-sm sm:text-md animate-pulse">
                Pick the video call
              </b>
              <div className="flex items-center gap-4">
                <div
                  onClick={handleIncomingCall}
                  className="size-12 cursor-pointer rounded-full bg-green-300/20 flex justify-center items-center"
                >
                  <MdCall className="text-green-500 size-6" />
                </div>
                <div
                  onClick={() => {
                    socket.emit("call-reject", {
                      to: props?.pick?.video?.data?._id,
                    });
                    dispatch(
                      setCallState({
                        pick: {
                          video: {
                            visible: false,
                            data: null,
                            signal: null,
                          },
                        },
                      })
                    );
                  }}
                  className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
                >
                  <MdCallEnd className="text-red-500 size-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalWindow>
    );
  }

  if (callAnswered) {
    return (
      <ModalWindow>
        <div className="p-2 sm:p-4 rounded-md flex flex-col items-center justify-center gap-2 sm:gap-4">
          <div className="relative">
            <div className="first-line:overflow-hidden border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md h-full w-full relative">
              {!cameraTurnOff.peer && (
                <div className="rounded-md shadow-xl absolute size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-5" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-center text-sm">
                    {props.do.video?.data?.fullName}
                    <br /> close has camera
                  </p>
                </div>
              )}
              <video
                className="rounded-md shadow-xl size-full"
                autoPlay
                ref={RPeerVideo}
                playsInline
              />
              {micTurnOff.peer ? null : (
                <MdMicOff className="text-red-400 text-4 sm:size-5 absolute right-2 bottom-2" />
              )}
            </div>
            <div className="absolute w-[5pc] xs:w-[7pc] sm:w-[10pc] lg:w-[12pc] ssss left-2 bottom-2 sm:left-5 sm:bottom-5 border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {!cameraTurnOff.my && (
                <div
                  className="rounded-md absolute
                shadow-xl size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col p-1"
                >
                  <MdVideocamOff className="text-red-400 size-3 sm:size-5" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-xs text-center sm:text-sm">
                    Camera is off
                  </p>
                </div>
              )}
              <video
                className="rounded-md shadow-xl size-full object-cover"
                autoPlay
                muted
                ref={RMyVideo}
              />

              {micTurnOff.my ? null : (
                <MdMicOff className="text-red-400 size-4 sm:size-5 absolute right-2 bottom-2" />
              )}
            </div>
          </div>
          <div className="flex relative gap-3 items-center w-full justify-center p-1 sm:p-3 dark:bg-bunker-910 bg-bunker-100 rounded-md">
            <CallTimer />
            <Icon
              active={!micTurnOff.my}
              onClick={handleToggleMic}
              variant="transparent"
            >
              <MdMicOff />
            </Icon>
            <div className="flex items-center gap-4">
              <div
                onClick={() =>
                  handleCallEnd(props?.do?.video?.data?._id as string)
                }
                className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
            </div>
            <Icon
              active={!cameraTurnOff.my}
              onClick={handleToggleVideo}
              variant="transparent"
            >
              <MdVideocamOff />
            </Icon>
            {/* <p className="dark:text-bunker-400 text-xs xs:text-sm sm:text-base text-bunker-700 font-semibold absolute right-4">
              {" "}
              {props.do.video?.data?.fullName}
            </p> */}
          </div>
        </div>
      </ModalWindow>
    );
  }

  if (incomingCallAnswered) {
    return (
      <ModalWindow>
        <div className="p-2 sm:p-4 rounded-md flex flex-col items-center justify-center gap-2 sm:gap-4">
          <div className="relative">
            <div className="first-line:overflow-hidden border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md h-full w-full relative">
              {!cameraTurnOff.peer && (
                <div className="rounded-md absolute shadow-xl size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-4 sm:size-5" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-center text-xs sm:text-sm">
                    {props.pick.video?.data?.fullName} close <br /> has camera
                  </p>
                </div>
              )}
              <video
                className="rounded-md shadow-xl size-full"
                autoPlay
                ref={RPeerVideo}
                playsInline
              />
              {micTurnOff.peer ? null : (
                <MdMicOff className="text-red-400 size-4 sm:size-5 absolute right-2 bottom-2" />
              )}
            </div>
            <div className="absolute w-[5pc] xs:w-[7pc] sm:w-[10pc] lg:w-[12pc] ssss left-2 bottom-2 sm:left-5 sm:bottom-5 border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {!cameraTurnOff.my && (
                <div
                  className="rounded-md absolute
                 shadow-xl size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col p-1"
                >
                  <MdVideocamOff className="text-red-400 size-3 sm:size-5" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-xs text-center sm:text-sm">
                    Camera is off
                  </p>
                </div>
              )}
              <video
                className="rounded-md shadow-xl size-[12pc]s object-cover"
                autoPlay
                muted
                ref={RMyVideo}
              />
              {micTurnOff.my ? null : (
                <MdMicOff className="text-red-400 size-5 absolute right-2 bottom-2" />
              )}
            </div>
          </div>
          <div className="flex relative gap-3 items-center w-full justify-center p-1 sm:p-3 dark:bg-bunker-910 bg-bunker-100 rounded-md">
            <CallTimer />
            <Icon
              active={!micTurnOff.my}
              onClick={handleToggleMic}
              variant="transparent"
            >
              <MdMicOff />
            </Icon>
            <div className="flex items-center gap-4">
              <div
                onClick={() =>
                  handleCallEnd(props?.pick?.video?.data?._id as string)
                }
                className="size-10 sm:size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
            </div>
            <Icon
              active={!cameraTurnOff.my}
              onClick={handleToggleVideo}
              variant="transparent"
            >
              <MdVideocamOff />
            </Icon>
            {/* <p className="dark:text-bunker-400 text-xs xs:text-sm sm:text-base text-bunker-700 font-semibold absolute right-4">
              {props.pick.video?.data?.fullName}
            </p> */}
          </div>
        </div>
      </ModalWindow>
    );
  }

  return null;
}

function CallTimer() {
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callTimerRef.current = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  }, []);

  const formatCallDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <p className="dark:text-bunker-400 text-sm sm:text-base text-bunker-700 font-semibold flex gap-2 items-center absolute left-4 select-none">
      <MdTimelapse /> {formatCallDuration(callDuration)}
    </p>
  );
}

export default memo(VideoCall);
