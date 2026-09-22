import images from "../../utils/images";

export const ComingSoon = ({ containerCss, textCss }) => {
  return (
    <div
      className="coming-soon-container"
      style={containerCss} 
    >
      <p
        className="coming-soon-text"
        style={textCss}
      >
        {/* COMING SOON */}
        <img style={{ width: "100px", height: "70px" }} src={images.userCommingSoon2} alt="coming soon" />
      </p>
    </div>
  );
};
export const ComingSoonForDashboard = ({ containerCss, textCss }) => {
  return (
    <span
      className="coming-soon-container"
      style={containerCss} 
    >
      <span
        className="coming-soon-text"
        style={textCss}
      >
        {/* COMING SOON */}
        <img style={{ width: "100px", height: "70px" }} src={images.userCommingSoon2} alt="coming soon" />
      </span>
    </span>
  );
};
