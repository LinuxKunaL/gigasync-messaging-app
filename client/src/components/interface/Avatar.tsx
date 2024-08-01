type Props = {
  data?: any;
  border?: boolean;
  rounded?: boolean;
  className?: string;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full";
};

function Avatar({ data, rounded, className, size }: Props) {
  const colorVariant: any = {
    red: "to-red-600 from-red-400 border-red-400",
    blue: "to-blue-600 from-blue-400 border-blue-400",
    green: "to-green-600 from-green-400 border-green-400",
    pink: "to-pink-600 from-pink-400 border-pink-400",
    yellow: "to-yellow-600 from-yellow-400 border-yellow-400",
    purple: "to-purple-600 from-purple-400 border-purple-400",
    orange: "to-orange-600 from-orange-400 border-orange-400",
    gray: "to-gray-600 from-gray-400 border-gray-400",
    cyan: "to-cyan-600 from-cyan-400 border-cyan-400",
    emerald: "to-emerald-600 from-emerald-400 border-emerald-400",
    lime: "to-lime-600 from-lime-400 border-lime-400",
    indigo: "to-indigo-600 from-indigo-400 border-indigo-400",
    fuchsia: "to-fuchsia-600 from-fuchsia-400 border-fuchsia-400",
    sky: "to-sky-600 from-sky-400 border-sky-400",
    violet: "to-violet-600 from-violet-400 border-violet-400",
    rose: "to-rose-600 from-rose-400 border-rose-400",
    slate: "to-slate-600 from-slate-400 border-slate-400",
    neutral: "to-neutral-600 from-neutral-400 border-neutral-400",
  };

  const sizeVariant: any = {
    xs: "w-4 h-4 text-xs",
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-md",
    xxl: "w-14 h-14 text-md",
    full: "w-full h-full text-lg",
  };

  return (
    <div
      className={`${sizeVariant[size]} border- ${className} ${size} ${
        colorVariant[data?.avatarColor]
      } select-none ${
        rounded ? "rounded-full" : "rounded-lg"
      } flex items-center justify-center text-bunker-50 font-semibold relative overflow-hidden`}
    >
      {data?.isAvatar ? (
        <img
          className={`w-full h-full absolute ${
            rounded ? "rounded-full" : "rounded-lg"
          }`}
          alt=""
          src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${data?._id}&type=user`}
        />
      ) : (
        <div
          className={`${sizeVariant[size]} select-none bg-gradient-to-bl ${
            rounded ? "rounded-full" : "rounded-lg"
          } flex items-center justify-center text-bunker-50 font-semibold relative overflow-hidden ${
            colorVariant[data?.avatarColor]
          }`}
        >
          {data?.fullName?.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default Avatar;
