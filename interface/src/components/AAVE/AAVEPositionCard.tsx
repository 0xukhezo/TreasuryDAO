import { ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/outline";

import abi from "../../../abi/abis.json";

import AAVEDisplayAPY from "./AAVEDisplayAPY";
import ConfirmationModal from "../Modal/ConfirmationModalInterface";

interface AAVEPositionCardinterface {
  debtToken: any;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
  tokens: any;
  contractAddress: any;
  coins: any;
}

export default function AAVEPositionCard({
  debtToken,
  timelockAddress,
  governorAddress,
  tokens,
  contractAddress,
  coins,
}: AAVEPositionCardinterface) {
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
            {debtToken.symbol !== "USDC" ? (
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
                {ethers.utils.formatUnits(positionAAVE[0].toString(), "18")}
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
            <div>1</div>
            <div>1</div>
            <button
              className="border-2 border-black rounded-full py-2 px-4"
              onClick={() => setModalView(true)}
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
