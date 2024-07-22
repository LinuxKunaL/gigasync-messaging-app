import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  MdCall,
  MdMicOff,
  MdCallEnd,
  MdTimelapse,
  MdVideocamOff,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { setCallState } from "../../../../../app/Redux";
import { TCallStates, TUser } from "../../../../../app/Types";
import { toastError } from "../../../../../app/Toast";

import Avatar from "../../../../../components/interface/Avatar";
import socket from "../../../../../app/Socket";
import Icon from "../../../../../components/interface/Icon";

function VideoCall({ props }: { props: TCallStates }) {
  const dispatch = useDispatch();
  const SUserProfile = useSelector((state: any) => state.UserAccountData);

  const [callAnswered, setCallAnswered] = useState<Boolean>(false);
  const [cameraTurnOf, setCameraTurnOf] = useState({
    my: true,
    peer: true,
  });
  const [incomingCallAnswered, setIncomingCallAnswered] =
    useState<Boolean>(false);
  const [MyStream, setMyStream] = useState<MediaStream | any>();
  const [PeerStream, setPeerStream] = useState<MediaStream | any>();
  const RMyVideo = useRef<HTMLVideoElement>(null);
  const RPeerVideo = useRef<HTMLVideoElement>(null);

  const STUN_SERVER = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const RPeerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection(STUN_SERVER)
  );

  useEffect(() => {
    const handleCallAnswered = async ({ signal }: any) => {
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

    const handleCallRejected = () => {
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

    const handleCallEnd = () => {
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
      window.location.reload();
    };

    const handleToggleCamera = ({ isTrackEnabled }: any) => {
      setCameraTurnOf({
        ...cameraTurnOf,
        peer: isTrackEnabled,
      });

      console.log("isTrackEnabled", cameraTurnOf);
    };
    socket.on("OnCallEnd", handleCallEnd);
    socket.on("OnToggleCamera", handleToggleCamera);
    socket.on("OnCallAnswered", handleCallAnswered);
    socket.on("OnCallRejected", handleCallRejected);
    socket.on("OnIncomingIceCandidate", handleIncomingIceCandidate);

    return () => {
      socket.off("OnCallEnd", handleCallEnd);
      socket.off("OnToggleCamera", handleToggleCamera);
      socket.off("OnCallAnswered", handleCallAnswered);
      socket.off("OnCallRejected", handleCallRejected);
      socket.off("OnIncomingIceCandidate", handleIncomingIceCandidate);
    };
  }, []);

  useEffect(() => {
    if (props?.do?.video.visible) {
      handleCall();
    }
  }, [props]);

  useEffect(() => {
    if (callAnswered || incomingCallAnswered) {
      if (RMyVideo.current) {
        if (!RMyVideo.current.srcObject) {
           RMyVideo.current.srcObject = MyStream as MediaStream
        }
      }
      if (RPeerVideo.current) {
        if (!RPeerVideo.current.srcObject) {
           RPeerVideo.current.srcObject = PeerStream as MediaStream
        }
      }
    }
  }, [callAnswered, incomingCallAnswered, cameraTurnOf]);

  useEffect(() => {
    if (PeerStream) {
      if (RPeerVideo.current) {
        RPeerVideo.current.srcObject = PeerStream as MediaStream;
      }
    }
  }, [PeerStream]);

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream(stream);

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
      signal: RPeerConnection.current?.localDescription,
    });
  };

  const handleIncomingCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setIncomingCallAnswered(true);

    setMyStream(stream);

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
    });
  };

  const handleCallCancel = useCallback(() => {
    dispatch(setCallState({ do: { video: { visible: false } } }));

    socket.emit("call-cancel", {
      to: props?.do.video?.data?._id,
    });
  }, [props?.do.video?.data?._id]);

  const handleCallEnd = useCallback(
    (to: string) => {
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
      window.location.reload();
    },
    [socket]
  );

  const handleToggleVideo = () => {
    if (MyStream) {
      var isTrackEnabled;
      const videoTracks = MyStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach((track: any) => {
          track.enabled = !track.enabled;
          isTrackEnabled = track.enabled;
          setCameraTurnOf({ ...cameraTurnOf, my: track.enabled });
        });
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
  console.log(cameraTurnOf);
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
      {props?.do.video?.visible && !callAnswered ? (
        <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
          <audio
            src="https://cdn.pixabay.com/audio/2022/03/15/audio_11714ca0b9.mp3"
            autoPlay
            loop
          />
          <Avatar
            data={props.do?.video?.data}
            className="size-[16pc] rounded-md"
          />
          <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-4 rounded-md gap-4 w-full">
            <span className="dark:text-bunker-200 text-bunker-600 text-md flex flex-col gap-1 items-center">
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
      ) : callAnswered ? (
        <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-[45pc] h-[33pc] overflow-hidden border-2 border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {cameraTurnOf.peer ? (
                <video
                  className="rounded-md shadow-xl w-full"
                  autoPlay
                  ref={RPeerVideo}
                  playsInline
                />
              ) : (
                <div className="rounded-md shadow-xl size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-7" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-center">
                    {props.do.video?.data?.fullName} close <br /> has camera
                  </p>
                </div>
              )}
            </div>
            <div className="absolute left-5 bottom-5 border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {cameraTurnOf.my ? (
                <video
                  className="rounded-md shadow-xl size-[12pc] object-cover"
                  autoPlay
                  muted
                  ref={RMyVideo}
                />
              ) : (
                <div className="rounded-md shadow-xl size-[12pc] dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-7" />
                  <p className="dark:text-bunker-400 text-bunker-700">
                    Camera is off
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex relative gap-3 items-center w-full justify-center p-3 dark:bg-bunker-910 bg-bunker-100 rounded-md">
            <CallTimer />
            <Icon variant="transparent">
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
            <Icon onClick={() => handleToggleVideo()} variant="transparent">
              <MdVideocamOff />
            </Icon>
            <p className="dark:text-bunker-400 text-bunker-700 font-semibold absolute right-4">
              {props.do.video?.data?.fullName}
            </p>
          </div>
        </div>
      ) : null}
      {props?.pick?.video.visible && !incomingCallAnswered ? (
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <audio
            autoPlay
            src="https://assets.mixkit.co/active_storage/sfx/1361/1361-preview.mp3"
          />
          <div className="relative p-4 rounded-md flex flex-col items-center justify-center gap-4">
            <Avatar size="size-[16pc]" data={props.pick?.video?.data} />
            <div className="flex flex-col justify-between items-center dark:bg-bunker-910 bg-bunker-100 p-4 rounded-md gap-4 w-full">
              <span className="dark:text-bunker-200 text-bunker-600 text-md">
                <b className="text-cyan-500 font-normal">
                  {props.pick?.video?.data?.fullName}
                </b>{" "}
                Calling you
              </span>
              <b className="dark:text-bunker-200 text-bunker-600 text-md animate-pulse">
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
      ) : incomingCallAnswered ? (
        <div className="p-4 rounded-md flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-[45pc] h-[33pc] overflow-hidden border-2 border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {cameraTurnOf.peer ? (
                <video
                  className="rounded-md shadow-xl w-full"
                  autoPlay
                  ref={RPeerVideo}
                  playsInline
                />
              ) : (
                <div className="rounded-md shadow-xl size-full dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-7" />
                  <p className="dark:text-bunker-400 text-bunker-700 text-center">
                    {props.pick.video?.data?.fullName} close <br /> has camera
                  </p>
                </div>
              )}
            </div>
            <div className="absolute left-5 bottom-5 border-[1px] border-bunker-300/50 dark:border-bunker-700/60 rounded-md">
              {cameraTurnOf.my ? (
                <video
                  className="rounded-md shadow-xl size-[12pc] object-cover"
                  autoPlay
                  muted
                  ref={RMyVideo}
                />
              ) : (
                <div className="rounded-md shadow-xl size-[12pc] dark:bg-bunker-920 bg-bunker-100 flex justify-center items-center gap-1 flex-col">
                  <MdVideocamOff className="text-red-400 size-7" />
                  <p className="dark:text-bunker-400 text-bunker-700">
                    Camera is off
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex relative gap-3 items-center w-full justify-center p-3 dark:bg-bunker-910 bg-bunker-100 rounded-md">
            <CallTimer />
            <Icon variant="transparent">
              <MdMicOff />
            </Icon>
            <div className="flex items-center gap-4">
              <div
                onClick={() =>
                  handleCallEnd(props?.pick?.video?.data?._id as string)
                }
                className="size-12 cursor-pointer rounded-full bg-red-300/20 flex justify-center items-center"
              >
                <MdCallEnd className="text-red-500 size-6" />
              </div>
            </div>
            <Icon onClick={() => handleToggleVideo()} variant="transparent">
              <MdVideocamOff />
            </Icon>
            <p className="dark:text-bunker-400 text-bunker-700 font-semibold absolute right-4">
              {props.pick.video?.data?.fullName}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
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
    <p className="dark:text-bunker-400 text-bunker-700 font-semibold flex gap-2 items-center absolute left-4 select-none">
      <MdTimelapse /> {formatCallDuration(callDuration)}
    </p>
  );
}

export default memo(VideoCall);
