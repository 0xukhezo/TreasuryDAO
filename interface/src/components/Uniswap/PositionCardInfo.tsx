import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import abi from "../../../abi/abis.json";
import { ethers } from "ethers";
import PoolData from "./PoolData";

interface PositionCardInfoInterface {
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickUpper: number;
  tickLower: number;
  liquidity: number;
  feeToken0: number;
  feeToken1: number;
}

function PositionCardInfo({
  token0,
  token1,
  fee,
  tickUpper,
  tickLower,
  liquidity,
  feeToken0,
  feeToken1,
}: PositionCardInfoInterface) {
  const [token0Decimal, setToken0Decimal] = useState<number>();
  const [token1Decimal, setToken1Decimal] = useState<number>();
  const [tickUp, setTickUp] = useState<number>();
  const [tickLow, setTickLow] = useState<number>();

  const { data: dataToken0, isSuccess: isSuccessToken0 } = useContractRead({
    address: token0,
    abi: abi.abiERC20,
    functionName: "decimals",
  });

  const { data: dataToken1, isSuccess: isSuccessToken1 } = useContractRead({
    address: token1,
    abi: abi.abiERC20,
    functionName: "decimals",
  });

  const { data: dataPool, isSuccess: isSuccessPool } = useContractRead({
    address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    abi: abi.abiUniswapFactory,
    functionName: "getPool",
    args: [token0, token1, fee],
  });

  useEffect(() => {
    const positionData = dataToken0 as number;
    setToken0Decimal(positionData);
  }, [isSuccessToken0]);

  useEffect(() => {
    const positionData = dataToken1 as number;
    setToken1Decimal(positionData);
  }, [isSuccessToken1]);

  useEffect(() => {
    if (token0Decimal !== undefined && token1Decimal !== undefined) {
      const price0low =
        1 /
        (1.0001 ** -Number(tickLower) / 10 ** (token0Decimal - token1Decimal));
      const price0up =
        1 /
        (1.0001 ** -Number(tickUpper) / 10 ** (token0Decimal - token1Decimal));
      setTickUp(price0up);
      setTickLow(price0low);
    }
  }, [token1Decimal]);

  return (
    <div className="flex flex-row">
      {tickUp !== undefined && tickLow !== undefined && (
        <>
          <div className="mx-2">{tickUp.toFixed(2)}</div>
          <div className="mx-2">{tickLow.toFixed(2)}</div>
          {dataPool && (
            <PoolData
              dataPool={dataPool}
              liquidity={liquidity}
              feeToken0={feeToken0}
              feeToken1={feeToken1}
            />
          )}
          {/* <div className="mx-2">
            {ethers.utils
              .formatUnits(amount0.toString(), token0Decimal)
              .toString()}
          </div>
          <div className="mx-2">
            {ethers.utils
              .formatUnits(amount1.toString(), token1Decimal)
              .toString()}
          </div> */}
          <div className="mx-2">
            {liquidity.toString() === "0" ? "Closed" : "Active"}
          </div>
        </>
      )}
    </div>
  );
}

export default PositionCardInfo;
