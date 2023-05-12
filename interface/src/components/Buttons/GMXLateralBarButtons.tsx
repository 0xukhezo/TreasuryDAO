import React from "react";

interface GMXLateralBarButtonsInterface {
  setDisplay: (display: string) => void;
}

export default function ArbitrumLateralBarButtons({
  setDisplay,
}: GMXLateralBarButtonsInterface) {
  return (
    <>
      <button
        onClick={() => setDisplay("gmxPositions")}
        className="p-2 border-2 border-black rounded-xl  my-2 mt-4"
      >
        GMX positions
      </button>
      <button
        onClick={() => setDisplay("gmxOpenPosition")}
        className="p-2 border-2 border-black rounded-xl my-2"
      >
        Open GMX position
      </button>
    </>
  );
}
