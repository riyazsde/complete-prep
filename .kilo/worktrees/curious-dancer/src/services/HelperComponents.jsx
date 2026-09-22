import { RotatingLines } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height={56}
        width={56}
        color="grey"
        strokeWidth={5}
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};


export const DataNotFound = () => {
  return (
    <div className="loader-container">
      <h1>Data Not Found</h1>
    </div>
  );
};