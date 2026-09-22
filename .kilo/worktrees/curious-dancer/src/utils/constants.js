import { userApi } from "../services/apiFunctions";

export const modifyLink = (link) => {
  return link.toLowerCase().replace(/\s+/g, "-");
};

export const formatLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split("\n").map((line, index) => {
    return (
      <p key={index}>
        {line.split(urlRegex).map((part, i) =>
          urlRegex.test(part) ? (
            <a href={part} target="_blank" rel="noopener noreferrer" key={i}>
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
    );
  });
};

export const convertToHoursAndMinutesFun = (decimal) => {
  if (!decimal) return "0h 0m";
  const totalMinutes = Math.floor(decimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const formatDateCourse = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid Date";

  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithSuffix = day + getDaySuffix(day);

  return `${dayWithSuffix} ${month} ${year}`;
};

export const formatTimeSpentTimeLine = (seconds) => {
  const totalSeconds = Math.floor(seconds);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts = [];

  if (hrs > 0) parts.push(`${hrs} hour${hrs > 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);
  if (secs > 0 || parts.length === 0)
    parts.push(`${secs} sec${secs > 1 ? "s" : ""}`);

  return parts.slice(0, 2).join(" ");
};

export const formatDurationStudyPlanner = (timeInHours) => {
  if (!timeInHours || isNaN(timeInHours)) return "0 minutes";

  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);

  const hourStr = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteStr =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";

  if (hourStr && minuteStr) return `${hourStr} ${minuteStr}`;
  return hourStr || minuteStr || "0 minutes";
};

export const formatPurchaseDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();

  const getOrdinalSuffix = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

export const addToCart = ({ id, type, onSuccess }) => {
  userApi.cart.addToCart({
    data: { [type]: [id] },
    onSuccess,
    showMsg: true,
  });
};
