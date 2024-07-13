import Logo from "../assets/images/cleanLogo.png";
import Button from "../components/interface/Button";
import Input from "../components/interface/Input";
import pattern from "../utils/regexPattern";
import api from "../utils/api";

import { Link, useNavigate } from "react-router-dom";
import { FaGooglePlusG } from "react-icons/fa";
import { useState } from "react";
import { toastSuccess, toastWarning } from "../app/Toast";
import { handleCatchError } from "../utils/ErrorHandle";

type FormData = {
  email?: string;
  password?: string | any;
};

type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleSubmitForm = async () => {
    if (!formData.email || !formData.password)
      return toastWarning("Please fill in all fields");

    if (pattern.email.test(formData.email) === false)
      return toastWarning("Please enter a valid email address");

    api
      .post("api/auth/login", formData)
      .then((Response) => {
        if (Response.data.success) {
          localStorage.setItem("token", Response.data.token);
          toastSuccess("Login Successful");
          setTimeout(() => {
            navigate("/~");
          }, 1200);
        }
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-5 border-[1px] dark:border-bunker-700/40 dark:bg-bunker-920 bg-white rounded-lg w-max flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-3">
          <img src={Logo} className=" w-16" alt="" />
          <h1 className="text-2xl dark:text-bunker-100 text-bunker-700 font-semibold">
            Login
          </h1>
        </div>
        <p className="text-sm dark:text-bunker-500 text-bunker-600">
          Login to your account
        </p>
        <p className="text-sm dark:text-bunker-300 text-bunker-500">
          Thank you for get back <b className="text-cyan-400">GigaSync</b> web{" "}
          <br /> applications, let's access our the best recommendation for you.
        </p>
        <div className="w-full mt-4 flex flex-col gap-6">
          <Input
            type="text"
            onChange={handleOnChange}
            name="email"
            placeholder="Enter your email"
          />
          <Input
            type="password"
            onChange={handleOnChange}
            name="password"
            placeholder="Enter your password"
          />
        </div>
        <span className="font-semibold text-indigo-500 hover:text-indigo-400 transition-all self-end text-sm cursor-pointer">
          Forgot password ?
        </span>
        <Button onClick={handleSubmitForm} type="primary">
          Login
        </Button>
        <div className="flex items-center justify-between w-full">
          <hr className="flex-1  dark:border-bunker-800 border-bunker-200" />
          <span className="dark:text-bunker-200 text-sm mx-5">OR</span>
          <hr className="flex-1  dark:border-bunker-800 border-bunker-200" />
        </div>
        <Button type="secondary">
          <FaGooglePlusG /> Login with Google
        </Button>
        <div>
          <p className="text-sm dark:text-bunker-300 text-bunker-500">
            Don't have an account ?{" "}
            <Link
              to="/register"
              className="text-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
            >
              Register account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
