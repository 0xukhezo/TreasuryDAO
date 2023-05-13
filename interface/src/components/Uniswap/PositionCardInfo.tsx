import React, { useEffect, useState } from "react";
import { useContractRead, useProvider } from "wagmi";

import { createProposalClosePositionUniswap } from "../../../utils/uniswapFunctions";
import { TimelockController } from "../../../types/TimelockController";
import { INonfungiblePositionManager } from "../../../types/INonfungiblePositionManager";

import abi from "../../../abi/abis.json";
import PoolData from "./PoolData";
import Image from "next/image";

import { coinDataArbitrum } from "../../../utils/tokens";
import ConfirmationModalInterface from "../Modal/ConfirmationModalInterface";
import { ethers } from "ethers";

interface PositionCardInfoInterface {
  id: string;
  governorAddress: `0x${string}`;
  timelockAddress: `0x${string}`;
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
  id,
  governorAddress,
  timelockAddress,
  token0,
  token1,
  fee,
  tickUpper,
  tickLower,
  liquidity,
  feeToken0,
  feeToken1,
}: PositionCardInfoInterface) {
  const provider = useProvider();
  const [token0Decimal, setToken0Decimal] = useState<number>();
  const [token1Decimal, setToken1Decimal] = useState<number>();
  const [tickUp, setTickUp] = useState<number>();
  const [tickLow, setTickLow] = useState<number>();
  const [modalView, setModalView] = useState<boolean>(false);
  const [callDatas, setCallDatas] = useState<string[]>();
  const [values, setValues] = useState<string[]>();
  const [targets, setTargets] = useState<string[]>();
  const [descriptionHash, setDescriptionHash] = useState<string>();

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

  const token0Info = Object.keys(coinDataArbitrum).find(
    (clave) => clave.toLowerCase() === token0.toLowerCase()
  );
  const token1Info = Object.keys(coinDataArbitrum).find(
    (clave) => clave.toLowerCase() === token1.toLowerCase()
  );

  const img0 = coinDataArbitrum[token0Info!][0].img as any;
  const img1 = coinDataArbitrum[token1Info!][0].img as any;

  const symbol0 = coinDataArbitrum[token0Info!][0].symbol as any;
  const symbol1 = coinDataArbitrum[token1Info!][0].symbol as any;

  const nonFungiblePositionManagerAddr =
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  const onGeretarePayloadClick = async () => {
    if (
      nonFungiblePositionManagerAddr !== undefined &&
      liquidity !== undefined &&
      id !== undefined
    ) {
      loadData(
        nonFungiblePositionManagerAddr,
        liquidity.toString(),
        id.toString()
      ).then(() => setModalView(true));
    }
  };

  async function loadData(
    nonFungiblePositionManagerAddr: string,
    liquidity: string,
    tokenId: string
  ) {
    const nonFungiblePositionManager = new ethers.Contract(
      nonFungiblePositionManagerAddr,
      abi.abiINonfungiblePositionManager,
      provider
    ) as INonfungiblePositionManager;

    const timelock = new ethers.Contract(
      timelockAddress,
      abi.abiTimelock,
      provider
    ) as TimelockController;

    const result = await createProposalClosePositionUniswap(
      tokenId,
      liquidity,
      nonFungiblePositionManager,
      timelock
    );

    setCallDatas(result.callDatas);
    setValues(result.values);
    setTargets(result.targets);
    setDescriptionHash(result.descriptionHash);
  }

  return (
    <div className="flex flex-row items-center grid grid-cols-5 ">
      {tickUp !== undefined && tickLow !== undefined && img0 && (
        <>
          <div className="flex mx-10">
            <Image
              width={20}
              height={20}
              alt="Chain Image"
              src={img0.src}
              className="z-10"
            />
            <Image
              width={20}
              height={20}
              alt="Chain Image"
              src={img1.src}
              className="z-10 -mx-2"
            />
            <div className="font-semibold mx-4">
              {symbol0} / {symbol1}
            </div>
          </div>

          <div className="mx-10">{Number(fee) / 10000}%</div>
          <div className="mx-10">
            {tickUp.toFixed(2)}/{tickLow.toFixed(2)}
          </div>
          {dataPool && (
            <PoolData
              dataPool={dataPool}
              liquidity={liquidity}
              feeToken0={feeToken0}
              feeToken1={feeToken1}
            />
          )}
          <button
            className="border-2 border-black rounded-full p-2 mx-10"
            onClick={() => onGeretarePayloadClick()}
          >
            Close Position
          </button>
          {modalView && (
            <ConfirmationModalInterface
              governorAddress={governorAddress}
              display="uniswap"
              callDatas={callDatas}
              values={values}
              targets={targets}
              descriptionHash={descriptionHash}
            />
          )}
        </>
      )}
    </div>
  );
}

export default PositionCardInfo;
