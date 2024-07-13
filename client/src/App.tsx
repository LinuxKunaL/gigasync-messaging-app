import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Register from "./views/Register";
import Login from "./views/Login";
import Main from "./views/chat/Main";

import "./index.css";
import { Toaster } from "react-hot-toast";
import ProtectRoute from "./components/security/ProtectRoute";

type Props = {};

function App({}: Props) {
  const themeRefresh = useSelector((state: any) => state.themeRefresh);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
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
