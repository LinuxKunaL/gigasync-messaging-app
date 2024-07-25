import { AxiosError } from "axios";
import { toastError } from "../app/Toast";

export const handleCatchError = (error: AxiosError) => {
  if (error.response) {
    toastError(error?.response?.data);
    console.log("Error response:", error.response.data);
  } else if (error.request) {
    toastError("No response from server");
    console.log("No response from server.");
  } else {
    toastError(error.message);
    console.log("Error:", error.message);
  }
}