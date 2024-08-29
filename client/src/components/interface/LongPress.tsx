import React, { useState, useEffect } from "react";

const LongPressButton = ({ onLongPress, delay = 500, children }: any) => {
  const [timer, setTimer] = useState<any>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const startPressTimer = (clientX: number, clientY: number) => {
    setTimer(
      setTimeout(() => {
        onLongPress();
      }, delay)
    );
  };

  const cancelPressTimer = () => {
    if (timer) clearTimeout(timer);
    setTimer(null);
  };

  const handlePressStart = (clientX: number, clientY: number) => {
    setIsPressing(true);
    setStartPosition({ x: clientX, y: clientY });
    startPressTimer(clientX, clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handlePressStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressStart(touch.clientX, touch.clientY);
  };

  const handlePressEnd = () => {
    cancelPressTimer();
    setIsPressing(false);
    setStartPosition(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPressing && startPosition) {
      const touch = e.touches[0];
      const distanceMoved = Math.hypot(
        touch.clientX - startPosition.x,
        touch.clientY - startPosition.y
      );
      if (distanceMoved > 10) handlePressEnd();
    }
  };

  useEffect(() => cancelPressTimer, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
};

export default LongPressButton;
