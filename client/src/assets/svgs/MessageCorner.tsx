import React from "react";

function MessageCorner({ isOwnMessage }: { isOwnMessage: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="20"
      viewBox="0 0 9 20"
      fill="none"
      className={`absolute shadow-none -top-[2.9px] ${
        isOwnMessage
          ? "-right-2 dark:fill-cyan-700 scale-x-[-1] fill-cyan-400"
          : "-left-2 dark:fill-bunker-900 fill-bunker-100"
      }`}
    >
      <g clip-path="url(#clip0_185_2)">
        <g filter="url(#filter0_d_185_2)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.0002 3H9.0002V20C8.8072 17.16 8.1242 14.233 6.9502 11.218C6.0462 8.893 4.5042 6.733 2.3252 4.738C2.17641 4.60196 2.07222 4.42412 2.02629 4.22781C1.98037 4.0315 1.99485 3.8259 2.06783 3.63797C2.14082 3.45004 2.26891 3.28856 2.4353 3.17471C2.60168 3.06086 2.79859 2.99996 3.0002 3Z"
          />
        </g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.0002 3H9.0002V20C8.8072 17.16 8.1242 14.233 6.9502 11.218C6.0462 8.893 4.5042 6.733 2.3252 4.738C2.17641 4.60196 2.07222 4.42412 2.02629 4.22781C1.98037 4.0315 1.99485 3.8259 2.06783 3.63797C2.14082 3.45004 2.26891 3.28856 2.4353 3.17471C2.60168 3.06086 2.79859 2.99996 3.0002 3Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_185_2">
          <rect
            width="9"
            height="20"
            fill="white"
            transform="matrix(1 0 0 -1 0 20)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MessageCorner;
