import { useEffect, useRef, useState } from "react";

import {
  MdAdd,
  MdSend,
  MdClose,
  MdDelete,
  MdEmojiEmotions,
  MdAddPhotoAlternate,
} from "react-icons/md";
import { Autoplay, Navigation } from "swiper/modules";
import { SwiperSlide, Swiper, SwiperClass } from "swiper/react";
import { useSelector } from "react-redux";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { TUser } from "../../../../app/Types";
import { toastChoice, toastSuccess, toastWarning } from "../../../../app/Toast";

import "swiper/css/pagination";

import ModalWindow from "../../../../components/interface/ModalWindow";
import Input from "../../../../components/interface/Input";
import Icon from "../../../../components/interface/Icon";
import dataURLtoBlob from "../../../../utils/dataURLtoBlob";
import EmojiPicker from "emoji-picker-react";
import api from "../../../../utils/api";
import convertTime from "../../../../utils/ConvertTime";
import Avatar from "../../../../components/interface/Avatar";
import ToolTip from "../../../../components/interface/Tooltip";
import socket from "../../../../app/Socket";

type TStatusPreview = {
  visible: boolean;
  media?: {
    createdAt: Date | any;
    type: string | any;
    file: string | any;
    caption: string | any;
  }[];
  user?: {
    _id?: string;
    fullName?: string;
    isAvatar?: boolean;
    avatarColor?: string;
  };
};

type TStatusPreviewProps = {
  props: {
    statusPreview: TStatusPreview;
    setStatusPreview: (param: TStatusPreview) => void;
    setRefreshStatus: (prev: any) => void;
  };
};

type TAddStatus = {
  props: {
    setIsAddStatusVisible: (param: boolean) => void;
    setRefreshStatus: (prev: any) => void;
  };
};

function Status() {
  const [statusPreview, setStatusPreview] = useState<TStatusPreview>();
  const [isAddStatusVisible, setIsAddStatusVisible] = useState<boolean>(false);
  const [statusData, setStatusData] = useState<TUser[]>();
  const [refreshStatus, setRefreshStatus] = useState<boolean>(true);
  const RProgressbar = useRef<HTMLDivElement>(null);

  const profileData: TUser = useSelector((state: any) => state.UserAccountData);

  useEffect(() => {
    api
      .post("api/user/getMediaStatus", { contacts: profileData.contacts })
      .then((Res) => setStatusData(Res.data))
      .catch((Err) => handleCatchError(Err));
  }, [profileData, refreshStatus]);

  useEffect(() => {
    socket.on("status-refresh", () => setRefreshStatus((prev: any) => !prev));
    return () => {
      socket.off("status-refresh");
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:gap-8 w-full">
      <div className="self-start hidden items-center justify-between w-full sm:flex">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">
            Status
          </h1>
          <p className="text-sm dark:text-bunker-500">
            Stay updated with your friends
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 sm:gap-3 w-full md:w-[21.5pc] overflow-y-auto no-scrollbar select-none">
        <Swiper
          slidesPerView={5}
          spaceBetween={5}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="mySwiper cursor-move w-max"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <div
              onClick={() => setIsAddStatusVisible(true)}
              className="relative size-[3.6rem] sm:w-[5rem] sm:h-[7rem] rounded-full sm:rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="rounded-lg overflow-hidden h-full w-full flex justify-center items-center dark:bg-bunker-900 bg-bunker-50">
                <MdAddPhotoAlternate className="text-cyan-600" />
              </div>
              <span className="sm:block hidden p-[2px] absolute dark:text-bunker-100 font-normal text-xs bottom-0 w-full text-center bg-bunker-300 text-bunker-50 dark:bg-bunker-950/20 backdrop-blur-lg ">
                Add Status
              </span>
            </div>
          </SwiperSlide>
          {statusData?.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="bg-gradient-to-l size-[3.8rem] sm:w-[5.2rem] sm:h-[7.2rem] from-cyan-400 via-cyan-600 to-blue-600 flex justify-center items-center sm:rounded-lg rounded-full">
                <div
                  onClick={() =>
                    setStatusPreview({
                      visible: true,
                      media: item.mediaStatus,
                      user: item,
                    })
                  }
                  key={item._id}
                  className="relative size-[3.6rem] sm:w-[5rem] sm:h-[7rem] rounded-full sm:rounded-lg overflow-hidden cursor-pointer border-249 border-bunker-900s p-0.5 dark:bg-bunker-900 bg-white"
                >
                  <div className="rounded-full sm:rounded-lg overflow-hidden h-full w-full">
                    <Avatar
                      size="full"
                      className="!object-cover h-full w-full rounded-lg"
                      data={item}
                    />
                  </div>
                  <span className="sm:block hidden p-[2px] truncate absolute text-bunker-100 font-normal text-xs bottom-0 w-full text-center bg-bunker-950/20 backdrop-blur-lg ">
                    {item._id === profileData?._id ? "You" : item.fullName}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {statusPreview?.visible && (
        <StatusPreview
          props={{ statusPreview, setStatusPreview, setRefreshStatus }}
        />
      )}
      {isAddStatusVisible && (
        <AddStatus props={{ setIsAddStatusVisible, setRefreshStatus }} />
      )}
    </div>
  );
}

function StatusPreview({ props }: TStatusPreviewProps) {
  const RTimeSwiper = useRef<any>(null);
  const profileData: TUser = useSelector((state: any) => state.UserAccountData);

  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleSlideChange = (swiper: SwiperClass) => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide.querySelector("video");
    if (video) {
      video?.play();
    }
  };

  const handleDeleteStatus = () => {
    const index = RTimeSwiper.current?.swiper?.activeIndex;
    api
      .post("/api/user/deleteMediaStatus", { index })
      .then((Res) => {
        toastSuccess(Res.data);
        props?.setRefreshStatus((prev: any) => !prev);
        props?.setStatusPreview({
          visible: false,
        });
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <div className="sm:h-[50pc] h-full w-full sm:w-[50pc] bg-bunker-920s p-1 sm:p-4 rounded-md flex flex-col gap-2 sm:gap-4">
        <div className="dark:bg-bunker-920 bg-bunker-50 p-2 sm:p-4 rounded-md flex flex-row justify-between items-center gap-4">
          <div className="flex gap-2 items-center">
            <Avatar size="xxl" data={props?.statusPreview?.user} />
            <div>
              <h1 className="text-md sm:text-2xl font-semibold dark:text-bunker-300">
                {props?.statusPreview?.user?.fullName}
              </h1>
              <p className="text-xs sm:text-sm dark:text-bunker-500 w-[4pc] sm:w-[12pc]">
                <Swiper
                  ref={RTimeSwiper}
                  centeredSlides={true}
                  className="mySwiper flex justify-center rounded-md"
                >
                  {props?.statusPreview.media &&
                    props?.statusPreview?.media.map((media) => (
                      <SwiperSlide key={media.createdAt}>
                        {convertTime(media.createdAt, "day")}
                      </SwiperSlide>
                    ))}
                </Swiper>
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {props?.statusPreview.user?._id === profileData?._id && (
              <ToolTip id="delete-status" content="Delete Status ?">
                <Icon
                  onClick={() =>
                    toastChoice(() => handleDeleteStatus(), "You are sure ?")
                  }
                  variant="transparent"
                >
                  <MdDelete />
                </Icon>
              </ToolTip>
            )}
            <Icon
              onClick={() => props.setStatusPreview({ visible: false })}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        </div>
        <div className="flex flex-row rounded-md gap-3 relative overflow-hidden">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            loop={false}
            autoplay={{
              delay: 100000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: false,
            }}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="mySwiper flex justify-center"
            onSlideChange={(e: SwiperClass) => {
              handleSlideChange(e);
              RTimeSwiper.current.swiper.slideTo(e.activeIndex);
            }}
          >
            {props?.statusPreview.media &&
              props?.statusPreview?.media.map((media) => (
                <SwiperSlide
                  className="flex dark:bg-bunker-910 bg-bunker-50 flex-col justify-center items-center relative cursor-grab"
                  key={media.createdAt}
                >
                  {media.type === "image" && (
                    <div className="h-[40pc] flex">
                      <img
                        className="h-fit self-center sm:h-[40pc] relative z-10"
                        src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props?.statusPreview.user?._id}/status/${media.file}`}
                        alt=""
                      />
                      <img
                        className="absolute blur-md w-full h-full opacity-50"
                        src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props?.statusPreview.user?._id}/status/${media.file}`}
                        alt=""
                      />
                    </div>
                  )}
                  {media.type === "video" && (
                    <video
                      ref={(el) => videoRefs.current.push(el as any)}
                      src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/user-${props?.statusPreview.user?._id}/status/${media.file}`}
                      className="h-[40pc] relative z-10"
                      loop
                    />
                  )}
                  <h1 className="z-10 absolute dark:bg-bunker-920 bg-bunker-100 backdrop-blur-md bottom-0 w-full dark:text-bunker-100 text-bunker-800 font-normal text-lg text-center p-3">
                    {media.caption as string}
                  </h1>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </ModalWindow>
  );
}

function AddStatus({ props }: TAddStatus) {
  const [addStatus, setAddStatus] = useState({
    media: {
      type: null,
      data: null,
      name: null,
    },
    caption: "",
  });
  const [isEmojiBox, setIsEmojiBox] = useState<boolean>(false);
  const RMediaStatusImage = useRef<HTMLImageElement>(null);
  const RMediaStatusVideo = useRef<HTMLVideoElement>(null);

  const handleMedia = (param: React.ChangeEvent<HTMLInputElement>): void => {
    const file = param.target.files?.[0];

    if (file) {
      if (file?.size > 20 * 1024 * 1024)
        return toastWarning("File size should be less than 20MB");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const blob = dataURLtoBlob(reader.result as string);

        if (blob.type.includes("image")) {
          setAddStatus((pre: any) => ({
            ...pre,
            media: {
              type: "image",
              data: blob,
              name: file.name,
            },
          }));
          setTimeout(() => {
            RMediaStatusImage.current!.src = reader.result as string;
          }, 1000);
        }
        if (blob.type.includes("video")) {
          setAddStatus((pre: any) => ({
            ...pre,
            media: {
              type: "video",
              data: blob,
              name: file.name,
            },
          }));
          setTimeout(() => {
            RMediaStatusVideo.current!.src = reader.result as string;
          }, 1000);
        }
      };
    }
  };

  const handleSendStatus = () => {
    if (!addStatus.caption) return toastWarning("Please add caption");

    if (!addStatus.media.data) return toastWarning("Please add media");

    api
      .post(
        "/api/user/setMediaStatus",
        {
          media: addStatus.media,
          caption: addStatus.caption,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((Res) => {
        toastSuccess(Res.data);
        setAddStatus({
          caption: "",
          media: {
            data: null,
            name: null,
            type: null,
          },
        });
        props?.setIsAddStatusVisible(false);
        props?.setRefreshStatus((prev: any) => !prev);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <div className="flex sm:w-max w-full relative flex-col gap-2 sm:gap-3 p-4 sm:p-5 dark:bg-bunker-910 bg-bunker-50 rounded-md justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center justify-between">
            <p className="text-md sm:text-lg font-semibold dark:text-bunker-300 text-bunker-600">
              Add Status
            </p>
            <Icon
              onClick={() => props.setIsAddStatusVisible(false)}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        </div>
        <div className="h-[20pc] w-full flex justify-center items-center">
          {addStatus.media.type == "image" && (
            <img
              className="h-[12pc] dark:bg-bunker-900 rounded-lg"
              ref={RMediaStatusImage}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/ejLXNwAAAAASUVORK5CYII="
              alt=""
            />
          )}
          {addStatus.media.type == "video" && (
            <video
              src=""
              ref={RMediaStatusVideo}
              controls
              className="h-[16pc] w-full rounded-lg"
            />
          )}
          {!addStatus.media.type && (
            <label
              htmlFor="status-media"
              className="sm:text-base text-sm h-full w-full border-[1px] text-bunker-800 dark:text-bunker-100 dark:border-bunker-700/40 flex justify-center items-center bg-white cursor-pointer rounded-lg dark:bg-bunker-900"
            >
              No Media
            </label>
          )}
        </div>
        <Input
          onChange={(e) =>
            setAddStatus({ ...addStatus, caption: e.target.value })
          }
          value={addStatus.caption}
          placeholder="Add a caption"
          className="w-full h-10"
        />
        <div className="flex gap-3 relative items-center justify-between">
          <div className="flex gap-3 items-center">
            <Icon variant="dark-filled">
              <label htmlFor="status-media" className="cursor-pointer">
                <MdAdd />
              </label>
              <input
                onChange={handleMedia}
                type="file"
                id="status-media"
                hidden
                accept="image/*,video/*"
              />
            </Icon>
            <Icon
              onClick={() => setIsEmojiBox(!isEmojiBox)}
              variant="dark-filled"
              active={isEmojiBox}
            >
              <MdEmojiEmotions />
            </Icon>
            {isEmojiBox && (
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setAddStatus((pre: any) => ({
                    ...pre,
                    caption: pre.caption + emoji.emoji,
                  }));
                }}
                searchDisabled
                skinTonesDisabled
                className="z-10 scale-90 !absolute bottom-[1.6pc] right-3 dark:!bg-bunker-900 !border-[1px] !text-bunker-100 !border-bunker-700/70 !size-[18pc]"
              />
            )}
          </div>
          <Icon onClick={handleSendStatus} variant="dark-filled">
            <MdSend />
          </Icon>
        </div>
      </div>
    </ModalWindow>
  );
}

export default Status;
