import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import { ethers } from "ethers";
import { Token, CurrencyAmount } from "@uniswap/sdk-core";
import { TickMath } from "@uniswap/v3-sdk";

import tokens from "../../../utils/tokens";
import abi from "../../../abi/abis.json";

interface UniswapPositionCardInterface {
  id: string;
}

export default function UniswapPositionCard({
  id,
}: UniswapPositionCardInterface) {
  const [dataPosition, setDataPosition] = useState<any>();
  const { data, isSuccess } = useContractRead({
    address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    abi: abi.abiINonfungiblePositionManager,
    functionName: "positions",
    args: [id],
  });

  useEffect(() => {
    const positionData = data as Object;
    setDataPosition(positionData);
  }, [isSuccess]);

  //   const convertTickToUSDC = (tick: number) => {
  //     const baseToken = new Token(1, "0x...", 18, "USDC", "USD Coin");
  //     const quoteToken = new Token(1, "0x...", 18, "ETH", "Ethereum");

  //     const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);

  //     const priceQuoteToBase = CurrencyAmount.fromRawAmount(
  //       quoteToken,
  //       sqrtRatioX96
  //     )
  //       .divide(CurrencyAmount.fromRawAmount(baseToken, Math.pow(10, 18)))
  //       .toSignificant(6);

  //     const priceBaseToQuote = 1 / Number(priceQuoteToBase);

  //     const value = 1 / priceBaseToQuote;

  //     return value;
  //   };

  return (
    <div className="rounded-3xl bg-gray-100 px-4 py-2 mt-4 flex grid grid-cols-5 gap-x-6 items-center text-center">
      {dataPosition && (
        <>
          <div>{dataPosition.fee === 500 ? "0,05%" : "0,3%"}</div>
          {/* <div>{convertTickToUSDC(Number(dataPosition.tickLower))}</div>
          <div>{convertTickToUSDC(Number(dataPosition.tickUpper))}</div> */}
          <div>
            {dataPosition.liquidity.toString() === "0" ? "Closed" : "Active"}
          </div>
        </>
      )}
    </div>
  );
}
