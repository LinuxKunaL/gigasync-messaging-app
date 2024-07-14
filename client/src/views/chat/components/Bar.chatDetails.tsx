import { useEffect, useState } from "react";
import Icon from "../../../components/interface/Icon";
import {
  MdAndroid,
  MdApps,
  MdArrowBack,
  MdBackupTable,
  MdCopyAll,
  MdCss,
  MdDelete,
  MdDomain,
  MdDownload,
  MdFileCopy,
  MdHtml,
  MdImage,
  MdInfo,
  MdInfoOutline,
  MdInsertPhoto,
  MdJavascript,
  MdKeyboardVoice,
  MdLink,
  MdMoreVert,
  MdOutlineBlock,
  MdOutlineDocumentScanner,
  MdOutlineFavorite,
  MdOutlineFileOpen,
  MdOutlineFilePresent,
  MdOutlineNotifications,
  MdOutlinePlayCircleOutline,
  MdPictureAsPdf,
  MdPlayArrow,
  MdRoundaboutLeft,
  MdVideocam,
  MdVoiceChat,
  MdVoiceOverOff,
} from "react-icons/md";
import Switch from "../../../components/interface/Switch";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import Dropdown from "../../../components/interface/Dropdown";
import { FaInbox } from "react-icons/fa";
import ToolTip from "../../../components/interface/Tooltip";
import { setChatDetails } from "../../../app/Redux";
import TabNavigation from "../../../components/interface/TabNavigation";
import api from "../../../utils/api";
import { handleCatchError } from "../../../utils/ErrorHandle";
import { TUser } from "../../../app/Types";
import Avatar from "../../../components/interface/Avatar";

type modifiedLinkTypes = {
  link: string;
  title: string;
};

type TMedia = {
  images: string[] | any;
  videos: string[] | any;
};

type TChatProfileDetails = {
  media?: TMedia | undefined;
  userTo?: TUser;
};

function ChatDetailsBar({}: any) {
  const [filesTab, setFilesTab] = useState<string>("media");
  const [chatProfileDetails, setChatProfileDetails] =
    useState<TChatProfileDetails>();
  const SChatDetails = useSelector((state: any) => state.chatDetails);
  const SMyProfileDetails = useSelector((state: any) => state.UserAccountData);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/user/getChatWithinData", {
        me: SMyProfileDetails._id,
        to: SChatDetails.id,
      })
      .then((res) => {
        console.log(res.data);

        setChatProfileDetails(res.data);
      })
      .catch((Err) => handleCatchError(Err));
  }, []);

  return (
    <div className="dark:bg-bunker-920 bg-white h-full w-[25pc] p-6 flex flex-col items-stretch gap-8 z-20">
      <div className="flex w-full justify-between items-center">
        <Icon
          onClick={() => {
            dispatch(
              setChatDetails({
                visible: false,
                id: null,
              })
            );
          }}
          variant="transparent"
        >
          <MdArrowBack />
        </Icon>{" "}
        <div className="self-start">
          <h1 className="text-2xl font-semibold dark:text-bunker-300">
            Chat details
          </h1>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar data={chatProfileDetails?.userTo} rounded />
          <div>
            <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
              {chatProfileDetails?.userTo?.fullName}
            </h1>
            <span className="flex items-center text-bunker-400 text-sm gap-4 ">
              <p className="dark:text-cyan-500 text-cyan-600">
                @{chatProfileDetails?.userTo?.username}
              </p>
              <Icon variant="transparent">
                <MdCopyAll className=" cursor-pointer" />
              </Icon>
            </span>
          </div>
        </div>
        <Dropdown
          options={[
            {
              element: (
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="block"
                    className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer"
                  >
                    <MdOutlineBlock className="text-lg text-cyan-500" /> block
                  </label>
                  <Switch id="block" size={"small"} />
                </div>
              ),
            },
            {
              element: (
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="favorite"
                    className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer"
                  >
                    <MdOutlineFavorite className="text-lg text-cyan-500" />
                    Favorite
                  </label>
                  <Switch id="favorite" size={"small"} />
                </div>
              ),
            },
            {
              element: (
                <div className="flex items-center justify-between gap-2">
                  <label className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer">
                    <MdOutlineBlock className="text-lg text-cyan-500" /> Delete
                    chat
                  </label>
                </div>
              ),
            },
          ]}
          placement="left"
        >
          <Icon variant="transparent">
            <MdMoreVert />
          </Icon>
        </Dropdown>
      </div>
      <p className="text-md font-normal dark:text-bunker-300 text-bunker-500">
        {chatProfileDetails?.userTo?.profile?.about}
      </p>
      <hr className="dark:border-bunker-800 border-bunker-200" />
      <div className="flex items-center justify-between">
        <span className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdOutlineNotifications className="text-lg text-cyan-500" />
          Notification
        </span>
        <Switch size="small" />
      </div>
      <hr className="dark:border-bunker-800 border-bunker-200" />
      <div className="dark:bg-bunker-950 bg-bunker-50 p-2 rounded-lg flex space-x-4 w-max">
        <TabNavigation
          activeTab={filesTab}
          onTabActive={setFilesTab}
          tabTitle={["media", "files", "links", "voice"]}
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar w-full h-full">
        {filesTab === "media" && (
          <MediaTab
            mediaImages={chatProfileDetails?.media?.images}
            mediaVideos={chatProfileDetails?.media?.videos}
          />
        )}
        {filesTab === "files" && <FilesTab />}
        {filesTab === "links" && <LinksTab />}
        {filesTab === "voice" && <VoiceTab />}
      </div>
    </div>
  );
}

type MediaTabProps = {
  mediaImages: string[];
  mediaVideos: string[];
};

function MediaTab({ mediaImages, mediaVideos }: MediaTabProps): JSX.Element {
  console.log(mediaVideos);

  return (
    <>
      <div className="flex flex-col gap-3">
        <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdImage className="text-lg text-cyan-500" /> images
        </span>
        <div className="flex flex-wrap gap-4 relative overflow-hidden">
          {mediaImages?.length > 0 ? (
            <Swiper
              slidesPerView={2.3}
              grid={{
                rows: 2,
                fill: "row",
              }}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Grid]}
              className="mySwiper cursor-grabd cursor-move"
            >
              {mediaImages?.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="size-[150px] rounded-lg overflow-hidden border-[1px] border-cyan-400/50 cursor-pointer ">
                    <img
                      src={url}
                      className="rounded-lg h-full object-cover w-full hover:scale-105"
                      alt={`Demo Photo ${index + 1}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="m-auto h-[10pc] flex flex-col gap-3 items-center text-center justify-center">
              <MdImage className="text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-sm">You have no images</p>
            </div>
          )}
          <div className="absolute -top-10 -bottom-10 -left-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" />
          <div className="absolute -top-10 -bottom-10 -right-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdVideocam className="text-lg text-cyan-500" /> videos
        </span>
        <div className="flex flex-wrap gap-4 relative overflow-hidden">
          {mediaVideos?.length > 0 ? (
            <Swiper
              slidesPerView={2.3}
              grid={{
                rows: 2,
                fill: "row",
              }}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Grid]}
              className="mySwiper cursor-move gap-2"
            >
              {mediaVideos?.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="size-[150px] rounded-lg overflow-hidden border-[1px] border-cyan-400/50 cursor-pointer ">
                    <video
                      src={url}
                      className="rounded-lg h-full object-cover w-full hover:scale-105"
                      muted
                      controls={false}
                    />
                    <div className="z-10 bg-bunker-900/50 hover:bg-bunker-900/80 flex items-center justify-center top-0 bottom-0 left-0 right-0 size-full absolute">
                      <MdOutlinePlayCircleOutline className="text-bunker-300 text-3xl" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="m-auto h-[10pc] flex flex-col gap-3 items-center text-center justify-center">
              <MdVideocam className="text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-sm">You have no video</p>
            </div>
          )}
          <div className="absolute -top-10 -bottom-10 -left-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" />
          <div className="absolute -top-10 -bottom-10 -right-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" />
        </div>
      </div>
    </>
  );
}
function FilesTab() {
  const files = [
    {
      name: "File.apk",
      size: "2.5MB",
      icon: <MdAndroid />,
      color: "red",
      time: "1-1-2022",
    },
    {
      name: "DemoFile.pdf",
      size: "2.5MB",
      icon: <MdPictureAsPdf />,
      time: "1-1-2022",
      color: "pink",
    },
    {
      name: "DemoFile.pdf",
      size: "2.5MB",
      icon: <MdPictureAsPdf />,
      time: "1-1-2022",
      color: "pink",
    },
    {
      name: "DemoFile.csv",
      size: "2.5MB",
      icon: <MdBackupTable />,
      time: "1-1-2022",
      color: "green",
    },

    {
      name: "DemoFile.xls",
      size: "2.5MB",
      icon: <MdBackupTable />,
      time: "1-1-2022",
      color: "green",
    },
    {
      name: "DemoFile.doc",
      size: "2.5MB",
      icon: <MdOutlineDocumentScanner />,
      time: "1-1-2022",
      color: "blue",
    },
    {
      name: "DemoFile.css",
      size: "2.5MB",
      icon: <MdCss />,
      time: "1-1-2022",
      color: "sky",
    },
    {
      name: "DemoFile.svg",
      size: "2.5MB",
      icon: <MdInsertPhoto />,
      time: "1-1-2022",
      color: "yellow",
    },
    {
      name: "DemoFile.html",
      size: "2.5MB",
      icon: <MdHtml />,
      time: "1-1-2022",
      color: "brown",
    },
    {
      name: "DemoFile.js",
      size: "2.5MB",
      icon: <MdJavascript />,
      time: "1-1-2022",
      color: "yellow",
    },
  ];

  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdOutlineFilePresent className="text-lg text-cyan-500" /> Files
      </span>
      <div className="flex flex-col gap-6">
        {files.map((i) => (
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Icon variant="active">{i.icon}</Icon>
              <div>
                <h3 className="font-semibold dark:text-bunker-200 text-bunker-600">
                  {i.name}
                </h3>
                <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                  {i.size}
                  <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                  {i.time}
                </p>
              </div>
            </div>
            <Dropdown
              options={[
                {
                  element: (
                    <div className="flex gap-3 items-center cursor-pointer">
                      <MdDelete className="size-6" />
                      delete
                    </div>
                  ),
                },
                {
                  element: (
                    <div className="flex gap-3 items-center cursor-pointer">
                      <MdDownload className="size-6" />
                      download
                    </div>
                  ),
                },
              ]}
              placement="left"
            >
              <Icon variant="transparent">
                {" "}
                <MdMoreVert />
              </Icon>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  );
}
function LinksTab() {
  const links = [
    "https://tailwindcss.com/docs/scroll-margin",
    "https://www.figma.com",
    "https://kunallokhande.vercel.app",
    "https://www.figma.com/design/LkJBE35G5TaDgUzrZXsxGA/gigasky?node-id=0-1&t=6WZaRRDEUxAwm2ju-0",
  ];

  const [modifiedLink, setModifiedLink] = useState<modifiedLinkTypes[]>([]);

  useEffect(() => {
    api
      .post("/api/default/getLinksPreview", links)
      .then((res) => {
        setModifiedLink(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdLink className="text-lg text-cyan-500" /> Links
      </span>
      <div className="flex flex-col gap-6 h-full">
        {links.length > 0 ? (
          modifiedLink.length > 0 ? (
            modifiedLink.map((url) => (
              <div className="flex gap-2 w-[22pc] p-2">
                <img
                  src="https://angular.pixelstrap.net/chitchat/assets/images/contact/1.jpg"
                  alt=""
                  className="rounded-md"
                />
                <div>
                  <h1 className="text-sm font-semibold dark:text-bunker-200 text-bunker-600">
                    {url?.title}
                  </h1>
                  <Link
                    className="text-xs underline dark:text-cyan-600/80 text-bunker-400"
                    to={""}
                    target="_blank"
                  >
                    {url?.link}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((key) => (
              <div
                key={key}
                className="flex gap-2 w-[22pc] dark:bg-bunker-900/20 bg-bunker-400/10 p-2 animate-pulse rounded-md"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  alt=""
                  className="size-16 animate-pulse dark:bg-bunker-700/50 bg-bunker-300/40 rounded-md"
                />
                <div className="flex flex-col gap-2">
                  <h1 className="text-sm font-semibold h-5 w-44 dark:bg-bunker-700/50 bg-bunker-300/40 rounded-md" />
                  <div className="h-9 w-52 dark:bg-bunker-700/50 bg-bunker-300/40 text-xs rounded-md animate-pulse" />
                </div>
              </div>
            ))
          )
        ) : (
          <div className="w-[22pc] h-full flex flex-col items-center justify-center">
            <FaInbox className="text-xl text-red-400" />
            <p className="text-sm dark:text-bunker-300 text-bunker-500">
              links not found
            </p>
          </div>
        )}
      </div>
    </>
  );
}
function VoiceTab() {
  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdKeyboardVoice className="text-lg text-cyan-500" /> Voice
      </span>
      <div className="flex flex-col gap-6 h-full">
        {[1, 2, 3, 4, 5, 6].map((audio) => (
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <ToolTip id={`recording-${audio}`} content="play">
                <Icon variant="active">
                  <MdPlayArrow />
                </Icon>
              </ToolTip>
              <div>
                <h3 className="font-semibold dark:text-bunker-200 text-bunker-600">
                  Recording-12-1-1333
                </h3>
                <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                  1 MB
                  <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                  12.1.1333
                </p>
              </div>
            </div>
            <Dropdown
              options={[
                {
                  element: (
                    <div className="flex gap-3 items-center cursor-pointer">
                      <MdDelete className="size-6" />
                      delete
                    </div>
                  ),
                },
                {
                  element: (
                    <div className="flex gap-3 items-center cursor-pointer">
                      <MdDownload className="size-6" />
                      download
                    </div>
                  ),
                },
              ]}
              placement="left"
            >
              <Icon variant="transparent">
                {" "}
                <MdMoreVert />
              </Icon>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatDetailsBar;
