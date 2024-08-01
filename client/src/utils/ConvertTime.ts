const convertTime = (param: Date, type: "full" | "day"): string => {
  if (type == "full") {
    return new Date(param).toLocaleString();
  }

  if (type == "day") {
    return new Date(param).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  return "";
};

export default convertTime;
