import { toast } from "sonner";

export const showNotification = ({
  message,
  type = "success",
  duration = 3000,
}) => {
  toast[type](message, {
    duration,
  });
};
