import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

type Props = {
  children: any;
};

function ProtectRoute({ children }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) return navigate("/login");

    api
      .post("api/auth/verifyDashboard")
      .then((Response) => {

        // if (Response.data.success) {
        //   localStorage.setItem("token", Response.data.token);
        //   return setTimeout(() => {
        //     navigate("/~");
        //   }, 1200);
        // }

        // if (Response.data.isInvalid) {
        //   navigate("/login");
        //   localStorage.removeItem("token");
        // }

        // if (Response.data.isExpired) {
        //   navigate("/login");
        //   localStorage.removeItem("token");
        // }

        setLoading(false);
        navigate("/~");
      })
      .catch((err) => {
        console.log(err);
        // navigate("/login");
      });

    return () => {
      setLoading(false);
    };
  }, []);

  return loading ? null : children;
}

export default ProtectRoute;
