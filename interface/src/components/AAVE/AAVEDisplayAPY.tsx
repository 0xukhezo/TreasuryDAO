import React, { useEffect, useState } from "react";
import abi from "../../../abi/abis.json";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";

interface AAVEDisplayAPYInterface {
  tokenAddress: string;
  contractAddress?: `0x${string}`;
}

export default function AAVEDisplayAPY({
  tokenAddress,
  contractAddress,
}: AAVEDisplayAPYInterface) {
  const [apy, setApy] = useState<Object>();
  const { data, isSuccess } = useContractRead({
    address: contractAddress,
    abi: abi.abiPoolDataProvider,
    functionName: "getReserveData",
    args: [tokenAddress],
  });

  useEffect(() => {
    const apyData = data as Object;
    setApy(apyData);
  }, [isSuccess]);

  return (
    <div>
      {apy !== undefined &&
        Number(
          ethers.utils.formatUnits(apy.variableBorrowRate.toString(), "25")
        ).toFixed(2)}
    </div>
  );
}
