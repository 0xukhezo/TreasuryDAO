import React from "react";
import OpenUniswapPosition from "./OpenUniswapPosition";
import UniswapPositions from "./UniswapPositions";

interface UniswapPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function UniswapPanel({
  display,
  timelockAddress,
  governorAddress,
}: UniswapPanelInterface) {
  return (
    <div className="flex flex-col">
      {display === "uniswapPositions" ? (
        <UniswapPositions timelockAddress={timelockAddress} />
      ) : (
        <div className="h-containerUniswap w-containerUniswap rounded-3xl bg-white mx-auto my-6">
          <div className="flex justify-center flex-col py-10">
            <h2 className="text-2xl mx-auto my-2 text-superfluid-100 leading-8 font-bold">
              Open a Uniswap Position
            </h2>
            <OpenUniswapPosition governorAddress={governorAddress} />
          </div>
        </div>
      )}
    </div>
  );
}
