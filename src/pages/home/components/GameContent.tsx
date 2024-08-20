import React, { useMemo, useRef } from "react";
import Point, { TBgColor } from "../../../components/point";

interface IProps {
  points: number[];
  disable: boolean;
  onClickPoint: (
    number: number,
    setStatusPoint: (
      color: TBgColor,
      isShow: boolean,
      delayTime: number
    ) => Promise<void>
  ) => void;
}

const GameContent: React.FC<IProps> = ({ points, disable, onClickPoint }) => {
  const containerRef = useRef(null);
  const getTextWidth = (text: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;

    context.font = getComputedStyle(document.body).font;

    return Math.round(context.measureText(text).width) + 28;
  };

  const renderPoints = useMemo(() => {
    const container = containerRef.current || {
      clientWidth: 0,
      clientHeight: 0,
    };
    const containerWidth = container?.clientWidth;
    const containerHeight = container?.clientHeight;
    return points.map((point) => {
      const size = getTextWidth(point.toString());
      const left = Math.random() * (containerWidth - size) + "px";
      const top = Math.random() * (containerHeight - size) + "px";
      const key = new Date().getTime().toString() + point.toString();
      return (
        <Point
          onClick={onClickPoint}
          key={key.toString()}
          size={size}
          number={point}
          top={top}
          left={left}
          zindex={points.length - point}
        />
      );
    });
  }, [points, onClickPoint]);

  return (
    <div
      ref={containerRef}
      style={{
        pointerEvents: disable ? "none" : "all",
        cursor: "default",
      }}
      className="overflow-hidden border border-gray-800 flex-1 cursor-default relative"
    >
      {renderPoints}
    </div>
  );
};

export default React.memo(GameContent);
