import { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdClearAll,
  MdCopyAll,
  MdDelete,
  MdMoreVert,
  MdOutlineBlock,
  MdOutlineFavorite,
} from "react-icons/md";
import useFavoriteContact from "../../../../hooks/useFavoriteContact";
import { useDispatch, useSelector } from "react-redux";
import { TChatProfileDetails } from "./Types";
import { FilesTab, LinksTab, MediaTab, VoiceTab } from "./components/Tabs";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { insertCurrentChatData, setChatDetails } from "../../../../app/Redux";
import { toastChoice, toastSuccess } from "../../../../app/Toast";

import Icon from "../../../../components/interface/Icon";
import Avatar from "../../../../components/interface/Avatar";
import Dropdown from "../../../../components/interface/Dropdown";
import Switch from "../../../../components/interface/Switch";
import HrLine from "../../../../components/interface/HrLine";
import TabNavigation from "../../../../components/interface/TabNavigation";
import api from "../../../../utils/api";

function ChatSingle({}: any) {
  const [filesTab, setFilesTab] = useState<string>("media");
  const [chatProfileDetails, setChatProfileDetails] =
    useState<TChatProfileDetails>();
  const { handleAddFavorite, handleRemoveFavorite, isFavorite } =
    useFavoriteContact();
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

  const handleToggleFavorite = (
    _switch: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = _switch.target;
    if (checked) {
      handleAddFavorite(SChatDetails.id);
    } else {
      handleRemoveFavorite(SChatDetails.id);
    }
  };

  const handleClearDeleteOrClear = (param: "delete" | "clear") => {
    api
      .post("api/user/clearChat", {
        me: SMyProfileDetails._id,
        to: SChatDetails.id,
        operation: param,
      })
      .then((res) => {
        if (param === "delete") {
          dispatch(insertCurrentChatData(null));
          dispatch(
            setChatDetails({
              visible: false,
            })
          );
        }
        toastSuccess(res.data);
      })
      .catch((err) => handleCatchError(err));
  };

  const handleToggleBlock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    toastChoice(
      () =>
        api
          .post("api/user/blockContact", {
            to: SChatDetails.id,
            block: isChecked,
          })
          .then((res) => {
            dispatch(insertCurrentChatData(null));
            dispatch(
              setChatDetails({
                visible: false,
                id: null,
              })
            );
          })
          .catch((err) => handleCatchError(err)),
      isChecked ? "Block" : "Unblock"
    );
  };

  return (
    <div className="dark:bg-bunker-920 xl:relative absolute right-0 bg-white h-full w-screen sm:w-[25pc] p-3 sm:p-6 flex flex-col items-stretch gap-4 sm:gap-8 z-20">
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
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-bunker-300">
            Chat details
          </h1>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar
            data={chatProfileDetails?.userTo}
            size="xxl"
            className="sm:size-14 !w-12 !h-12 !text-xs"
            rounded
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-md sm:text-lg  font-normal dark:text-bunker-50 text-bunker-600">
              {chatProfileDetails?.userTo?.fullName}
            </h1>
            <span className="flex items-center text-bunker-400 text-xs sm:text-sm gap-4">
              <p className="dark:text-cyan-500 text-cyan-600">
                @{chatProfileDetails?.userTo?.username}
              </p>{" "}
              <MdCopyAll
                onClick={() => {
                  navigator.clipboard.writeText(
                    chatProfileDetails?.userTo?.username as string
                  );
                  toastSuccess("Username copied to clipboard");
                }}
                className=" cursor-pointer text-sm"
              />
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
                  <Switch
                    onChange={handleToggleBlock}
                    isCheck={chatProfileDetails?.isBlocked}
                    id="block"
                    size="small"
                  />
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
                  <Switch
                    onChange={handleToggleFavorite}
                    id="favorite"
                    size={"small"}
                    isCheck={isFavorite(SChatDetails.id)}
                  />
                </div>
              ),
            },
            {
              element: (
                <div
                  onClick={() =>
                    toastChoice(
                      () => handleClearDeleteOrClear("delete"),
                      "delete chat"
                    )
                  }
                  className="flex items-center justify-between gap-2"
                >
                  <label className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer">
                    <MdDelete className="text-lg text-cyan-500" /> Delete chat
                  </label>
                </div>
              ),
            },
            {
              element: (
                <div
                  onClick={() =>
                    toastChoice(
                      () => handleClearDeleteOrClear("clear"),
                      "clear chat"
                    )
                  }
                  className="flex items-center justify-between gap-2"
                >
                  <label className="text-md font-semibold dark:text-bunker-300 text-bunker-500 flex items-center gap-2 cursor-pointer">
                    <MdClearAll className="text-lg text-cyan-500" /> clear chat
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
      <p className="text-sm sm:text-md font-normal dark:text-bunker-300 text-bunker-500">
        {chatProfileDetails?.userTo?.profile?.privacy.about ? (
          chatProfileDetails?.userTo?.profile?.about
        ) : (
          <p className="italic opacity-75">About is hidden</p>
        )}
      </p>
      <HrLine />
      <div className="dark:bg-bunker-950 bg-bunker-50 p-2 rounded-lg flex space-x-4 w-full lg:w-max">
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
            mediaAudios={chatProfileDetails?.media?.audios}
          />
        )}
        {filesTab === "files" && <FilesTab files={chatProfileDetails?.files} />}
        {filesTab === "links" && <LinksTab links={chatProfileDetails?.links} />}
        {filesTab === "voice" && (
          <VoiceTab voices={chatProfileDetails?.voices} />
        )}
      </div>
    </div>
  );
}

export default ChatSingle;
