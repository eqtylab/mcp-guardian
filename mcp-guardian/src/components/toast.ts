import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
    });
};

export const notifySuccess = (message: string) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
    });
};
