import axios from "axios";
import { showNotification } from "../components/common/APIComponents";
import api from "../services/api";
import { postRequest } from "../services/apiService";
import { endpoints } from "../services/endPoints";

export const startTest = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.startTest,
    data: payload,
  });
};
export const directSubmitTest = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.directSubmitTest,
    data: payload,
  });
};
export const startTestTWV = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.startTestTWV,
    data: payload,
  });
};
export const startMainTest = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.startMainTest,
    data: payload,
  });
};

export const mainTest = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.mainTest,
    data: payload,
  });
};

export const endTest = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.endTest,
    data: payload,
  });
};
export const endTestTWV = ({ payload }) => {
  return postRequest({
    endpoint: endpoints.endTestTWV,
    data: payload,
  });
};

export const removeFromCartById = async ({
  name,
  Id,
  hideMsg = false,
  setIsLoading,
  addFun = () => {},
}) => {
  const baseURL = process.env.REACT_APP_API_URL;

  try {
    if (setIsLoading) setIsLoading(true);

    const response = await api.delete(
      `${baseURL}user/cart/remove?${name}=${Id}`
    );

    if (!hideMsg) {
      showNotification({ type: "success", message: response.data.message });
    }

    if (addFun) addFun(response.data);

    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);

    if (!hideMsg && error.response) {
      showNotification({ type: "error", message: error.response.data.message });
    }
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};


export const handleDownloadPdf = async ({ url }) => {
  const baseURL = process.env.REACT_APP_API_URL;

  try {
    const response = await axios.get(`${baseURL}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    // Check if the response contains the pdfUrl
    if (response.data && response.data.pdfUrl) {
      const pdfUrl = response.data.pdfUrl;

      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');

      showNotification({ type: "success", message: "PDF opened in a new tab" });
    } else {
      showNotification({ type: "error", message: "Error opening PDF" });
    }
  } catch (error) {
    console.error("Error opening PDF:", error);
    showNotification({ type: "error", message: "Error opening PDF" });
  }
};

