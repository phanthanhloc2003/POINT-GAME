import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import GameContent from "./components/GameContent";
import { TBgColor } from "../../components/point";

const Home: React.FC = () => {
  const [pointInput, setPointInput] = useState<string>("4");
  const [points, setPoints] = useState<number[]>([]);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isWin, setIsWind] = useState<boolean | null>(null);
  const interval = useRef<any>(null);
  const checkWin = useRef(1);

  const onClickPoint = useCallback(
    async (
      point: number,
      setStatusPoint: (
        color: TBgColor,
        isShow: boolean,
        delayTime: number
      ) => Promise<void>
    ) => {
      if (points[point - 1] !== checkWin.current) {
        setStatusPoint("#FFFFFF", true, 0).then(() => {
          clearTime(false);
          setIsWind(false);
        });
        return;
      }
      const pointIndex = Number(points[points.length - 1]);
      const checkWinIndex = Number(checkWin.current);
      setStatusPoint("#FF6600", false, 1000).then(() => {
        if (pointIndex === checkWinIndex) {
          clearTime(false);
          setIsWind(true);
        }
      });

      checkWin.current++;
    },
    [checkWin, points]
  );

  const formatTime = (ms: number) => {
    const milliseconds = (ms % 1000) / 10;
    const seconds = Math.floor(ms / 1000);

    return `${seconds.toString().padStart(2, "0")}:${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (interval.current) return;

    interval.current = setInterval(() => {
      setMilliseconds((prevMilliseconds) => prevMilliseconds + 100);
    }, 100);
  };

  const clearTime = (isSetMilliseconds: boolean = true) => {
    interval.current && clearInterval(interval.current);
    interval.current = null;
    isSetMilliseconds && setMilliseconds(0);
  };

  const restartHandle = () => {
    if (points?.length) {
      onRestartState();
    }

    startTimer();
    const numPoints = parseInt(pointInput);
    setPoints([...generatePoints(numPoints)]);
  };

  const inputHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "input-point") return;

    setPointInput(value);
  };

  const generatePoints = (numPoints: number): number[] => {
    const newPoints = Array.from({ length: numPoints }, (_, i) => i + 1);
    return newPoints.sort((a, b) => a - b);
  };

  const onRestartState = () => {
    setIsWind(null);
    clearTime();
    checkWin.current = 1;
    setPoints((pre: number[]) => {
      return [...pre];
    });
  };

  useEffect(() => {
    return () => interval?.current && clearInterval(interval.current);
  }, []);

  return (
    <div className="app h-[100vh] flex justify-center items-center">
      <div className="w-[80%] h-[90%] border-2 border-gray-800 p-4 flex flex-col">
        <h1
          style={{
            color: `${
              isWin === null ? "black" : isWin === true ? "green" : "red"
            }`,
          }}
          className="font-bold "
        >
          {isWin === null
            ? "LET'S PLAY"
            : isWin === true
            ? "ALL CLEARED"
            : "GAME OVER"}
        </h1>
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex">
            <label className="min-w-36 block" htmlFor="input-point">
              Points
            </label>
            <input
              name="input-point"
              id="input-point"
              type="text"
              className="w-20 sm:w-80 border border-gray-300 rounded-md px-1"
              placeholder="Enter point number"
              value={pointInput}
              onChange={inputHandle}
            />
          </div>
          <div className="flex">
            <p className="min-w-36 block">Time</p>
            <p>{formatTime(milliseconds)}s</p>
          </div>
          <div>
            <button
              disabled={!!(!pointInput || isNaN(Number(pointInput)))}
              onClick={restartHandle}
              className={`border border-black font-semibold px-4 rounded ${
                !!(!pointInput || isNaN(Number(pointInput)))
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                  : ""
              }`}
            >
              {points.length ? "Restart" : "Play"}
            </button>
          </div>
        </div>
        <GameContent
          disable={isWin !== null}
          points={points}
          onClickPoint={onClickPoint}
        />
      </div>
    </div>
  );
};

export default Home;
