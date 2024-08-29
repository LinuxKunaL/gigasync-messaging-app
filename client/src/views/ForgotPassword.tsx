import React, { Fragment, useState } from "react";
import Logo from "../assets/images/cleanLogo.png";
import Button from "../components/interface/Button";
import Input from "../components/interface/Input";
import pattern from "../utils/regexPattern";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { toastError, toastSuccess, toastWarning } from "../app/Toast";
import { handleCatchError } from "../utils/ErrorHandle";

type Props = {};

const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [isOTPSend, setIsOTPSend] = useState(false);

  const handleGetOTP = async () => {
    if (!email) return toastWarning("Please fill in fields");

    if (pattern.email.test(email) === false)
      return toastWarning("Please enter a valid email address");

    api
      .post("api/auth/forgotPassword/requestOtp", { email })
      .then((Response) => {
        if (Response.data.success) {
          toastSuccess("OTP sent successfully");
          setIsOTPSend(true);
        }
      })
      .catch((Err) => handleCatchError(Err));
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <div className="p-4 sm:p-5 border-[1px] dark:border-bunker-700/40 dark:bg-bunker-920 bg-white rounded-lg w-max flex flex-col gap-2 sm:gap-4 items-start">
        <div className="flex flex-col gap-2 sm:gap-3">
          <img src={Logo} className="w-12 sm:w-16" alt="" />
          <h1 className="text-xl sm:text-2xl dark:text-bunker-100 text-bunker-700 font-semibold">
            Forgot Password
          </h1>
        </div>
        <p className="text-sm dark:text-bunker-500 text-bunker-600">
          Please enter your email
        </p>
        <p className="text-xs sm:text-sm dark:text-bunker-300 text-bunker-500">
          Thank you for get back <b className="text-cyan-400">GigaSync</b> web{" "}
          <br /> applications, let's access our the best recommendation for you.
        </p>
        {isOTPSend ? (
          <EnterOTPComponent email={email} />
        ) : (
          <Fragment>
            <div className="w-full mt-4 flex flex-col gap-4 sm:gap-6">
              <Input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                placeholder="Enter your email"
                className="h-[2.5pc]"
              />
            </div>
            <Button onClick={handleGetOTP} type="primary">
              Get otp
            </Button>
          </Fragment>
        )}
        <div>
          <p className="text-sm dark:text-bunker-300 text-bunker-500">
            <Link
              to="/"
              className="text-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
            >
              close
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const EnterOTPComponent = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState<string>("");
  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false);
  const [updatedPassword, setUpdatedPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleVerifyOTP = async () => {
    if (!otp) return toastWarning("Please fill in fields");

    api
      .post("api/auth/forgotPassword/verifyOtp", { otp, email })
      .then((Response) => {
        if (Response.data.success) {
          toastSuccess("OTP verified successfully");
          setIsPasswordChange(true);
        }
        // if (Response.data.isInvalid) {
        //   toastError("try again");
        //   localStorage.removeItem("token");
        // }
        // if (Response.data.isExpired) {
        //   toastError("try again");
        //   localStorage.removeItem("token");
        // }
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleChangePassword = async () => {
    if (!updatedPassword.password || !updatedPassword.confirmPassword)
      return toastWarning("Please fill in all fields");
    if (updatedPassword.password !== updatedPassword.confirmPassword)
      return toastError("Passwords do not match");

    api
      .post("api/auth/forgotPassword/change", {
        newPassword: updatedPassword.password,
        email,
      })
      .then((Response) => {
        if (Response.data.success) {
          toastSuccess("Password changed successfully");
          return setTimeout(() => {
            window.location.href = "/login";
          }, 1200);
        }
      });
  };

  return (
    <Fragment>
      {isPasswordChange ? (
        <Fragment>
          <div className="w-full mt-4 flex flex-col gap-4 sm:gap-6">
            <Input
              name="password"
              type="password"
              onChange={(e) =>
                setUpdatedPassword({
                  ...updatedPassword,
                  password: e.target.value,
                })
              }
              placeholder="Password confirm"
              className="h-[2.5pc]"
            />
            <Input
              name="passwordConfirm"
              type="password"
              onChange={(e) =>
                setUpdatedPassword({
                  ...updatedPassword,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Password again"
              className="h-[2.5pc]"
            />
          </div>
          <Button onClick={handleChangePassword} type="primary">
            Change password
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <div className="w-full mt-4 flex flex-col gap-4 sm:gap-6">
            <Input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              name="email"
              placeholder="Enter your otp"
              className="h-[2.5pc]"
            />
          </div>
          <Button onClick={handleVerifyOTP} type="primary">
            Verify otp
          </Button>
          <p className="text-sm dark:text-bunker-300 text-bunker-700">
            OTP was sent to {email}
          </p>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
