import React from "react";

interface UniswapLateralBarButtonsInterface {
  setDisplay: (display: string) => void;
}

export default function UniswapLateralBarButtons({
  setDisplay,
}: UniswapLateralBarButtonsInterface) {
  return (
    <>
      <button
        onClick={() => setDisplay("uniswapPositions")}
        className="p-2 border-2 border-black rounded-xl  my-2"
      >
        Uniswap positions
      </button>
      <button
        onClick={() => setDisplay("uniswapOpenPosition")}
        className="p-2 border-2 border-black rounded-xl  my-2"
      >
        Open Uniswap position
      </button>
    </>
  );
}
