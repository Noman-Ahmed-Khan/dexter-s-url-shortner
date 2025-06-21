// components/Spinner.tsx
import React from "react";

export default function Spinner() {
  return (
    <svg
      className="w-16 h-16"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        r="18"
        stroke="#F472B6"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="120"
        strokeDashoffset="60"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 32 32"
          to="360 32 32"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="60;0;60"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
