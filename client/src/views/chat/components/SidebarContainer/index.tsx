import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineSpaceDashboard,
  MdFavoriteBorder,
  MdSettings,
  MdOutlineFileCopy,
  MdOutlineContacts,
} from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { changeContent } from "../../../../app/Redux";
import { toastChoice } from "../../../../app/Toast";
import { Calls } from "../ChatContainer/Single/body";
import Icon from "../../../../components/interface/Icon";
import Dropdown from "../../../../components/interface/Dropdown";
import Favorite from "./Favorite";
import Files from "./Files";
import Contacts from "./Contacts";
import Profile from "./Profile";
import Status from "./Status";
import Home from "./Home/index";

type Props = {};

function ContentBar({}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changeContentBarState = useSelector(
    (state: any) => state.changeContentBar
  );

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const listOfTabs = [
    {
      name: "home",
      icon: MdOutlineSpaceDashboard,
    },
    {
      name: "favorite",
      icon: MdFavoriteBorder,
    },
    {
      name: "files",
      icon: MdOutlineFileCopy,
    },
    {
      name: "contacts",
      icon: MdOutlineContacts,
    },
    {
      name: "profile",
      icon: FaRegUserCircle,
    },
  ];
  return (
    <div className="dark:bg-bunker-920 sm:ml-4 bg-white flex flex-col items-center w-full lg:w-max h-[100dvh] justify-between xl:relative">
      <div className="flex sm:hidden items-center justify-between w-full px-4 py-3 bg-bunker-50 dark:bg-bunker-950/60 rounded-b-xl">
        <h1 className="text-lg xs:text-xl text-bunker-800 dark:text-bunker-200 font-semibold">
          Giga
          <b className=" font-semibold bg-clip-text text-transparent bg-gradient-to-t from-cyan-400 to-cyan-600 ">
            Sync
          </b>
        </h1>
        <Dropdown
          options={[
            {
              element: (
                <div onClick={() => toastChoice(() => logout(), "Logout?")}>
                  Logout
                </div>
              ),
            },
          ]}
          placement="right"
        >
          <Icon variant="transparent">
            <MdSettings />
          </Icon>
        </Dropdown>
      </div>
      <div className="p-2.5 sm:p-6 flex flex-col gap-3 sm:gap-8 w-full flex-1 overflow-hidden">
        <Status />
        <div className="overflow-y-hidden overflow-x-hidden flex flex-col gap-2 xs:gap-4 h-full w-full lg:w-[21.7pc]">
          {changeContentBarState == "home" && <Home />}
          {changeContentBarState == "favorite" && <Favorite />}
          {changeContentBarState == "files" && <Files />}
          {changeContentBarState == "contacts" && <Contacts />}
          {changeContentBarState == "profile" && <Profile />}
        </div>
      </div>
      <div className="sm:hidden dark:bg-bunker-950/60 bg-bunker-50 flex sm:flex-col justify-between items-center gap-3 p-2 rounded-t-xl w-full">
        {listOfTabs.map((tab) => {
          const Icon: any = tab.icon;
          return (
            <div
              key={tab.name}
              onClick={() => dispatch(changeContent(tab.name))}
              className={`${
                changeContentBarState === tab.name &&
                "dark:bg-cyan-300/10 bg-cyan-200/50"
              } flex flex-col gap-1 size-14 justify-center items-center rounded-lg cursor-pointer group hover:dark:bg-cyan-300/10 hover:bg-cyan-200/50`}
            >
              <Icon
                className={`${
                  changeContentBarState === tab.name &&
                  "dark:text-cyan-400 text-cyan-600"
                } text-xl dark:text-bunker-400 text-bunker-600 group-hover:dark:text-cyan-400 group-hover:text-cyan-600`}
              />
              <span
                className={`${
                  changeContentBarState === tab.name &&
                  "dark:text-cyan-400 text-cyan-600"
                } text-xs capitalize dark:text-bunker-400 font-normal group-hover:dark:text-cyan-400 group-hover:text-cyan-600`}
              >
                {tab.name}
              </span>
            </div>
          );
        })}
      </div>
      <Calls />
    </div>
  );
}

export default ContentBar;
