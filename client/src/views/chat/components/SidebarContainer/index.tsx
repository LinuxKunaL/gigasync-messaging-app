import { useState } from "react";

import { MdClose } from "react-icons/md";
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
    </div>
  );
}

export default ContentBar;
