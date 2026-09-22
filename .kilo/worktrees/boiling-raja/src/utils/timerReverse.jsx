import { useEffect, useState } from "react";

// Helper function to start the reverse timer
const startReverseTimer = (totalMinutes, callback) => {
  if (typeof totalMinutes !== "number" || totalMinutes < 0) {
    throw new Error("Invalid input. Please provide a positive number.");
  }

  let remainingTime = totalMinutes * 60;

  const timerInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      callback("Time's up!");
      return;
    }

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const hourStr = hours > 0 ? `${hours}hr` : "";
    const minStr = minutes > 0 ? `${minutes}min` : "";
    const secStr = seconds > 0 ? `${seconds}sec` : "";

    const formattedTime = `${hourStr} ${minStr} ${secStr}`.trim();
    callback(formattedTime);

    remainingTime -= 1;
  }, 1000);

  return timerInterval;
};

export const StartReverseTimer = ({ timeLeft }) => {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const timerInterval = startReverseTimer(timeLeft || 0, (time) => {
      setFormattedTime(time);
    });

    return () => {
      clearInterval(timerInterval);
    };
  }, [timeLeft]);

  return <span>{formattedTime}</span>;
};
