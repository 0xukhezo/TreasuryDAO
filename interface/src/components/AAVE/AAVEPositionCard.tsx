import { ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useContractRead, useProvider } from "wagmi";

import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/outline";

import abi from "../../../abi/abis.json";

import AAVEDisplayAPY from "./AAVEDisplayAPY";
import ConfirmationModal from "../Modal/ConfirmationModalInterface";
import { createProposeCloseNaturalPosition } from "../../../utils/aaveFunctions";
import { ERC20 } from "../../../types/ERC20";
import { GovHelper } from "../../../types/GovHelper";
import { IWETH9 } from "../../../types/IWETH";

interface AAVEPositionCardinterface {
  debtToken: any;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
  helperAddress: `0x${string}`;
  tokens: any;
  contractAddress: any;
  coins: any;
}

export default function AAVEPositionCard({
  debtToken,
  timelockAddress,
  governorAddress,
  helperAddress,
  tokens,
  contractAddress,
  coins,
}: AAVEPositionCardinterface) {
  const provider = useProvider();
  const [positionAAVE, setPositionAAVE] = useState<any[]>();
  const [modalView, setModalView] = useState<boolean>(false);
  const [callDatas, setCallDatas] = useState<string[]>();
  const [values, setValues] = useState<string[]>();
  const [targets, setTargets] = useState<string[]>();
  const [descriptionHash, setDescriptionHash] = useState<string>();

  const { data, isSuccess } = useContractRead({
    address: debtToken.token,
    abi: abi.abiDebt,
    functionName: "balanceOf",
    args: [timelockAddress],
  });

  const { data: dataUSDC, isSuccess: USDCIsSuccess } = useContractRead({
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    abi: abi.abiERC20,
    functionName: "balanceOf",
    args: [timelockAddress],
  });

  const { data: dataAUSDC, isSuccess: aUSDCIsSuccess } = useContractRead({
    address: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    abi: abi.abiERC20,
    functionName: "balanceOf",
    args: [timelockAddress],
  });

  const tokenInAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
  const borrowTokenAddress = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";

  const onGeretarePayloadClick = async () => {
    if (
      tokenInAddress !== undefined &&
      helperAddress !== undefined &&
      dataUSDC !== undefined &&
      dataAUSDC !== undefined &&
      dataUSDC !== null &&
      dataAUSDC !== null &&
      borrowTokenAddress !== undefined
    ) {
      loadData(
        tokenInAddress,
        helperAddress,
        borrowTokenAddress,
        dataUSDC.toString(),
        dataAUSDC.toString()
      ).then(() => setModalView(true));
    }
  };

  async function loadData(
    tokenInAddress: string,
    helperAddress: string,
    borrowTokenAddress: string,
    dataUSDC: string,
    dataAUSDC: string
  ) {
    const tokenIn = new ethers.Contract(
      tokenInAddress,
      abi.abiERC20,
      provider
    ) as ERC20;

    const helper = new ethers.Contract(
      helperAddress,
      abi.abiGovHelper,
      provider
    ) as GovHelper;

    const borrowToken = new ethers.Contract(
      borrowTokenAddress,
      abi.abiIWETH,
      provider
    ) as IWETH9;

    const slippageFinal = 100;
    const poolFeeFinal = 500;
    const interestRateModeFinal = 2;

    const priceFeedAddress = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612";

    const aaveAdrrProvider = new ethers.Contract(
      "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
      abi.abiIPoolAddressesProvider,
      provider
    );

    const aavePoolAddr = await aaveAdrrProvider.getPool();
    const pool = new ethers.Contract(aavePoolAddr, abi.abiPoolAAVE, provider);

    const result = await createProposeCloseNaturalPosition(
      tokenIn,
      helper,
      borrowToken,
      ethers.utils.parseUnits(dataUSDC.toString(), "6").toString(),
      priceFeedAddress,
      slippageFinal.toString(),
      poolFeeFinal.toString(),
      interestRateModeFinal.toString(),
      ethers.utils.parseUnits(dataAUSDC.toString(), "6").toString(),
      pool,
      timelockAddress
    );

    setCallDatas(result.callDatas);
    setValues(result.values);
    setTargets(result.targets);
    setDescriptionHash(result.descriptionHash);
  }

  createProposeCloseNaturalPosition;

  useEffect(() => {
    setPositionAAVE([data, debtToken.token, debtToken.symbol, debtToken.img]);
  }, [isSuccess]);

  const test = tokens.filter((token: any) => token.symbol === debtToken.symbol);

  return (
    <>
      {positionAAVE !== undefined &&
        data &&
        ethers.utils.formatUnits(positionAAVE[0].toString(), "18") !==
          "0.0" && (
          <div className="flex flex-row grid grid-cols-6 items-center text-center rounded-lg bg-beige px-4 py-4 mt-4 mx-14">
            {debtToken.symbol === "USDC" ? (
              <div className="bg-green-400 px-4 py-2 rounded-lg text-white font-semibold flex flex-row w-32">
                Long
                <ArrowUpRightIcon className="h-6 w-6 ml-4" />
              </div>
            ) : (
              <div className="bg-red-400 px-4 py-2 rounded-lg text-white font-semibold flex flex-row w-32">
                Short <ArrowDownRightIcon className="h-6 w-6 ml-4" />
              </div>
            )}
            <div>
              <div className="mx-10 flex flex-row items-center text-center">
                {Number(
                  ethers.utils.formatUnits(positionAAVE[0].toString(), "18")
                ).toFixed(4)}
                <Image
                  width={30}
                  height={30}
                  alt="Token Image"
                  src={positionAAVE[3].src}
                  className="mx-4"
                />
              </div>
            </div>
            {test.length !== 0 && (
              <div className="flex flex-col">
                <AAVEDisplayAPY
                  tokenAddress={test[0].token}
                  contractAddress={contractAddress}
                  coins={coins}
                />
              </div>
            )}
            <div>-</div>
            <div>-</div>
            <button
              className="border-2 border-black rounded-full py-2 px-4"
              onClick={() => onGeretarePayloadClick()}
            >
              Close Position
            </button>
            {modalView && (
              <ConfirmationModal
                governorAddress={governorAddress}
                display="aave"
                callDatas={callDatas}
                values={values}
                targets={targets}
                descriptionHash={descriptionHash}
              />
            )}
          </div>
        )}
    </>
  );
}
