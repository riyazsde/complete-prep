import React from 'react';

const SemiCircleProgress = ({ progress, label }) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  
  // Calculate the angle for the semi-circle (progress from 0 to 180 degrees)
  const angle = (clampedProgress / 100) * 180;

  // Calculate the coordinates for the arc's end point
  const radius = 50;
  const radians = ((180 - angle) * Math.PI) / 180;
  const x = radius - radius * Math.cos(radians);
  const y = radius - radius * Math.sin(radians);

  // Determine if the arc should be large (greater than 50%)
  const largeArcFlag = angle > 90 ? 1 : 0;

  return (
    <div className="flex flex-col items-center text-center">
      <svg width="120" height="80" viewBox="0 0 100 60">
        {/* Background semi-circle (grey) */}
        <path
          d="M 0,50 A 50,50 0 1,1 100,50 L 50,50 Z"
          fill="#E5E7EB"
        />
        
        {/* Progress semi-circle (filled based on progress, starting from the left) */}
        <path
          d={`M 50,50 L 0,50 A 50,50 0 ${largeArcFlag},1 ${x},${y} Z`}
          fill="#3B82F6" // Blue fill color
        />

        {/* Center dot */}
        <circle cx="50" cy="50" r="4" fill="black" />
      </svg>

      {/* Progress Percentage */}
      <div style={{color:"#6090F7",fontWeight:"bold",fontSize:"1.5rem"}} className="text-blue-500 text-lg font-semibold mt-2">
        {clampedProgress}%
      </div>
      <div style={{fontSize:"1.2rem",color:"#3E3E45"}} className="text-gray-800">{label}</div>
    </div>
  );
};

export default SemiCircleProgress;
