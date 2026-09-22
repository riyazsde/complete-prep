import { toast } from "sonner";
import { Oval, ThreeDots } from "react-loader-spinner";
import styles from "./common_css/APIComponent.module.css";
export const showNotification = ({
  message,
  type = "success",
  duration = 3000,
}) => {
  toast[type](message, {
    duration,
  });
};

export const LoaderComponent = () => {
  return (
    <div className={styles.loaderContainer}>
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#2A2BFA"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className={styles.buttonLoaderContainer}>
      <Oval
        visible={true}
        height={30}
        width={30}
        color="white"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
      />
    </div>
  );
};

export const NoDataFound = ({ message = "No Data Found" }) => {
  return (
    <div className={styles.noDataContainer}>
      <p>{message}</p>
    </div>
  );
};
