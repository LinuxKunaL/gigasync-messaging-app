import { useSelector } from "react-redux";

import Home from "./Home/index";
import Favorite from "./Favorite";
import Files from "./Files";
import Contacts from "./Contacts";
import Profile from "./Profile";
import Status from "./Status";

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

export default ContentBar;
