import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";

const ResendButton = ({ onClick }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [timeLeft]);

  const handleResendClick = () => {
    console.log("Resend requested!");
    setTimeLeft(30);
    setIsDisabled(true);
    onClick();
  };

  return (
    <button
      className="resend-button"
      onClick={handleResendClick}
      disabled={isDisabled}
    >
      {isDisabled ? (
        `Resend in ${timeLeft}s`
      ) : (
        <>
          <Icon icon="solar:refresh-linear" /> Resend
        </>
      )}
    </button>
  );
};

export default ResendButton;
