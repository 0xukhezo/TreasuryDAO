import React, { useEffect, useState } from "react";

import { ethers } from "ethers";
import { useProvider } from "wagmi";

import { INonfungiblePositionManager } from "../../../types/INonfungiblePositionManager";
import abi from "../../../abi/abis.json";
import UniswapPositionCard from "./UniswapPositionCard";

interface UniswapPositionsInterface {
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function UniswapPositions({
  timelockAddress,
  governorAddress,
}: UniswapPositionsInterface) {
  const provider = useProvider();
  const [uniswapPositionsID, setUniswapPositionsID] = useState<string[]>();

  let positionsID: any[] = [];
  const nonFungiblePositionManagerAddr =
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  const getUniswapPositions = async () => {
    const nonFungiblePositionManager = new ethers.Contract(
      nonFungiblePositionManagerAddr,
      abi.abiINonfungiblePositionManager,
      provider
    ) as INonfungiblePositionManager;

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

  return (
    <div className="mx-14 mt-10">
      <div className="flex justify-between">
        <h2 className="text-2xl my-2 text-superfluid-100 leading-8 font-bold">
          Current LP Positions
        </h2>
        <button className=" px-6 py-1 rounded-full  h-12 bg-black text-white">
          Open LP Position
        </button>
      </div>
      <div>
        {uniswapPositionsID?.length !== 0 && (
          <div className="flex flex-row grid grid-cols-5 mt-6">
            <div className="mx-10"></div>
            <div className="mx-10">Fee Tier</div>
            <div className="mx-12">Price Range</div>
            <div className="mx-6">Liquidity</div>
          </div>
        )}

        {uniswapPositionsID?.map((id: string, index: number) => {
          return (
            <div key={index}>
              <UniswapPositionCard id={id} governorAddress={governorAddress} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
