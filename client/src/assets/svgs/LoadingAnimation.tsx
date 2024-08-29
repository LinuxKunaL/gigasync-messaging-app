import React from "react";

type Props = {};

function LoadingAnimation({}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-9 sm:size-12 ml-3"
      viewBox="0 0 200 200"
    >
      <circle
        fill="#00c2dc"
        stroke="#00c2dc"
        strokeWidth={18}
        r={15}
        cx={40}
        cy={100}
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.1"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        />
      </circle>
      <circle
        fill="#00c2dc"
        stroke="#00c2dc"
        strokeWidth={18}
        r={15}
        cx={100}
        cy={100}
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.1"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        />
      </circle>
      <circle
        fill="#00c2dc"
        stroke="#00c2dc"
        strokeWidth={18}
        r={15}
        cx={160}
        cy={100}
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.1"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin={0}
        />
      </circle>
    </svg>
  );
}

export default LoadingAnimation;
