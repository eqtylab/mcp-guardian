import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifyError = (error: any) => {
  let errorMessage = "An unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (typeof error === "object" && error !== null) {
    errorMessage = JSON.stringify(error);
  }

  console.log("An error occurred", error);

  toast.error(errorMessage, {
    position: "bottom-right",
    autoClose: 5000,
  });
};

export const notifySuccess = (message: string) => {
  console.log("notifying of success");
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
  });
};
