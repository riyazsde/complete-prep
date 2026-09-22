import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const ContentWithShowMore = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const charLimit = 100; // Define a character limit for truncation

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p>{isExpanded ? content : `${content?.slice(0, charLimit)}...`}</p>
      {content?.length > charLimit && (
        <button
          onClick={toggleExpand}
          style={{
            color: "#6090F7",
            cursor: "pointer",
            background: "none",
            border: "none",
          }}
        >
          {isExpanded ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: "500",
              }}
            >
              <span>Read less</span>
              <span>
                <Icon icon="line-md:arrow-up" />
              </span>
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: "500",
              }}
            >
              <span>Read more</span>
              <span>
                <Icon icon="line-md:arrow-right" />
              </span>
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ContentWithShowMore;
