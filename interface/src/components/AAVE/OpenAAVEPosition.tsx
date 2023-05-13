import React, { useState, useEffect } from "react";
import TokenSelector from "../TokenSelector/TokenSelector";
import ethLogo from "../../../public/ic_ethereum.svg";
import FeeSelector from "@/components/FeeSelector/FeeSelector";
import createProposalOpenPositionUniswap from "../../../utils/uniswapFunctions";
import abi from "../../../abi/abis.json";
import { useProvider } from "wagmi";
import { ERC20 } from "../../../types/ERC20";
import { INonfungiblePositionManager } from "../../../types/INonfungiblePositionManager";
import { ethers } from "ethers";
import AAVE from "../../../public/AAVE.svg";
import CreatePositionButton from "../Buttons/CreatePositionButton";
import Image from "next/image";

const fees = [10000, 3000, 1000, 500];

interface OpenAAVEPositionInterface {
  governorAddress: `0x${string}`;
  displayPositions: string;
}

export default function OpenAAVEPosition({
  governorAddress,
  displayPositions,
}: OpenAAVEPositionInterface) {
  const provider = useProvider();
  const [token1, setToken1] = useState([
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    [{ img: ethLogo, symbol: "ETH" }],
  ]);
  const [token2, setToken2] = useState();
  const [selectedFee, setSelectedFee] = useState<number>(10000);
  const [token1Amount, setToken1Amount] = useState<number>();
  const [token2Amount, setToken2Amount] = useState<number>();
  const [callDatas, setCallDatas] = useState<string[]>();
  const [values, setValues] = useState<string[]>();
  const [targets, setTargets] = useState<string[]>();
  const [descriptionHash, setDescriptionHash] = useState<string>();
  const [payload, setPayload] = useState<boolean>(false);

  const [isLong, setIsLong] = useState<boolean>(false);

  const nonFungiblePositionManagerAddr =
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  const getToken1Selected = (token1: any) => {
    setToken1(token1);
  };

  const getToken2Selected = (token2: any) => {
    setToken2(token2);
  };

  const getFeeSelected = (fee: number) => {
    setSelectedFee(fee);
  };

  const handleToken1AmountChange = (val: string) => {
    setToken1Amount(Number(val));
  };

  const handleToken2AmountChange = (val: string) => {
    setToken2Amount(Number(val));
  };

  const onGeretarePayloadClick = async () => {
    if (
      token1 !== undefined &&
      token2 !== undefined &&
      selectedFee !== undefined &&
      token1Amount !== undefined &&
      token2Amount !== undefined &&
      token1Amount > 0 &&
      token2Amount > 0
    ) {
      const token1Address = token1[0] as string;
      const token2Address = token2[0] as string;
      const compareTokens =
        token1Address
          .toLowerCase()
          .localeCompare(token2Address.toLocaleLowerCase()) == 1;

      loadData(
        selectedFee,
        minToken1Amount,
        minToken2Amount,
        token1Address,
        token2Address,
        token1Amount,
        token2Amount,
        compareTokens
      ).then(() => setPayload(true));
    }
  };

  async function loadData(
    selectedFee: number,
    minToken1Amount: number,
    minToken2Amount: number,
    token1: string,
    token2: string,
    lowerTick: number,
    token1Amount: number,
    upperTick: number,
    token2Amount: number,
    compareTokens: boolean
  ) {
    const nonFungiblePositionManager = new ethers.Contract(
      nonFungiblePositionManagerAddr,
      abi.abiINonfungiblePositionManager,
      provider
    ) as INonfungiblePositionManager;

    const token1ERC20 = new ethers.Contract(
      compareTokens ? token2 : token1,
      abi.abiERC20,
      provider
    ) as ERC20;
    const token2ERC20 = new ethers.Contract(
      compareTokens ? token1 : token2,
      abi.abiERC20,
      provider
    ) as ERC20;

    const decimalToken1 = await token1ERC20.decimals();
    const decimalToken2 = await token2ERC20.decimals();

    const finalToken1Amount = ethers.utils.parseUnits(
      token1Amount.toString(),
      compareTokens ? decimalToken2.toString() : decimalToken1.toString()
    );
    const finalToken2Amount = ethers.utils.parseUnits(
      token2Amount.toString(),
      compareTokens ? decimalToken1.toString() : decimalToken2.toString()
    );

    const minimalToken1Amount = ethers.utils.parseUnits(
      minToken1Amount.toString(),
      compareTokens ? decimalToken1.toString() : decimalToken2.toString()
    );
    const minimalToken2Amount = ethers.utils.parseUnits(
      minToken2Amount.toString(),
      compareTokens ? decimalToken2.toString() : decimalToken1.toString()
    );

    const title = "Open a pool position in Uniswap";
    const result = await createProposalOpenPositionUniswap(
      minimalToken1Amount.toString(),
      minimalToken2Amount.toString(),
      selectedFee.toString(),
      token1ERC20,
      finalToken1Amount,
      token2ERC20,
      finalToken2Amount,
      nonFungiblePositionManager,
      finalLowerTick,
      finalUpperTick,
      title,
      "Open a pool position in Uniswap with token1 and token2"
    );

    setCallDatas(result.callDatas);
    setValues(result.values);
    setTargets(result.targets);
    setDescriptionHash(result.descriptionHash);
  }

  useEffect(() => {
    if (token2 !== undefined && token1[1] === token2[1]) {
      setToken2(undefined);
    }
  }, [token1]);

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
                    getTokenSelected={getToken1Selected}
                    token={token1}
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <input
                  value={token1Amount}
                  onChange={(e) => handleToken1AmountChange(e.target.value)}
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
                <h1 className="font-semibold text-lg mb-2">Collateral</h1>
                <div className="flex flex-row">
                  <TokenSelector
                    getTokenSelected={getToken2Selected}
                    token={token2}
                    token1={token1}
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <input
                  value={token2Amount}
                  onChange={(e) => handleToken2AmountChange(e.target.value)}
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
          {token1 !== undefined &&
          token2 !== undefined &&
          token1Amount !== undefined &&
          selectedFee !== undefined &&
          token2Amount !== undefined &&
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
