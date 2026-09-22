import api from "./api";
import { showNotification } from "./exportComponents";

const apiRequest = async ({
  method = "GET",
  endpoint = "",
  data = {},
  params = {},
  setIsLoading,
  setData,
  onSuccess = () => {},
  onError = () => {},
  showMsg = false,
  successMsg=''
}) => {
  if (setIsLoading) setIsLoading(true);

  const isFormData = data instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  try {
    const response = await api({
      method,
      url: endpoint,
      ...(method === "GET" || method === "DELETE" ? { params } : { data }),
      headers,
    });

    if (setData) setData(response.data);
    if (onSuccess) onSuccess(response?.data);

    if (showMsg) {
      showNotification({
        type: method === "DELETE" ? "error" : "success",
        message:
          response.data?.message || response.data?.msg || "Request successful",
      });
    }
    if(successMsg) showNotification({
      type:"success",message:successMsg
    })

    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.msg ||
        error.response.statusText ||
        errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please check your internet connection.";
    } else {
      errorMessage = error.message;
    }
    onError(error);

    if (showMsg) showNotification({ type: "error", message: errorMessage });
    return;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export default apiRequest;
