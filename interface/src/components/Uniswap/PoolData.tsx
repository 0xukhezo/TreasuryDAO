import React, { useEffect, useState } from "react";
import abi from "../../../abi/abis.json";
import { useContractRead } from "wagmi";

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
  const [dataFormat, setDataFormat] = useState<any>();
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

  useEffect(() => {
    const dataFormat = data as any;
    setDataFormat(dataFormat);
  }, [isSuccess]);

  return (
    <div>
      {dataFormat !== undefined && dataFormat !== null && (
        <div className="mx-10">
          {(
            (liquidity / Number(dataFormat.sqrtPriceX96.toString())) *
            10 ** 13
          ).toFixed(2)}
          $
        </div>
      )}
    </div>
  );
}
