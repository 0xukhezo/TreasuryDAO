import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import abi from "../../../abi/abis.json";
import PositionCardInfo from "./PositionCardInfo";

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

  return (
    <div className="rounded-3xl bg-gray-100 px-4 py-2 mt-4 flex grid grid-cols-5 gap-x-6 items-center text-center">
      {dataPosition && (
        <>
          <PositionCardInfo
            token0={dataPosition[2]}
            token1={dataPosition[3]}
            fee={dataPosition[4]}
            tickUpper={dataPosition[5]}
            tickLower={dataPosition[6]}
            liquidity={dataPosition[7]}
            feeToken0={dataPosition[8]}
            feeToken1={dataPosition[9]}
          />
        </>
      )}
    </div>
  );
}
