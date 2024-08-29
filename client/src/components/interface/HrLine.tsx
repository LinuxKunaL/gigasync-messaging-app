import React from "react";

function HrLine() {
  return (
    <div
      className="h-[2px] opacity-10 rounded-full w-full border-[1px] border-bunker-600/60"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,1) 39%, rgba(0,212,255,0) 100%)",
      }}
    />
  );
}

export default HrLine;
