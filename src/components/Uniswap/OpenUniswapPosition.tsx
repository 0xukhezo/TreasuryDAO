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
import {
  TickMath,
  encodeSqrtRatioX96,
  nearestUsableTick,
} from "@uniswap/v3-sdk";
import CreatePositionButton from "../Buttons/CreatePositionButton";

const fees = [10000, 3000, 1000, 500];

interface OpenUniswapPositionInterface {
  governorAddress: `0x${string}`;
}

export default function OpenUniswapPosition({
  governorAddress,
}: OpenUniswapPositionInterface) {
  const provider = useProvider();
  const [token1, setToken1] = useState([
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    [{ img: ethLogo, symbol: "ETH" }],
  ]);
  const [token2, setToken2] = useState();
  const [selectedFee, setSelectedFee] = useState<number>();
  const [lowerTick, setLowerTick] = useState<number>();
  const [upperTick, setUpperTick] = useState<number>();
  const [minToken1Amount, setMinToken1Amount] = useState<number>();
  const [minToken2Amount, setMinToken2Amount] = useState<number>();
  const [token1Amount, setToken1Amount] = useState<number>();
  const [token2Amount, setToken2Amount] = useState<number>();
  const [callDatas, setCallDatas] = useState<string[]>();
  const [values, setValues] = useState<string[]>();
  const [targets, setTargets] = useState<string[]>();
  const [descriptionHash, setDescriptionHash] = useState<string>();
  const [payload, setPayload] = useState<boolean>(false);

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

  const handleLowerTickChange = (val: string) => {
    setLowerTick(Number(val));
  };

  const handleUpperTickChange = (val: string) => {
    setUpperTick(Number(val));
  };

  const handleToken1AmountChange = (val: string) => {
    setToken1Amount(Number(val));
  };

  const handleToken2AmountChange = (val: string) => {
    setToken2Amount(Number(val));
  };

  const handleMinToken1AmountChange = (val: string) => {
    setMinToken1Amount(Number(val));
  };

  const handleMinToken2AmountChange = (val: string) => {
    setMinToken2Amount(Number(val));
  };

  const onGeretarePayloadClick = async () => {
    if (
      token1 !== undefined &&
      token2 !== undefined &&
      minToken1Amount !== undefined &&
      minToken2Amount !== undefined &&
      minToken1Amount > 0 &&
      minToken2Amount > 0 &&
      lowerTick !== undefined &&
      upperTick !== undefined &&
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
        lowerTick,
        token1Amount,
        upperTick,
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

    const tickLower = nearestUsableTick(
      TickMath.getTickAtSqrtRatio(
        encodeSqrtRatioX96(
          ethers.utils.parseUnits(lowerTick.toString(), "6").toString(),
          ethers.utils.parseEther("1").toString()
        )
      ),
      10
    );
    const tickUpper = nearestUsableTick(
      TickMath.getTickAtSqrtRatio(
        encodeSqrtRatioX96(
          ethers.utils.parseUnits(upperTick.toString(), "6").toString(),
          ethers.utils.parseEther("1").toString()
        )
      ),
      10
    );

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

    const finalUpperTick = compareTokens ? tickUpper : tickLower;

    const finalLowerTick = compareTokens ? tickLower : tickUpper;

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
    <div className="mx-10">
      <div className="flex justify-between w-full mt-10">
        <TokenSelector getTokenSelected={getToken1Selected} token={token1} />
        <TokenSelector
          getTokenSelected={getToken2Selected}
          token={token2}
          token1={token1}
        />
      </div>
      <div className="flex mt-2 w-full">
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
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="lowerTick"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upper tick price
          </label>
          <div className="mt-2">
            <input
              value={lowerTick}
              onChange={(e) => handleLowerTickChange(e.target.value)}
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
              name="lowerTick"
              id="lowerTick"
              autoComplete="family-name"
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="upperTick"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Lower tick price
          </label>
          <div className="mt-2">
            <input
              value={upperTick}
              onChange={(e) => handleUpperTickChange(e.target.value)}
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
              name="upperTick"
              id="upperTick"
              autoComplete="family-name"
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="token1Amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Amount
          </label>
          <div className="mt-2">
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
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="token2Amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Amount
          </label>
          <div className="mt-2">
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
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="minToken1Amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Minimal amount of token1
          </label>
          <div className="mt-2">
            <input
              value={minToken1Amount}
              onChange={(e) => handleMinToken1AmountChange(e.target.value)}
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
              name="minToken1Amount"
              id="minToken1Amount"
              autoComplete="family-name"
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="minToken2Amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Minimal amount of token2
          </label>
          <div className="mt-2">
            <input
              value={minToken2Amount}
              onChange={(e) => handleMinToken2AmountChange(e.target.value)}
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
              name="minToken2Amount"
              id="minToken2Amount"
              autoComplete="family-name"
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          {token1 !== undefined &&
          token2 !== undefined &&
          minToken1Amount !== undefined &&
          minToken2Amount !== undefined &&
          lowerTick !== undefined &&
          token1Amount !== undefined &&
          upperTick !== undefined &&
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
              <div className="mt-10 flex justify-center ">
                <button
                  onClick={() => onGeretarePayloadClick()}
                  className="border-2 border-grey-500 px-4 py-2 rounded-full hover:bg-green-100 h-12 bg-green-50"
                >
                  Generate Payload
                </button>
              </div>
            )
          ) : (
            <div className="mt-10 flex justify-center ">
              <div className="border-2 border-grey-500 px-4 py-2 rounded-full hover:bg-green-100 h-12 bg-green-50 opacity-25">
                Generate Payload
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
