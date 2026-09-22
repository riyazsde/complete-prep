import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

const VideoPlayer = ({ videoLink }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const saveNotes = (notesContent) => {
    const blob = new Blob([notesContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt"; // File name for the downloaded file
    link.click();
  };
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    videoRef.current.volume = e.target.value;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const increaseSpeed = () => {
    const newSpeed = Math.min(playbackSpeed + 0.25, 2);
    setPlaybackSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  const decreaseSpeed = () => {
    const newSpeed = Math.max(playbackSpeed - 0.25, 0.5);
    setPlaybackSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div
      style={{ width: "100%", borderRadius: "10px", overflow: "hidden" }}
      className="video-player"
    >
      <video
        ref={videoRef}
        src={videoLink || "https://www.w3schools.com/html/mov_bbb.mp4"}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ width: "100%", borderRadius: "10px", overflow: "hidden" }}
      />
      <div className="seek-bar">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          title="Seek"
        />
      </div>
      <div className="controls">
        <div className="progress-bar1">
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <Icon
              icon={
                isPlaying ? "heroicons-outline:pause" : "line-md:play-filled"
              }
              width="24"
              height="24"
            />
          </button>

          <button onClick={decreaseSpeed} aria-label="Decrease Speed">
            <Icon
              icon="iconamoon:arrow-left-6-circle-light"
              width="24"
              height="24"
            />
          </button>
          <span>{playbackSpeed.toFixed(2)}x</span>
          <button onClick={increaseSpeed} aria-label="Increase Speed">
            <Icon
              icon="iconamoon:arrow-right-6-circle-light"
              width="24"
              height="24"
            />
          </button>

          <span style={{ minWidth: "100px" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button onClick={toggleNotes} aria-label="Add Notes">
            <Icon
              icon="fluent:document-signature-32-regular"
              width="24"
              height="24"
            />
          </button>
        </div>

        <div className="progress-bar2">
          <div className="volume-control">
            <Icon icon="line-md:volume-medium-filled" width="24" height="24" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              title="Volume"
            />
          </div>

          <button onClick={toggleFullscreen} aria-label="Fullscreen">
            <Icon icon="gridicons:fullscreen" width="24" height="24" />
          </button>
        </div>
      </div>

      {showNotes && (
        <div className="notes">
          <textarea
            placeholder="Type your notes here..."
            value={notes}
            onChange={handleNotesChange}
          />
          <p style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                marginRight: "10px",
                marginTop: "10px",
                border: "1px solid white",
                borderRadius: "5px",
                padding: "5px",
                color: "white",
              }}
              onClick={() => saveNotes(notes)}
              className="save-notes"
            >
              Save Notes
            </button>
          </p>
        </div>
      )}

      <style jsx>{`
        .video-player {
          width: 600px;
          margin: auto;
          background: #000;
          position: relative;
        }
        .controls {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #222;
          color: white;
          border-radius: 0 0 8px 8px;
        }
        .progress-bar1 {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .seek-bar {
          margin: 10px auto;
          width: 95%;
        }
        .progress-bar2 {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        .volume-control {
          display: flex;
          align-items: center;
        }
        input[type="range"] {
          width: 100%;
        }
        .notes {
          margin: 10px auto;
          width: 95%;
          display: flex;
          flex-direction: column;
        }
        textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          font-size: 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          resize: vertical;
        }

        @media (max-width: 768px) {
          .seek-bar {
            order: -1;
            margin-bottom: 10px;
          }
          .controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
