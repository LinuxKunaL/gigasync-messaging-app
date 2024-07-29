import { useEffect, useRef, useState } from "react";
import Icon from "../../../components/interface/Icon";
import {
  MdAndroid,
  MdArrowBack,
  MdBackupTable,
  MdChat,
  MdClose,
  MdCopyAll,
  MdCss,
  MdDelete,
  MdDownload,
  MdEdit,
  MdHtml,
  MdImage,
  MdInfo,
  MdInsertPhoto,
  MdJavascript,
  MdKeyboardVoice,
  MdLink,
  MdMoreVert,
  MdOpenInNew,
  MdOutlineBlock,
  MdOutlineDocumentScanner,
  MdOutlineFavorite,
  MdOutlineFilePresent,
  MdOutlineNotifications,
  MdOutlinePlayCircleOutline,
  MdOutlineSaveAs,
  MdPersonAdd,
  MdPhoto,
  MdPictureAsPdf,
  MdPlayArrow,
  MdPrivacyTip,
  MdSave,
  MdSettings,
  MdVideocam,
} from "react-icons/md";
import Switch from "../../../components/interface/Switch";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { FaInbox, FaUsers, FaUserShield } from "react-icons/fa";
import { setChatDetails } from "../../../app/Redux";
import { handleCatchError } from "../../../utils/ErrorHandle";
import { TGroup, TUser } from "../../../app/Types";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

import Dropdown from "../../../components/interface/Dropdown";
import Avatar from "../../../components/interface/Avatar";
import ToolTip from "../../../components/interface/Tooltip";
import TabNavigation from "../../../components/interface/TabNavigation";
import api from "../../../utils/api";
import Button from "../../../components/interface/Button";
import ModalWindow from "../../../components/interface/ModalWindow";
import Input from "../../../components/interface/Input";
import { AddGroupMembers } from "./SidebarContainer/Home/Groups";
import { toastSuccess, toastWarning } from "../../../app/Toast";
import dataURLtoBlob from "../../../utils/dataURLtoBlob";

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

type TGroupChatDetails = TGroup & {
  media?: TMedia | undefined;
};

type MediaTabProps = {
  mediaImages: string[];
  mediaVideos: string[];
};

type PROPSChatDetailsSidebar = {
  props: {
    visible: boolean;
    id: string;
    type: string;
  };
};

type TMembersWindow = {
  props: {
    groupChatDetails: TGroupChatDetails | undefined;
    setIsMemberWindowVisible: (parm: any) => void;
    setRefreshTrigger: (parm: any) => void;
  };
};

type TGroupSetting = {
  props: {
    groupChatDetails: TGroupChatDetails | undefined;
    setIsSettingsWindowVisible: (parm: any) => void;
    setRefreshTrigger: (parm: any) => void;
  };
};

function ChatDetailsSidebar({ props }: PROPSChatDetailsSidebar) {
  if (props.type === "single") return <SingleChatDetails />;

  if (props.type === "group") return <GroupChatDetails id={props.id} />;

  return null;
}

function SingleChatDetails({}: any) {
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
          <Avatar data={chatProfileDetails?.userTo} size="xxl" rounded />
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
                    <MdDelete className="text-lg text-cyan-500" /> Delete chat
                  </label>
                </div>
              ),
            },
          ]}
          placement="right"
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

function GroupChatDetails({ id }: { id: string }) {
  const [filesTab, setFilesTab] = useState<string>("media");
  const [groupChatDetails, setGroupChatDetails] = useState<TGroupChatDetails>();
  const [refreshTrigger, setRefreshTrigger] = useState(true);
  const [isMemberWindowVisible, setIsMemberWindowVisible] = useState(false);
  const [isSettingsWindowVisible, setIsSettingsWindowVisible] = useState(false);
  const SMyProfileDetails: TUser = useSelector(
    (state: any) => state.UserAccountData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .post("api/user/getGroupChatData", {
        groupId: id,
      })
      .then((res) => {
        setGroupChatDetails(res.data);
      })
      .catch((Err) => handleCatchError(Err));
  }, [refreshTrigger]);

  return (
    <div className="dark:bg-bunker-920 bg-white h-full w-[25pc] p-6 flex flex-col items-stretch gap-8 z-50">
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
        </Icon>
        <div className="self-start">
          <h1 className="text-2xl font-semibold dark:text-bunker-300">
            Chat details
          </h1>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <img
            className="size-14 rounded-full"
            src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${groupChatDetails?._id}&type=group`}
          />
          <div>
            <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
              {groupChatDetails?.groupDetails?.name}
            </h1>
            <p className="dark:text-cyan-500 text-cyan-600 font-semibold text-sm">
              {groupChatDetails?.groupMembers &&
                groupChatDetails?.groupMembers?.length + 1}{" "}
              members
            </p>
          </div>
        </div>
        {groupChatDetails?.createdBy?._id === SMyProfileDetails._id && (
          <ToolTip id="group-settings" content="group settings">
            <Icon
              onClick={() => setIsSettingsWindowVisible(true)}
              variant="transparent"
            >
              <MdSettings />
            </Icon>
          </ToolTip>
        )}
      </div>
      <div></div>
      <p className="text-md font-normal dark:text-bunker-300 text-bunker-500">
        {groupChatDetails?.groupDetails?.description}
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
      <div className="flex items-center justify-between">
        <span className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <FaUsers className="text-lg text-cyan-500" />
          Members
        </span>
        <ToolTip id="window-members" content="View members">
          <div
            onClick={() => setIsMemberWindowVisible(true)}
            className="relative w-full h-full flex -space-x-4 rtl:space-x-reverse flex-row justify-end cursor-pointer"
          >
            {groupChatDetails?.groupMembers &&
              groupChatDetails.groupMembers.slice(0, 2).map((member, index) => (
                <div key={index} className="cursor-pointer hover:z-10">
                  <Avatar data={member} rounded size="lg" />
                </div>
              ))}
            {groupChatDetails?.groupMembers &&
              groupChatDetails?.groupMembers?.length > 2 && (
                <div className="cursor-pointer flex items-center justify-center w-10 h-10 bg-bunker-800 text-bunker-100 font-semibold text-sm z-10 rounded-full">
                  +{groupChatDetails.groupMembers.length - 1}
                </div>
              )}
          </div>
        </ToolTip>
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
            mediaImages={groupChatDetails?.media?.images}
            mediaVideos={groupChatDetails?.media?.videos}
          />
        )}
        {filesTab === "files" && <FilesTab />}
        {filesTab === "links" && <LinksTab />}
        {filesTab === "voice" && <VoiceTab />}
      </div>
      {isMemberWindowVisible && (
        <MembersWindow
          props={{
            groupChatDetails,
            setIsMemberWindowVisible,
            setRefreshTrigger,
          }}
        />
      )}
      {isSettingsWindowVisible && (
        <GroupSetting
          props={{
            groupChatDetails,
            setIsSettingsWindowVisible,
            setRefreshTrigger,
          }}
        />
      )}
    </div>
  );
}

function MediaTab({ mediaImages, mediaVideos }: MediaTabProps): JSX.Element {
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

function MembersWindow({ props }: TMembersWindow) {
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
  const SMyProfileDetails: TUser = useSelector(
    (state: any) => state.UserAccountData
  );

  const handleAddMember = (param: TUser): void => {
    const isMemberPresent = props.groupChatDetails?.groupMembers?.some(
      (member) => member._id === param._id
    );

    if (isMemberPresent) {
      return toastWarning("Member already added");
    }

    setIsAddMemberVisible(false);

    api
      .post("api/user/group/update", {
        groupId: props?.groupChatDetails?._id,
        update: {
          operation: "addMember",
          data: param._id,
        },
      })
      .then((Res) => {
        toastSuccess(Res.data.message);
        props.setRefreshTrigger((pre: boolean) => !pre);
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleDeleteMember = (param: TUser): void => {
    if (props?.groupChatDetails?.groupMembers?.length === 1)
      return toastWarning("Can't delete last member");

    api
      .post("api/user/group/update", {
        groupId: props?.groupChatDetails?._id,
        update: {
          operation: "deleteMember",
          data: param._id,
        },
      })
      .then((Res) => {
        toastSuccess(Res.data.message);
        props.setRefreshTrigger((pre: boolean) => !pre);
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <ModalWindow>
      <>
        <div className="flex h-2/4 w-[30pc] relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md">
          <div className="flex gap-2 items-center justify-between">
            <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
              Group members
            </p>
            <div className="flex gap-2 items-center">
              {props?.groupChatDetails?.createdBy?._id ===
                SMyProfileDetails?._id && (
                <ToolTip id="add-members" content="Add members">
                  <Icon
                    onClick={() => setIsAddMemberVisible(true)}
                    variant="transparent"
                  >
                    <MdPersonAdd />
                  </Icon>
                </ToolTip>
              )}
              <Icon
                onClick={() => props?.setIsMemberWindowVisible(false)}
                variant="transparent"
              >
                <MdClose />
              </Icon>
            </div>
          </div>
          <div className="h-full w-full flex flex-col gap-3 overflow-y-auto">
            <div className="flex flex-row  justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
              <div className="flex gap-2 items-center">
                <Avatar
                  rounded={true}
                  data={props?.groupChatDetails?.createdBy}
                  size="xxl"
                />
                <div>
                  <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                    {props?.groupChatDetails?.createdBy?.fullName}
                  </h1>
                  <p className="text-bunker-400 text-sm">
                    @{props?.groupChatDetails?.createdBy?.username}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-1">
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-cyan-400 border border-cyan-400">
                  Admin
                </span>
              </div>
            </div>
            {props?.groupChatDetails?.groupMembers &&
              props?.groupChatDetails?.groupMembers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-row  justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar rounded={true} data={user} size="xxl" />
                    <div>
                      <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
                        {user.fullName}
                      </h1>
                      <p className="text-bunker-400 text-sm">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {props?.groupChatDetails &&
                    SMyProfileDetails._id ==
                      props?.groupChatDetails.createdBy?._id && (
                      <div className="flex flex-col justify-between items-end gap-1">
                        <Dropdown
                          options={[
                            {
                              element: <div>remove</div>,
                              onClick() {
                                handleDeleteMember(user);
                              },
                            },
                          ]}
                          placement="right"
                        >
                          <MdMoreVert className="text-bunker-400" />
                        </Dropdown>
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
        {isAddMemberVisible && (
          <AddGroupMembers props={{ setIsAddMemberVisible, handleAddMember }} />
        )}
      </>
    </ModalWindow>
  );
}

function GroupSetting({ props }: TGroupSetting) {
  const [groupData, setGroupData] = useState({
    groupDetails: {
      ...props.groupChatDetails?.groupDetails,
      avatar: null,
    },
    groupSetting: {
      ...props.groupChatDetails?.groupSetting,
    },
  });
  const RAvatarPreview = useRef<HTMLImageElement>(null);

  const handleUploadAvatar = (
    param: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = param.target.files?.[0];

    if (file) {
      if (file?.size > 2 * 1024 * 1024)
        return toastWarning("File size should be less than 2MB");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const blobImage = dataURLtoBlob(reader.result as string);
        setGroupData((pre: any) => ({
          ...pre,
          groupDetails: { ...groupData.groupDetails, avatar: blobImage },
        }));
        if (RAvatarPreview?.current) {
          RAvatarPreview.current!.src = reader.result as string;
        }
      };
    }
  };

  const handleSave = () => {
    if (!groupData.groupDetails.name)
      return toastWarning("Please add group name");

    if (!groupData.groupDetails.description)
      return toastWarning("Please add group description");

    api
      .post(
        "api/user/group/updateSetting",
        {
          groupId: props?.groupChatDetails?._id,
          groupData,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastSuccess("Group updated");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((err) => handleCatchError(err));
  };

  return (
    <ModalWindow>
      <div className="flex h-2/4 w-[30pc] relative flex-col gap-3 p-5 dark:bg-bunker-910 bg-bunker-100 rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <p className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Group setting
          </p>
          <div className="flex gap-2 items-center">
            <ToolTip id="save-details" content="Save">
              <Icon onClick={handleSave} variant="transparent">
                <MdSave />
              </Icon>
            </ToolTip>
            <Icon
              onClick={() => props?.setIsSettingsWindowVisible(false)}
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        </div>
        <div className="h-full w-full flex flex-col gap-3 overflow-y-auto">
          <div className="flex flex-row items-center w-full gap-2">
            <label htmlFor="avatar-upload" className="relative cursor-pointer">
              <img
                className="size-16 dark:bg-bunker-900 bg-white rounded-full"
                src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${props.groupChatDetails?._id}&type=group`}
                ref={RAvatarPreview}
                alt="Transparent Image"
              />{" "}
              <MdOutlineSaveAs className="absolute m-auto dark:text-bunker-300 text-bunker-600 text-lg top-0 bottom-0 right-0 left-0" />
            </label>
            <input
              onChange={handleUploadAvatar}
              type="file"
              hidden
              accept="image/*"
              id="avatar-upload"
            />
            <Input
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  groupDetails: {
                    ...groupData.groupDetails,
                    name: e.target.value,
                  },
                })
              }
              defaultValue={props?.groupChatDetails?.groupDetails?.name}
              placeholder="Group Name"
              className="w-max"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Input
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  groupDetails: {
                    ...groupData.groupDetails,
                    description: e.target.value,
                  },
                })
              }
              defaultValue={props?.groupChatDetails?.groupDetails?.description}
              placeholder="Group Description"
            />
          </div>
          <hr className="dark:border-bunker-800 border-bunker-200" />
          <h2 className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Privacy
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdPrivacyTip className="text-lg text-cyan-500" />
                group private
                <ToolTip
                  id="group-private"
                  content="group visible for public search"
                >
                  <MdInfo className=" cursor-pointer" />
                </ToolTip>
              </span>
              <Switch
                isCheck={props.groupChatDetails?.groupSetting?.private}
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      private: e.currentTarget?.checked,
                    },
                  })
                }
                size="small"
              />
            </div>
          </div>
          <hr className="dark:border-bunker-800 border-bunker-200" />
          <h2 className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Permissions
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdPhoto className="text-lg text-cyan-500" />
                photo allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isPhotoAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isPhotoAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdVideocam className="text-lg text-cyan-500" />
                video allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isVideoAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isVideoAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize dark:text-bunker-300/80 text-bunker-500 flex items-center gap-2">
                <MdChat className="text-lg text-cyan-500" />
                chat allowed
              </span>
              <Switch
                isCheck={
                  props.groupChatDetails?.groupSetting?.privacy.isChatAllowed
                }
                onChange={(e) =>
                  setGroupData({
                    ...groupData,
                    groupSetting: {
                      ...groupData.groupSetting,
                      privacy: {
                        ...groupData.groupSetting.privacy,
                        isChatAllowed: e.currentTarget?.checked,
                      },
                    },
                  })
                }
                size="small"
              />
            </div>
          </div>
          <hr className="dark:border-bunker-800 border-bunker-200" />
          <h2 className="text-lg font-semibold dark:text-bunker-300 text-bunker-500">
            Danger
          </h2>
          <div className="flex flex-row gap-">
            <Button type="secondary" className="scale-90 ">
              Clear chat
            </Button>
            <Button
              type="secondary"
              className="scale-90 !from-red-600 !to-red-400"
            >
              Delete Group
            </Button>
          </div>
        </div>
      </div>
    </ModalWindow>
  );
}

export default ChatDetailsSidebar;
