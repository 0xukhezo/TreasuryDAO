import React, { useState, useEffect } from "react";
import TokenSelector from "../TokenSelector/TokenSelector";
import ethLogo from "../../../public/ic_ethereum.svg";
import FeeSelector from "@/components/FeeSelector/FeeSelector";
import { createProposeOpenNaturalPosition } from "../../../utils/aaveFunctions";
import abi from "../../../abi/abis.json";
import { useProvider } from "wagmi";
import { ERC20 } from "../../../types/ERC20";
import { GovHelper } from "../../../types/GovHelper";
import { IWETH9 } from "../../../types/IWETH";
import { ethers } from "ethers";
import AAVE from "../../../public/AAVE.svg";
import CreatePositionButton from "../Buttons/CreatePositionButton";
import Image from "next/image";

const fees = [10000, 3000, 1000, 500];

interface OpenAAVEPositionInterface {
  governorAddress: `0x${string}`;
  helperAddress: `0x${string}`;
  displayPositions: string;
}

export default function OpenAAVEPosition({
  governorAddress,
  helperAddress,
  displayPositions,
}: OpenAAVEPositionInterface) {
  const provider = useProvider();
  const [collateralTokenAddress, setCollateralTokenAddress] = useState([
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    [{ img: ethLogo, symbol: "ETH" }],
  ]);
  const [borrowTokenAddress, setBorrowTokenAddress] = useState();
  const [selectedFee, setSelectedFee] = useState<number>(10000);
  const [collateralAmount, setCollateralAmount] = useState<number>();
  const [borrowAmount, setBorrowAmount] = useState<number>();
  const [callDatas, setCallDatas] = useState<string[]>();
  const [values, setValues] = useState<string[]>();
  const [targets, setTargets] = useState<string[]>();
  const [descriptionHash, setDescriptionHash] = useState<string>();
  const [payload, setPayload] = useState<boolean>(false);
  const [isLong, setIsLong] = useState<boolean>(false);

  const getCollateralTokenAddressSelected = (token1: any) => {
    setCollateralTokenAddress(token1);
  };

  const getBorrowTokenAddressSelected = (token2: any) => {
    setBorrowTokenAddress(token2);
  };

  const getFeeSelected = (fee: number) => {
    setSelectedFee(fee);
  };

  const handleCollateralAmountChange = (val: string) => {
    setCollateralAmount(Number(val));
  };

  const handleBorrowAmountChange = (val: string) => {
    setBorrowAmount(Number(val));
  };

  const priceFeedAddress = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612";
  const variableDebtTokenAddress = "0x5E76E98E0963EcDC6A065d1435F84065b7523f39";

  const onGeretarePayloadClick = async () => {
    if (
      helperAddress !== undefined &&
      collateralTokenAddress !== undefined &&
      collateralAmount !== undefined &&
      borrowTokenAddress !== undefined &&
      borrowAmount !== undefined &&
      priceFeedAddress !== undefined &&
      selectedFee !== undefined &&
      variableDebtTokenAddress !== undefined
    ) {
      loadData(
        helperAddress,
        collateralTokenAddress[0].toString(),
        collateralAmount.toString(),
        borrowTokenAddress[0] as string,
        borrowAmount.toString(),
        priceFeedAddress,
        selectedFee.toString(),
        variableDebtTokenAddress
      ).then(() => setPayload(true));
    }
  };

  async function loadData(
    helperAddress: string,
    collateralTokenAddress: string,
    collateralAmount: string,
    borrowTokenAddress: string,
    borrowAmount: string,
    priceFeed: string,
    selectedFee: string,
    variableDebtTokenAddress: string
  ) {
    const helper = new ethers.Contract(
      helperAddress,
      abi.abiGovHelper,
      provider
    ) as GovHelper;

    const collateralToken = new ethers.Contract(
      collateralTokenAddress,
      abi.abiERC20,
      provider
    ) as ERC20;

    const borrowToken = new ethers.Contract(
      borrowTokenAddress,
      abi.abiIWETH,
      provider
    ) as IWETH9;

    const variableDebtToken = new ethers.Contract(
      variableDebtTokenAddress,
      abi.abiVariableDebtToken,
      provider
    );

    const slippageFinal = 100;
    const interestRateModeFinal = 2;

    const result = await createProposeOpenNaturalPosition(
      helper,
      collateralToken,
      ethers.utils.parseUnits(collateralAmount.toString(), "6").toString(),
      borrowToken,
      ethers.utils.parseUnits(borrowAmount.toString(), "18").toString(),
      interestRateModeFinal.toString(),
      priceFeed,
      slippageFinal.toString(),
      selectedFee.toString(),
      variableDebtToken
    );

    setCallDatas(result.callDatas);
    setValues(result.values);
    setTargets(result.targets);
    setDescriptionHash(result.descriptionHash);
  }

  useEffect(() => {
    if (
      borrowTokenAddress !== undefined &&
      collateralTokenAddress[1] === borrowTokenAddress[1]
    ) {
      setBorrowTokenAddress(undefined);
    }
  }, [collateralTokenAddress]);

  return (
    <div>
      <div className="mx-10 flex items-center flex-col">
        <h1 className="flex flex-row items-center text-2xl font-semibold">
          <Image
            width={40}
            height={40}
            alt="Chain Image"
            src={AAVE}
            className="p-2"
          />
          <span>Open position</span>
        </h1>
        <div className="flex">
          <div
            className={
              !isLong
                ? "flex justify-between w-full mt-4 flex-col mr-8 mb-10 bg-beige p-8 rounded-lg border-t-8 border-t-short"
                : "flex justify-between w-full mt-4 flex-col mr-8 mb-10 bg-beige p-8 rounded-lg border-t-8 border-t-long"
            }
          >
            <div className="grid grid-rows-3 grid-cols-2">
              <div>
                <h1 className="font-semibold text-lg mb-2">Position</h1>
                <div className="mr-8 font-bold bg-beigeLight p-1 rounded-lg">
                  <button
                    onClick={() => setIsLong(false)}
                    className={
                      !isLong
                        ? "w-1/2 bg-short p-2 rounded-lg text-white"
                        : "w-1/2 p-2 rounded-lg text-brown"
                    }
                  >
                    Short
                  </button>
                  <button
                    onClick={() => setIsLong(true)}
                    className={
                      isLong
                        ? "w-1/2 bg-long p-2 rounded-lg text-white"
                        : "w-1/2 p-2 rounded-lg text-brown"
                    }
                  >
                    Long
                  </button>
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-lg mb-2">Interes Rate</h1>
                <div className="flex flex-row mt-6">
                  <div className="flex items-center mr-6">
                    <input
                      id="default-radio-1"
                      type="radio"
                      value=""
                      disabled={true}
                      name="default-radio"
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 opacity-50"
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 opacity-50"
                    >
                      Fixed
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      checked
                      id="default-radio-2"
                      type="radio"
                      value=""
                      name="default-radio"
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Variable
                    </label>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <h1 className="font-semibold text-lg mb-2">Collateral</h1>
                <div className="flex flex-row mb-2">
                  <TokenSelector
                    getTokenSelected={getCollateralTokenAddressSelected}
                    token={collateralTokenAddress}
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <input
                  value={collateralAmount}
                  onChange={(e) => handleCollateralAmountChange(e.target.value)}
                  onFocus={(e) =>
                    e.target.addEventListener(
                      "wheel",
                      function (e) {
                        e.preventDefault();
                      },
                      { passive: false }
                    )
                  }
                  step="any"
                  type="number"
                  name="token1Amount"
                  id="token1Amount"
                  autoComplete="family-name"
                  className="bg-beigeLight font-light px-4 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="my-2">
                <h1 className="font-semibold text-lg mb-2">Asset to Short</h1>
                <div className="flex flex-row">
                  <TokenSelector
                    getTokenSelected={getBorrowTokenAddressSelected}
                    token={borrowTokenAddress}
                    token1={collateralTokenAddress}
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <input
                  value={borrowAmount}
                  onChange={(e) => handleBorrowAmountChange(e.target.value)}
                  onFocus={(e) =>
                    e.target.addEventListener(
                      "wheel",
                      function (e) {
                        e.preventDefault();
                      },
                      { passive: false }
                    )
                  }
                  step="any"
                  type="number"
                  name="token2Amount"
                  id="token2Amount"
                  autoComplete="family-name"
                  className="bg-beigeLight font-light px-4 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <h1 className="font-semibold text-lg my-2">
                Uniswap pool to swap
              </h1>
              <div className="flex flex-row col-span-2 mt-2">
                {fees.map((fee, index: number) => {
                  return (
                    <div key={index}>
                      <FeeSelector
                        getFeeSelected={getFeeSelected}
                        fee={fee}
                        selectedFee={selectedFee}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12">
          {collateralTokenAddress !== undefined &&
          borrowTokenAddress !== undefined &&
          collateralAmount !== undefined &&
          selectedFee !== undefined &&
          borrowAmount !== undefined &&
          governorAddress !== undefined ? (
            payload ? (
              <CreatePositionButton
                callDatas={callDatas}
                values={values}
                targets={targets}
                descriptionHash={descriptionHash}
                governorAddress={governorAddress}
              />
            ) : (
              <div className="mt-4 flex justify-center ">
                <button
                  onClick={() => onGeretarePayloadClick()}
                  className="border-2 border-grey-500 px-4 py-2 rounded-full h-12 bg-black text-white"
                >
                  Create governace proposal
                </button>
              </div>
            )
          ) : (
            <div className="mt-4 flex justify-center ">
              <div className="border-2 border-black px-4 py-2 rounded-full h-12 text-black opacity-25">
                Create governace proposal
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
