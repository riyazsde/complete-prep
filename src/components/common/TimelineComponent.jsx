import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styles from "./common_css/TimelibeComponent.module.css";
import { formatSecondsToMinutes, formatTimeToMinutes } from "../../utils/dateFormatter";

const TimelineComponent = ({ timelineItems }) => {
  console.log(timelineItems);
  return (
    <div>
      <VerticalTimeline>
        {timelineItems.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            contentStyle={{
              background: "#DCF2FF",
              color: "#000",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "10px",
            }}
            contentArrowStyle={{ display: "none" }}
            iconStyle={{
              background: "#000",
              color: "#fff",
              width: "12px",
              height: "12px",
              marginTop: "1rem",
            }}
            date={item.date}
            icon={
              <div
                style={{
                  background: "#000",
                  borderRadius: "50%",
                  width: "100%",
                  height: "100%",
                }}
              />
            }
          >
            <div
              style={{
                background: "#E0F3FF",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#000",
                fontSize: "14px",
                fontWeight: "500",
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              <span role="img" aria-label="calendar">
                📅
              </span>{" "}
              {item.startDate}
            </div>

            <div
              className="timeline-content"
              style={{
                background: "#DCF2FF",
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  color: "#0F19B6",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                {item.description}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#FFF",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  <span role="img" aria-label="video">
                    📹
                  </span>{" "}
                  {item.totalVideosWatched} videos watched
                </span>
                <span
                  style={{
                    background: "#FFF",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  <span role="img" aria-label="practice">
                    ❓
                  </span>{" "}
                  {item.totalPracticeActivities} Practice activities
                </span>
                <span
                  style={{
                    background: "#FFF",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  <span role="img" aria-label="test">
                    📑
                  </span>{" "}
                  {item.totalTestsTaken} Tests Taken
                </span>
                <span
                  style={{
                    background: "#FFF",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  <span role="img" aria-label="test">
                    📑
                  </span>{" "}
                  {formatSecondsToMinutes(item?.totalTimeSpent||0)} Min Time Spent
                </span>
              </div>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default TimelineComponent;
