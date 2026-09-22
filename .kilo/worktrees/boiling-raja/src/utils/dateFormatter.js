import axios from "axios";
import { postRequest } from "../services/apiService";

export const formatToMonthYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

export const formatDateCurrentAffairs = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
};
export const formatDateCurrentAffairsTarget = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${month} ${year}`;
};

export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const differenceInSeconds = Math.floor((now - date) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const count = Math.floor(differenceInSeconds / unit.seconds);
    if (count > 0) {
      return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const getMonthStartDate = (monthIndex) => {
  const now = new Date();
  const year =
    monthIndex > now.getMonth() ? now.getFullYear() - 1 : now.getFullYear();
  return new Date(year, monthIndex, 1).toISOString().split("T")[0];
};

export const getMonthEndDate = (monthIndex) => {
  const now = new Date();
  const year =
    monthIndex > now.getMonth() ? now.getFullYear() - 1 : now.getFullYear();
  return new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];
};

export function formatDateStudyPlanner(inputDate) {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const convertToHoursAndMinutes = (decimalHours) => {
  if (!decimalHours || isNaN(decimalHours)) {
    return "0 hours";
  }

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  if (hours === 0 && minutes === 0) {
    return "0 hours";
  }

  if (minutes === 0) {
    return `${hours} hours`;
  }

  return `${hours} hours ${minutes} minutes`;
};

export const formatSecondsToMinutes = (seconds) => {
  return (seconds / 60).toFixed(2);
};

export const removeTrailingColon = (url) => {
  if (url.endsWith(":")) {
    return url.slice(0, -1);
  }
  return url;
};

export const downloadFile = (url, studyPlannerId, userStudyPlannerId) => {
  postRequest({
    endpoint: url,
    hideMsg: true,
    data: {
      studyPlanners: [studyPlannerId],
      userStudyPlanner: [userStudyPlannerId],
      quantity: 1,
    },
  })
    .then((res) => {
      if (res) {
        console.log("File added to cart successfully:", res);
      } else {
        console.error("Failed to add file to cart.");
      }
    })
    .catch((error) => {
      console.error("Error adding file to cart:", error);
    });
};
