import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { refresh } from "../../app/Redux";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
type Props = {};

function ThemeToggle({}: Props) {
  const dispatch = useDispatch();
  const [darkModeState, setDarkModeState] = useState<Boolean>(false);

  const toggleCss =
    "bg-gradient-to-tl from-cyan-500 to-cyan-300 dark:from-bunker-910 dark:to-bunker-900 w-12 -z-1 h-12 rounded-lg";

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") return setDarkModeState(true);
    return setDarkModeState(false);
  }, [darkModeState]);

  const darkModeHandler = (type: "light" | "dark") => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") {
      dispatch(refresh());
      localStorage.setItem("theme", "light");
      setDarkModeState(false);
    } else {
      dispatch(refresh());
      localStorage.setItem("theme", "dark");
      setDarkModeState(true);
    }
  };

  return (
    <div className="dark:bg-bunker-950 bg-bunker-50 p-2 xs:p-2 rounded-lg flex xs:flex-col xs:w-16 w-min relative">
      <button
        className={`${
          darkModeState ? null : toggleCss
        } relative text-bunker-50 w-12 -z-1 xs:w-full h-9 xs:h-12 flex items-center justify-center`}
        onClick={() => darkModeHandler("light")}
      >
        <MdSunny />
      </button>
      <button
        className={`${
          darkModeState ? toggleCss : null
        } relative text-bunker-600  w-12 -z-1 xs:w-full h-9 xs:h-12 flex items-center justify-center`}
        onClick={() => darkModeHandler("dark")}
      >
        <IoMdMoon />
      </button>
    </div>
  );
}

export default ThemeToggle;
