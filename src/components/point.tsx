import React, { useState } from "react";

interface CircleWithNumberProps {
  number: number;
  top: string;
  left: string;
  zindex: number;
  size: number;
  onClick: (
    number: number,
    setStatusPoint: (
      color: TBgColor,
      isShow: boolean,
      delayTime: number
    ) => Promise<void>
  ) => void;
}
export type TBgColor = "#FF6600" | "#FFFFFF";

const Point: React.FC<CircleWithNumberProps> = ({
  number,
  top,
  left,
  zindex,
  size,
  onClick,
}) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<TBgColor>("#FFFFFF");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const setStatusPoint = async (
    color: TBgColor,
    isShow: boolean,
    delayTime: number
  ) => {
    setBgColor(color);
    await delay(delayTime);
    setIsShow(isShow);
  };

  return isShow ? (
    <div
      onClick={() => {
        if (isClicked) return;

        setIsClicked(true);
        onClick(number, setStatusPoint);
      }}
      className={`font-bold text-xl flex items-center justify-center rounded-full border border-black cursor-pointer absolute transition-colors duration-300`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        top,
        left,
        backgroundColor: `${bgColor}`,
        zIndex: zindex,
      }}
    >
      {number}
    </div>
  ) : (
    <></>
  );
};

export default Point;
