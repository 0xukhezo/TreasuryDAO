import React, { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import {
  coinDataArbitrum,
  coinDataOptimist,
  coinDataPolygon,
  debtAAVEArbitrum,
} from "../../../utils/tokens";
import AAVEPositionCard from "./AAVEPositionCard";
import OpenAAVEPosition from "./OpenAAVEPosition";

interface AAVEPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
  getDisplay: (display: string) => void;
}

export default function AAVEPanel({
  display,
  timelockAddress,
  governorAddress,
  getDisplay,
}: AAVEPanelInterface) {
  const { chain } = useNetwork();
  const [displayPositions, setDisplayPositions] = useState<string>(display);
  let tokens: any[] = [];
  let contractAddress: `0x${string}`;
  let coins: {
    [x: string]:
      | { img: string; symbol: string }[]
      | { img: string; symbol: string }[]
      | { img: string; symbol: string }[];
  };

  switch (chain?.network) {
    case "optimism":
      tokens = [
        { token: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", symbol: "" },
        { token: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6", symbol: "" },
        { token: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6", symbol: "" },
        { token: "0x4200000000000000000000000000000000000006", symbol: "" },
      ];
      contractAddress = "0x69fa688f1dc47d4b5d8029d5a35fb7a548310654";
      coins = coinDataOptimist;
      break;
    case "arbitrum":
      tokens = [
        { token: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", symbol: "WBTC" },
        { token: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", symbol: "WETH" },
        { token: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", symbol: "LINK" },
        { token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", symbol: "USDC" },
      ];
      contractAddress = "0x6b4E260b765B3cA1514e618C0215A6B7839fF93e";
      coins = coinDataArbitrum;
      break;
    case "matic":
      tokens = [
        { token: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", symbol: "" },
        { token: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", symbol: "" },
        { token: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", symbol: "" },
        { token: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", symbol: "" },
      ];
      contractAddress = "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654";
      coins = coinDataPolygon;
      break;
  }

  const changeDisplay = (display: string) => {
    setDisplayPositions("aavePositionsOpen");
    getDisplay(display);
  };

  return (
    <div>
      {displayPositions !== "aavePositionsOpen" ? (
        <>
          <div className="flex justify-between mx-14 mt-8">
            <h2 className="text-2xl my-2 text-superfluid-100 leading-8 font-bold">
              Current positions
            </h2>
            <button
              className=" px-6 py-1 rounded-full  h-12 bg-black text-white"
              onClick={() => changeDisplay("aavePositionsOpen")}
            >
              Open a Position
            </button>
          </div>
          {debtAAVEArbitrum?.length !== 0 && (
            <>
              <div className="flex flex-row grid grid-cols-6 mt-6">
                <div></div>
                <div className="pl-20">Collateral</div>
                <div>Loan Interest Rate</div>
                <div className="pl-14">Realized PnL</div>
                <div className="pl-8">Unrealized PnL</div>
              </div>
              <div className="animate-pulse mx-14">
                <div className="rounded-lg bg-beige px-4 py-10 mt-4"></div>
              </div>
            </>
          )}
          {debtAAVEArbitrum.map((debtToken: any, index: number) => {
            return (
              <div key={index}>
                <AAVEPositionCard
                  debtToken={debtToken}
                  timelockAddress={timelockAddress}
                  governorAddress={governorAddress}
                  tokens={tokens}
                  contractAddress={contractAddress}
                  coins={coins}
                />
              </div>
            );
          })}
        </>
      ) : (
        <OpenAAVEPosition
          governorAddress={governorAddress}
          displayPositions={displayPositions}
        />
      )}
    </div>
  );
}
