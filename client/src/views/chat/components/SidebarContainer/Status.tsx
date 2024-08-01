import { useEffect, useRef, useState } from "react";

import {
  MdAdd,
  MdAddPhotoAlternate,
  MdClose,
  MdDelete,
  MdEmojiEmotions,
  MdSend,
} from "react-icons/md";
import { Autoplay, Grid, Navigation } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import { useSelector } from "react-redux";

import Icon from "../../../../components/interface/Icon";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

import ModalWindow from "../../../../components/interface/ModalWindow";
import Input from "../../../../components/interface/Input";
import { toastSuccess, toastWarning } from "../../../../app/Toast";
import dataURLtoBlob from "../../../../utils/dataURLtoBlob";
import EmojiPicker from "emoji-picker-react";
import api from "../../../../utils/api";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { TUser } from "../../../../app/Types";
import convertTime from "../../../../utils/ConvertTime";
import Avatar from "../../../../components/interface/Avatar";
import ToolTip from "../../../../components/interface/Tooltip";

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

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="self-start flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">
            Status
          </h1>
          <p className="text-sm dark:text-bunker-500">
            Stay updated with your friends
          </p>
        </div>
        <Icon
          onClick={() =>
            document
              .getElementById("content-bar")
              ?.classList.toggle("show-content-bar")
          }
          variant="outlined"
          className="xl:hidden"
        >
          <MdClose className="text-xl" />
        </Icon>
      </div>
      <div className="flex flex-row gap-3 w-[21.5pc]">
        <Swiper
          slidesPerView={4}
          grid={{
            rows: 1,
            fill: "row",
          }}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Grid]}
          className="mySwiper cursor-move w-max"
        >
          <SwiperSlide>
            <div
              onClick={() => setIsAddStatusVisible(true)}
              className="rounded-lg relative w-[5rem] h-[7rem] overflow-hidden shadow-bunker-950/10 shadow-xl cursor-pointer"
            >
              <div className="rounded-lg overflow-hidden h-full w-full flex justify-center items-center bg-bunker-900">
                <MdAddPhotoAlternate className="text-cyan-600" />
              </div>
              <div className="  absolute bottom-0 w-full h-8 bg-bunker-950 blur-lg" />
              <span className=" p-[2px] absolute text-bunker-100 font-normal text-xs  bottom-0 w-full text-center bg-bunker-950/20 backdrop-blur-lg ">
                Add Status
              </span>
            </div>
          </SwiperSlide>
          {statusData?.map((item) => (
            <SwiperSlide key={item._id}>
              <div
                onClick={() =>
                  setStatusPreview({
                    visible: true,
                    media: item.mediaStatus,
                    user: item,
                  })
                }
                className="rounded-lg relative w-[5rem] h-[7rem] overflow-hidden shadow-bunker-950/10 shadow-xl cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden h-full w-full">
                  <Avatar
                    size="full"
                    className="!object-cover h-full w-full"
                    data={item}
                  />
                </div>
                <div className="  absolute bottom-0 w-full h-8 bg-bunker-950 blur-lg" />
                <span className=" p-[2px] truncate absolute text-bunker-100 font-normal text-xs  bottom-0 w-full text-center bg-bunker-950/20 backdrop-blur-lg ">
                  {item._id === profileData?._id ? "You" : item.fullName}
                </span>
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
      <div className="h-[50pc] w-[50pc] bg-bunker-920s p-4 rounded-md flex flex-col gap-4">
        <div className="dark:bg-bunker-920 bg-bunker-100 p-4 rounded-md flex flex-row justify-between items-center gap-4">
          <div className="flex gap-2 items-center">
            <Avatar size="xxl" data={props?.statusPreview?.user} />
            <div>
              <h1 className="text-2xl font-semibold dark:text-bunker-300">
                {props?.statusPreview?.user?.fullName}
              </h1>
              <p className="text-sm dark:text-bunker-500 w-[12pc]">
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
                <Icon onClick={handleDeleteStatus} variant="transparent">
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
          {/* <div className="w-full bg-gray-200  h-1 mb-4 dark:bg-gray-700 absolute top-0 z-10">
                  <div
                    ref={RProgressbar}
                    className="bg-gray-600 h-1 dark:bg-cyan-500"
                  />
                </div> */}
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            loop={false}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: false,
            }}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="mySwiper flex justify-center"
            onSlideChange={(e: any) =>
              RTimeSwiper.current.swiper.slideTo(e.activeIndex)
            }
          >
            {props?.statusPreview.media &&
              props?.statusPreview?.media.map((media) => (
                <SwiperSlide
                  className="flex flex-col justify-center items-center relative cursor-grab"
                  key={media.createdAt}
                >
                  <img
                    className="h-[40pc] relative z-10"
                    src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?filename=${media.file}&_id=${props?.statusPreview.user?._id}&type=user&format=status`}
                    alt=""
                  />
                  <img
                    className="absolute blur-md w-full h-full"
                    src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/messageImage?filename=${media.file}&_id=${props?.statusPreview.user?._id}&type=user&format=status`}
                    alt=""
                  />
                  <p>{media.caption}</p>
                  <h1 className="z-10 absolute bg-bunker-900/10 backdrop-blur-md bottom-0 w-full text-bunker-100 font-normal text-lg text-center p-3">
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
      // if (file?.size > 2 * 1024 * 1024)
      //   return toastWarning("File size should be less than 2MB");

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
      <div className="flex h-[30pc] relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center justify-between">
            <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
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
        <div className="h-full w-full flex justify-center items-center">
          {addStatus.media.type == "image" && (
            <img
              className="h-[12pc] bg-bunker-900 rounded-lg"
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
              className="h-[14pc] rounded-lg"
            />
          )}
          {!addStatus.media.type && (
            <div className="h-full w-full border-[1px] text-bunker-100 border-bunker-700/70 flex justify-center items-center bg-bunker-900 rounded-lg">
              No Media
            </div>
          )}
        </div>
        <Input
          onChange={(e) =>
            setAddStatus({ ...addStatus, caption: e.target.value })
          }
          value={addStatus.caption}
          placeholder="Add a caption"
          className="w-full"
        />
        <div className="flex gap-3 relative items-center justify-between">
          <div className="flex gap-3 items-center">
            <Icon variant="dark-filled">
              <label htmlFor="status-image" className="cursor-pointer">
                <MdAdd className="text-bunker-100" />
              </label>
              <input
                onChange={handleMedia}
                type="file"
                id="status-image"
                hidden
                accept=""
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
