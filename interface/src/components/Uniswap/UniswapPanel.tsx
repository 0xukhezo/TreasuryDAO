import React, { useEffect, useState } from "react";
import OpenUniswapPosition from "./OpenUniswapPosition";
import UniswapPositionCard from "./UniswapPositionCard";

import { ethers } from "ethers";
import { useProvider } from "wagmi";

import { INonfungiblePositionManager } from "../../../types/INonfungiblePositionManager";
import abi from "../../../abi/abis.json";

interface UniswapPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
  getDisplay: (display: string) => void;
}

export default function UniswapPanel({
  display,
  timelockAddress,
  governorAddress,
  getDisplay,
}: UniswapPanelInterface) {
  const provider = useProvider();
  const [uniswapPositionsID, setUniswapPositionsID] = useState<string[]>();
  const [displayPositions, setDisplayPositions] = useState<string>(display);
  let positionsID: any[] = [];
  const nonFungiblePositionManagerAddr =
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  const getUniswapPositions = async () => {
    const nonFungiblePositionManager = new ethers.Contract(
      nonFungiblePositionManagerAddr,
      abi.abiINonfungiblePositionManager,
      provider
    );

    const filter = nonFungiblePositionManager.filters.Transfer(
      null,
      timelockAddress,
      null
    );

    const logs: Array<any> = await nonFungiblePositionManager.queryFilter(
      filter
    );

    for (let i = 0; i < logs.length; i++) {
      positionsID.push(logs[i].args[2].toString());
    }
    setUniswapPositionsID(positionsID);
  };

  useEffect(() => {
    getUniswapPositions();
  }, []);

  const changeDisplay = (display: string) => {
    setDisplayPositions("uniswapPositionsOpen");
    getDisplay(display);
  };

  return (
    <div className="mx-14 mt-4">
      {displayPositions === "uniswapPositions" ? (
        <>
          <div className="flex justify-between">
            <h2 className="text-2xl my-2 text-superfluid-100 leading-8 font-bold">
              Current LP Positions
            </h2>
            <button
              className=" px-6 py-1 rounded-full  h-12 bg-black text-white"
              onClick={() => changeDisplay("uniswapPositionsOpen")}
            >
              Open LP Position
            </button>
          </div>
          <div>
            {uniswapPositionsID?.length !== 0 ? (
              <>
                <div className="flex flex-row grid grid-cols-5 mt-6">
                  <div className="mx-10"></div>
                  <div className="mx-10">Fee Tier</div>
                  <div className="mx-12">Price Range</div>
                  <div className="mx-6">Liquidity</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row grid grid-cols-5 mt-6">
                  <div className="mx-10"></div>
                  <div className="mx-10">Fee Tier</div>
                  <div className="mx-12">Price Range</div>
                  <div className="mx-6">Liquidity</div>
                </div>
                <div className="animate-pulse">
                  <div className="rounded-lg bg-beige px-4 py-10 mt-4"></div>
                </div>
              </>
            )}

            {uniswapPositionsID?.map((id: string, index: number) => {
              return (
                <div key={index}>
                  <UniswapPositionCard
                    id={id}
                    governorAddress={governorAddress}
                    timelockAddress={timelockAddress}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <OpenUniswapPosition
          governorAddress={governorAddress}
          timelockAddress={timelockAddress}
          displayPositions={displayPositions}
        />
      )}
    </div>
  );
}
