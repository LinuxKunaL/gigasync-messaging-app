import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./views/Login";
import Register from "./views/Register";
import Main from "./views/chat/Main";
import ProtectRoute from "./components/security/ProtectRoute";
import ForgotPassword from "./views/ForgotPassword";

import "./index.css";

type Props = {};

function App({}: Props) {
  const themeRefresh = useSelector((state: any) => state.themeRefresh);

  useEffect(() => {
    let theme = localStorage.getItem("theme");

    if (!theme) {
      theme = "dark";
      localStorage.setItem("theme", theme);
    }

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [themeRefresh]);

  return (
    <div className="h-screen w-screen dark:bg-bunker-950 bg-bunker-50">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<div>404</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="/~"
            element={
              <ProtectRoute>
                <Main />
              </ProtectRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
