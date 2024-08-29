const convertTime = (param: Date, type: "full" | "day"): string => {
  if (type == "full") {
    const date = new Date(param).toLocaleString();
    if (date != "Invalid Date") {
      return date;
    }
  }

  if (type == "day") {
    const date = new Date(param).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    if (date != "Invalid Date") {
      return date;
    }
  }

  return "";
};

export default convertTime;
