import { useRef, useState } from "react";

import {
  MdAdd,
  MdAddPhotoAlternate,
  MdClose,
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

import Home from "./Home/index";
import Favorite from "./Favorite";
import Files from "./Files";
import Contacts from "./Contacts";
import Profile from "./Profile";
import ModalWindow from "../../../../components/interface/ModalWindow";
import Input from "../../../../components/interface/Input";
import { toastWarning } from "../../../../app/Toast";
import dataURLtoBlob from "../../../../utils/dataURLtoBlob";
import EmojiPicker from "emoji-picker-react";
import Dropdown from "../../../../components/interface/Dropdown";
import { BsEmojiAngry } from "react-icons/bs";
import api from "../../../../utils/api";

type Props = {};

function ContentBar({}: Props) {
  const changeContentBarState = useSelector(
    (state: any) => state.changeContentBar
  );

  return (
    <div
      id="content-bar"
      className="dark:bg-bunker-920 ml-4 bg-white p-6 flex flex-col items-center gap-8 w-max h-full z-40 absolute- translate-x-[-30pc]- xl:relative- xl:translate-x-0-"
    >
      <Status />
      <div className="w-fulls h-full flex-auto overflow-y-auto flex flex-col gap-4 w-[21.7pc]">
        {changeContentBarState == "home" ? <Home /> : null}
        {changeContentBarState == "favorite" ? <Favorite /> : null}
        {changeContentBarState == "files" ? <Files /> : null}
        {changeContentBarState == "contacts" ? <Contacts /> : null}
        {changeContentBarState == "profile" ? <Profile /> : null}
      </div>
    </div>
  );
}

function Status() {
  const [isStatusPreview, setIsStatusPreview] = useState(false);
  const [addStatus, setAddStatus] = useState({
    visible: false,
    media: {
      type: null,
      data: null,
    },
    caption: "",
  });
  const [isEmojiBox, setIsEmojiBox] = useState<boolean>(false);
  const statusData = [
    {
      user: "Kunal",
      status: [
        { url: "", type: "video", createdTime: "10:30 AM" },
        { url: "", type: "photo", createdTime: "10:30 AM" },
        { url: "", type: "video", createdTime: "10:30 AM" },
      ],
      avatar:
        "https://angular.pixelstrap.net/chitchat/assets/images/avtar/2.jpg",
    },
    {
      user: "divya",
      status: [
        { url: "", type: "video", createdTime: "10:30 AM" },
        { url: "", type: "photo", createdTime: "10:30 AM" },
        { url: "", type: "video", createdTime: "10:30 AM" },
      ],
      avatar:
        "https://angular.pixelstrap.net/chitchat/assets/images/avtar/big/audiocall.jpg",
    },
    {
      user: "shakil",
      status: [
        { url: "", type: "video", createdTime: "10:30 AM" },
        { url: "", type: "photo", createdTime: "10:30 AM" },
        { url: "", type: "video", createdTime: "10:30 AM" },
      ],
      avatar:
        "https://angular.pixelstrap.net/chitchat/assets/images/avtar/1.jpg",
    },
    {
      user: "karan",
      status: [
        { url: "", type: "video", createdTime: "10:30 AM" },
        { url: "", type: "photo", createdTime: "10:30 AM" },
        { url: "", type: "video", createdTime: "10:30 AM" },
      ],
      avatar:
        "https://angular.pixelstrap.net/chitchat/assets/images/avtar/3.jpg",
    },
    {
      user: "satayma",
      status: [
        { url: "", type: "video", createdTime: "10:30 AM" },
        { url: "", type: "photo", createdTime: "10:30 AM" },
        { url: "", type: "video", createdTime: "10:30 AM" },
      ],
      avatar:
        "https://angular.pixelstrap.net/chitchat/assets/images/avtar/5.jpg",
    },
  ];
  const statusList = [
    "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2129796/pexels-photo-2129796.png?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

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

    api.post(
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
    );
  };

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
              onClick={() => setAddStatus((pre) => ({ ...pre, visible: true }))}
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
          {statusData.map((i) => (
            <SwiperSlide>
              <div
                onClick={() => setIsStatusPreview(true)}
                className="rounded-lg relative w-[5rem] h-[7rem] overflow-hidden shadow-bunker-950/10 shadow-xl cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden h-full w-full">
                  <img
                    src={i.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="  absolute bottom-0 w-full h-8 bg-bunker-950 blur-lg" />
                <span className=" p-[2px] absolute text-bunker-100 font-normal text-xs  bottom-0 w-full text-center bg-bunker-950/20 backdrop-blur-lg ">
                  {i.user}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {isStatusPreview ? (
        <div className="w-full h-full flex justify-center items-center fixed bg-bunker-300/50 dark:bg-bunker-950/60 top-0 left-0 right-0 bottom-0 z-50">
          <div className="h-[50pc] w-[50pc] bg-bunker-920s p-4 rounded-md flex flex-col gap-4">
            <div className="dark:bg-bunker-920 bg-bunker-100 p-4 rounded-md flex flex-row justify-between items-center gap-4">
              <div className="flex gap-2 items-center">
                <img
                  src="https://angular.pixelstrap.net/chitchat/assets/images/avtar/1.jpg"
                  alt=""
                  className="rounded-md"
                />
                <div>
                  <h1 className="text-2xl font-semibold dark:text-bunker-300">
                    kunal lokhade
                  </h1>
                  <p className="text-sm dark:text-bunker-500">12.21.1002</p>
                </div>
              </div>
              <Icon
                onClick={() => setIsStatusPreview(false)}
                variant="transparent"
              >
                <MdClose />
              </Icon>
            </div>
            <div className="flex flex-row gap-3 relative">
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                loop={false}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper flex justify-center rounded-md"
              >
                {statusList.map((i) => (
                  <SwiperSlide className="flex flex-col justify-center items-center relative cursor-grab">
                    <img className="h-[40pc] relative z-10" src={i} alt="" />
                    <img
                      className="absolute blur-md w-full h-full"
                      src={i}
                      alt=""
                    />
                    <h1 className="z-10 absolute bg-bunker-900/10 backdrop-blur-md bottom-0 w-full text-bunker-100 font-normal text-lg text-center p-3">
                      112312 sad asdas das
                    </h1>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      ) : null}

      {addStatus.visible && (
        <ModalWindow>
          <div className="flex h-[30pc] relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center justify-between">
                <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
                  Add Status
                </p>
                <Icon
                  onClick={() =>
                    setAddStatus((pre) => ({ ...pre, visible: false }))
                  }
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
      )}
    </div>
  );
}

export default ContentBar;
