import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showNotification = ({
  message,
  type = "success",
  duration = 3000,
}) => {
  const validTypes = ["success", "error", "info", "warning"];
  const toastType = validTypes.includes(type) ? type : "success";

  toast[toastType](message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

 
