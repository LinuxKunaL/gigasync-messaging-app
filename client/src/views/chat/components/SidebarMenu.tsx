import cleanLogo from "../../../assets/images/cleanLogo.png";

import {
  MdMenu,
  MdLogout,
  MdFavoriteBorder,
  MdOutlineContacts,
  MdOutlineFileCopy,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { changeContent } from "../../../app/Redux";
import { useEffect } from "react";
import { toastNotification } from "../../../app/Toast";
import { TMessages, TUser } from "../../../app/Types";

import ThemeToggle from "../../../components/interface/ThemeToggle";
import Icon from "../../../components/interface/Icon";
import socket from "../../../app/Socket";

type Props = {};

function SidebarMenu({}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SCurrentChat: TUser = useSelector((state: any) => state.currentChat);

  const changeContentBarState = useSelector(
    (state: any) => state.changeContentBar
  );

  useEffect(() => {
    socket.on("NewMessageNotification", (message: TMessages) => {
      if (!SCurrentChat._id) {
        toastNotification(message);
      }
    });
    return () => {
      socket.off("NewMessageNotification");
    };
  }, []);

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

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dark:bg-bunker-920 bg-white h-full w-max p-6 flex flex-col items-center gap-4 justify-between">
      <div className="flex flex-col items-center gap-4">
        <img src={cleanLogo} className="size-12 mt-3" alt="" />
        <div className="mt-2 flex flex-col items-center gap-3 ">
          {listOfTabs.map((tab) => {
            const Icon: any = tab.icon;
            return (
              <div
                key={tab.name}
                onClick={() => dispatch(changeContent(tab.name))}
                className={`${
                  changeContentBarState === tab.name
                    ? "dark:bg-cyan-300/10 bg-cyan-200/50"
                    : ""
                } flex flex-col gap-1 size-16 justify-center items-center rounded-lg cursor-pointer group hover:dark:bg-cyan-300/10 hover:bg-cyan-200/50`}
              >
                <Icon
                  className={`${
                    changeContentBarState === tab.name
                      ? "dark:text-cyan-400 text-cyan-600"
                      : ""
                  } text-xl dark:text-bunker-400 group-hover:dark:text-cyan-400 group-hover:text-cyan-600`}
                />
                <span
                  className={`${
                    changeContentBarState === tab.name
                      ? "dark:text-cyan-400 text-cyan-600"
                      : ""
                  } text-xs capitalize dark:text-bunker-400 font-normal group-hover:dark:text-cyan-400 group-hover:text-cyan-600`}
                >
                  {tab.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Icon
          onClick={() =>
            document
              .getElementById("content-bar")
              ?.classList.toggle("show-content-bar")
          }
          variant="outlined"
          className="xl:hidden"
        >
          <MdMenu className="text-xl" />
        </Icon>
        <ThemeToggle />
        <div
          onClick={logout}
          className="flex flex-col gap-1 size-16 justify-center items-center rounded-lg cursor-pointer group hover:dark:bg-cyan-300/10 hover:bg-cyan-200/50"
        >
          <MdLogout className="text-xl dark:text-bunker-400 group-hover:dark:text-cyan-400 group-hover:text-cyan-600" />
          <span className="text-xs dark:text-bunker-400 font-normal group-hover:dark:text-cyan-400 group-hover:text-cyan-600">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;
