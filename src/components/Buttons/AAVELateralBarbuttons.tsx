interface AAVELateralBarbuttonsInterface {
  setDisplay: (display: string) => void;
}

export default function AAVELateralBarbuttons({
  setDisplay,
}: AAVELateralBarbuttonsInterface) {
  return (
    <>
      <button
        onClick={() => setDisplay("aavePositions")}
        className="p-2 border-2 border-black rounded-xl  my-2 mt-4"
      >
        AAVE positions
      </button>
      <button
        onClick={() => setDisplay("aaveOpenPosition")}
        className="p-2 border-2 border-black rounded-xl my-2"
      >
        Open AAVE position
      </button>
    </>
  );
}
