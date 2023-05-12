import React from "react";
import AAVEDisplayAPY from "./AAVEDisplayAPY";
import { useNetwork } from "wagmi";

interface AAVEPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function AAVEPanel({
  display,
  timelockAddress,
  governorAddress,
}: AAVEPanelInterface) {
  const { chain, chains } = useNetwork();
  let tokens: string[] = [];
  let contractAddress: `0x${string}`;
  switch (chain?.network) {
    case "optimism":
      tokens = [
        "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
        "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
        "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
        "0x4200000000000000000000000000000000000006",
      ];
      contractAddress = "0x69fa688f1dc47d4b5d8029d5a35fb7a548310654";
      break;
    case "arbitrum":
      tokens = [
        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
        "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      ];
      contractAddress = "0x6b4E260b765B3cA1514e618C0215A6B7839fF93e";
      break;
    case "polygon":
      tokens = [
        "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
        "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
        "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
      ];
      contractAddress = "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654";
      break;
  }

  return (
    <div>
      {tokens.map((tokenAddress: string, index: number) => {
        return (
          <div key={index}>
            <AAVEDisplayAPY
              tokenAddress={tokenAddress}
              contractAddress={contractAddress}
            />
          </div>
        );
      })}
    </div>
  );
}
