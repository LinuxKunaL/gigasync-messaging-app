import React, { useEffect, useState } from "react";
import { MdCopyAll, MdEdit, MdSave } from "react-icons/md";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import { toastSuccess } from "../../../../app/Toast";
import { useSelector } from "react-redux";

import Icon from "../../../../components/interface/Icon";
import Switch from "../../../../components/interface/Switch";
import ToolTip from "../../../../components/interface/Tooltip";
import api from "../../../../utils/api";
import dataURLtoBlob from "../../../../utils/dataURLtoBlob";

type Props = {};
type ProfileData = {
  _id?: string;
  username?: string;
  email?: string;
  fullName?: string;
  isAvatar?: boolean;
  avatarColor?: string;
  profile?: {
    privacy?: {
      profilePhoto?: boolean;
      about?: boolean;
      status?: boolean;
    };
    about?: string;
    avatar?: string;
  };
};

function Profile({}: Props) {
  const [isEditProfile, setIsEditProfile] = useState<boolean>(true);
  const [modifiedData, setModifiedData] = useState<ProfileData>({});
  const [avatar, setAvatar] = useState<any>();

  const profileData: ProfileData = useSelector(
    (state: any) => state.UserAccountData
  );

  useEffect(() => {
    setModifiedData(profileData);
  }, []);

  const handleSubmitProfileData = async () => {
    api
      .post(
        "api/user/updateProfile",
        { ...modifiedData, avatar },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((Response) => {
        if (Response.data.success) {
          window.location.reload();
          toastSuccess("Profile Updated");
        }
      })
      .catch((Err) => handleCatchError(Err));
  };

  const handleUploadAvatar = (
    param: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = param.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const blobImage = dataURLtoBlob(reader.result as string);
        setAvatar(blobImage);
        setModifiedData({
          ...modifiedData,
          isAvatar: true,
        });
      };
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-bunker-300">Profile</h1>
        {isEditProfile ? (
          <ToolTip id="edit-profile" className="z-10" content="edit profile">
            <Icon
              onClick={() => setIsEditProfile(!isEditProfile)}
              className="ml-auto"
              variant="transparent"
            >
              <MdEdit />
            </Icon>
          </ToolTip>
        ) : (
          <ToolTip id="save-profile" className="z-10" content="save profile">
            <Icon
              onClick={() => {
                setIsEditProfile(!isEditProfile);
                handleSubmitProfileData();
              }}
              className="ml-auto"
              variant="transparent"
            >
              <MdSave />
            </Icon>
          </ToolTip>
        )}
      </div>
      <div className="pt-3 flex flex-row items-center justify-center gap-3 w-full">
        <div className="w-max">
          <ProfileAvatar
            data={profileData}
            activeEditIcon={isEditProfile}
            htmlFor="avatar"
            theme={profileData.avatarColor}
          />
          <input onChange={handleUploadAvatar} type="file" id="avatar" hidden />
        </div>
        <div className="w-full">
          <input
            type="text"
            className={`${
              isEditProfile ? "bg-transparent p-0" : "p-1 bg-bunker-900"
            } outline-none rounded-md w-full text-lg font-normal dark:text-bunker-50 text-bunker-600`}
            disabled={isEditProfile}
            defaultValue={profileData.fullName}
            name="fullName"
            onChange={(event) =>
              setModifiedData({
                ...modifiedData,
                [event.target.name]: event.target.value,
              })
            }
          />
          <span className="flex items-center text-bunker-400 text-sm">
            @
            <input
              type="text"
              className={`${
                isEditProfile ? "bg-transparent p-0" : "p-1 bg-bunker-900"
              } outline-none w-full rounded-md`}
              defaultValue={profileData.username}
              disabled={isEditProfile}
              name="username"
              onChange={(event) =>
                setModifiedData({
                  ...modifiedData,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <Icon variant="transparent">
              <MdCopyAll className=" cursor-pointer" />
            </Icon>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold dark:text-bunker-50 text-bunker-600">
          About
        </h2>
        <p className="text-bunker-400 text-sm flex items-center gap-2">
          <textarea
            className={`${
              isEditProfile ? "bg-transparent" : "p-1 bg-bunker-900"
            } outline-none w-full rounded-md text-xs no-scrollbar`}
            name="about"
            disabled={isEditProfile}
            onChange={(event) =>
              setModifiedData({
                ...modifiedData,
                profile: {
                  ...modifiedData.profile,
                  about: event.target.value,
                },
              })
            }
          >
            {!profileData?.profile?.about
              ? "No About , Add some information about yourself"
              : profileData?.profile?.about}
          </textarea>
        </p>
      </div>
      <hr className="dark:border-bunker-800 border-bunker-200" />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold dark:text-bunker-50 text-bunker-600">
          Privacy
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 flex-col">
              <span className="dark:text-bunker-200 text-bunker-600 font-semibold text-sm flex items-center gap-2">
                Profile Photo
              </span>
              <p className="text-bunker-400 text-xs flex items-center gap-2">
                turn on this setting to whether your contact can see your
                profile or not.
              </p>
            </div>
            <Switch
              onChange={(event: any) => {
                setModifiedData((prevData: any) => ({
                  ...prevData,
                  profile: {
                    ...prevData.profile,
                    privacy: {
                      ...prevData.profile?.privacy,
                      profilePhoto: event.target.checked,
                    },
                  },
                }));
              }}
              isCheck={profileData.profile?.privacy?.profilePhoto}
              disabled={isEditProfile}
              size="small"
              name="profile-photo"
              id="ph"
            />
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex gap-1 flex-col">
              <span className="dark:text-bunker-200 text-bunker-600 font-semibold text-sm flex items-center gap-2">
                About
              </span>
              <p className="text-bunker-400 text-xs flex items-center gap-2">
                Note : turn on this setting to whether your contact can see
                about status or not.
              </p>
            </div>
            <Switch
              onChange={(event: any) => {
                setModifiedData((prevData: any) => ({
                  ...prevData,
                  profile: {
                    ...prevData.profile,
                    privacy: {
                      ...prevData.profile?.privacy,
                      about: event.target.checked,
                    },
                  },
                }));
              }}
              isCheck={profileData.profile?.privacy?.about}
              disabled={isEditProfile}
              size="small"
              name="about"
              id="ab"
            />
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex gap-1 flex-col">
              <span className="dark:text-bunker-200 text-bunker-600 font-semibold text-sm flex items-center gap-2">
                Status
              </span>
              <p className="text-bunker-400 text-xs flex items-center gap-2">
                Note : turn on this setting to whether your contact can see your
                status or not.
              </p>
            </div>
            <Switch
              onChange={(event: any) => {
                setModifiedData((prevData: any) => ({
                  ...prevData,
                  profile: {
                    ...prevData.profile,
                    privacy: {
                      ...prevData.profile?.privacy,
                      status: event.target.checked,
                    },
                  },
                }));
              }}
              isCheck={profileData.profile?.privacy?.status}
              disabled={isEditProfile}
              size="small"
              name="status"
              id="st"
            />
          </div>
        </div>
      </div>
    </>
  );
}

type ProfileAvatarProps = {
  data?: any;
  theme?: any;
  className?: string;
  activeEditIcon?: boolean;
  htmlFor?: string;
  url?: string;
};

const ProfileAvatar = ({
  theme,
  data,
  htmlFor,
  activeEditIcon,
}: ProfileAvatarProps) => {
  const colorVariant: any = {
    red: "to-red-600 from-red-400",
    blue: "to-blue-600 from-blue-400",
    green: "to-green-600 from-green-400",
    pink: "to-pink-600 from-pink-400",
    yellow: "to-yellow-600 from-yellow-400",
    purple: "to-purple-600 from-purple-400",
    orange: "to-orange-600 from-orange-400",
    gray: "to-gray-600 from-gray-400",
    cyan: "to-cyan-600 from-cyan-400",
    emerald: "to-emerald-600 from-emerald-400",
    lime: "to-lime-600 from-lime-400",
    indigo: "to-indigo-600 from-indigo-400",
    fuchsia: "to-fuchsia-600 from-fuchsia-400",
    sky: "to-sky-600 from-sky-400",
    violet: "to-violet-600 from-violet-400",
    rose: "to-rose-600 from-rose-400",
    slate: "to-slate-600 from-slate-400",
    neutral: "to-neutral-600 from-neutral-400",
  };

  return (
    <div className="size-14 select-none rounded-full flex items-center justify-center text-bunker-50 font-semibold relative overflow-hidden">
      {data.isAvatar ? (
        <img
          className="w-full h-full absolute rounded-full"
          alt=""
          src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${data._id}&type=user`}
        />
      ) : (
        <div
          className={`size-14 select-none bg-gradient-to-bl rounded-full flex items-center justify-center text-bunker-50 font-semibold relative overflow-hidden ${colorVariant[theme]}`}
        >
          {data?.fullName?.slice(0, 2).toUpperCase()}
        </div>
      )}
      {!activeEditIcon ? (
        <label
          htmlFor={htmlFor}
          className="h-full w-full cursor-pointer flex justify-center items-center absolute bg-bunker-900/60"
        >
          <MdEdit />
        </label>
      ) : null}
    </div>
  );
};

export default Profile;
