import React, { useEffect } from "react";
import abi from "../../../abi/abis.json";
import { useContractRead } from "wagmi";
import { TickMath, Position } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

interface PoolDataInterfece {
  dataPool: any;
  liquidity: any;
  feeToken0: any;
  feeToken1: any;
}

export default function PoolData({
  dataPool,
  liquidity,
  feeToken0,
  feeToken1,
}: PoolDataInterfece) {
  const { data, isSuccess } = useContractRead({
    address: dataPool,
    abi: abi.abiPool,
    functionName: "slot0",
  });

  const {
    data: feeGrowthInside0X128Data,
    isSuccess: isSuccessfeeGrowthInside0X128,
  } = useContractRead({
    address: dataPool,
    abi: abi.abiPool,
    functionName: "feeGrowthGlobal0X128",
  });

  return (
    <div>
      {data !== undefined && data !== null && (
        <div className="mx-10">
          {(
            (liquidity / Number(data.sqrtPriceX96.toString())) *
            10 ** 13
          ).toFixed(2)}
          $
        </div>
      )}
    </div>
  );
}
