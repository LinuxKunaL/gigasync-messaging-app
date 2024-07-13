import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGooglePlusG } from "react-icons/fa";
import { toastError, toastSuccess, toastWarning } from "../app/Toast";

import Button from "../components/interface/Button";
import Input from "../components/interface/Input";
import Logo from "../assets/images/cleanLogo.png";
import pattern from "../utils/regexPattern";
import api from "../utils/api";
import { handleCatchError } from "../utils/ErrorHandle";

type Props = {};
type FormData = {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string | any;
  passwordConfirm?: string | any;
};

function Register({}: Props) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  
  const handleSubmitForm = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.passwordConfirm
    )
      return toastWarning("Please fill in all fields");

    if (pattern.email.test(formData.email) === false)
      return toastError("Please enter a valid email address");

    if (formData.password !== formData.passwordConfirm)
      return toastError("Passwords do not match");

    api
      .post("api/auth/register", {
        ...formData,
        avatarColor: handleRandomColor(),
      })
      .then((Response) => {
        toastSuccess(Response.data);
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleRandomColor = (): string => {
    const colors = [
      "red",
      "green",
      "blue",
      "yellow",
      "pink",
      "purple",
      "orange",
      "gray",
      "cyan",
      "emerald",
      "lime",
      "indigo",
      "fuchsia",
      "sky",
      "violet",
      "rose",
      "slate",
      "neutral,",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-5 border-[1px] dark:border-bunker-700/40 dark:bg-bunker-920 bg-white rounded-lg w-max flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-3">
          <img src={Logo} className=" w-16" alt="" />
          <h1 className="text-2xl dark:text-bunker-100 text-bunker-700 font-semibold">
            Register
          </h1>
        </div>
        <p className="text-sm dark:text-bunker-500 text-bunker-600">
          Create a your account
        </p>
        <p className="text-sm dark:text-bunker-300 text-bunker-500">
          Let's get you all setup, so you can verify your personal{" "}
          <b className="text-cyan-400">Account</b>
          <br /> and begine setting up your profile.
        </p>
        <form className="w-full mt-4 flex flex-col gap-6">
          <Input
            name="fullName"
            type="text"
            onChange={handleOnChange}
            placeholder="fullName"
          />
          <Input
            name="email"
            type="email"
            onChange={handleOnChange}
            placeholder="Email"
          />
          <Input
            name="username"
            type="text"
            onChange={handleOnChange}
            placeholder="Username"
          />
          <Input
            name="password"
            type="password"
            onChange={handleOnChange}
            placeholder="Password confirm"
          />
          <Input
            name="passwordConfirm"
            type="password"
            onChange={handleOnChange}
            placeholder="Password again"
          />
        </form>
        <span className="flex items-center gap-2 mt-4 mb-3 cursor-pointer">
          <input
            className="checked:!bg-cyan-500 hover:dark:bg-bunker-900 dark:bg-bunker-800 cursor-pointer appearance-none size-5 border-[2px] dark:border-bunker-600/50 border-bunker-300/50 rounded-full "
            type="checkbox"
            id="checkbox"
          />
          <label
            htmlFor="checkbox"
            className="text-sm dark:text-bunker-400 text-bunker-500"
          >
            I agree to all the Terms & Conditions and Fees.
          </label>
        </span>
        <Button onClick={handleSubmitForm} type="primary">
          Submit
        </Button>
        <div className="flex items-center justify-between w-full">
          <hr className="flex-1  dark:border-bunker-800 border-bunker-200" />
          <span className="dark:text-bunker-200 text-sm mx-5">OR</span>
          <hr className="flex-1 dark:border-bunker-800 border-bunker-200" />
        </div>
        <Button type="secondary">
          <FaGooglePlusG /> Register with Google
        </Button>
        <div>
          <p className="text-sm dark:text-bunker-300 text-bunker-500">
            Already have an account ?{" "}
            <Link
              to="/login"
              className="text-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
