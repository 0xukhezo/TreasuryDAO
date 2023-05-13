import React, { useState, useEffect } from "react";
import Identicon from "identicon.js";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import ArbitrumChain from "../../public/ArbitrumChain.svg";
import Uniswap from "../../public/Uniswap.svg";
import AAVE from "../../public/AAVE.svg";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { client, Daos } from "./api/Daos";
import UniswapPanel from "@/components/Uniswap/UniswapPanel";

import AAVEPanel from "@/components/AAVE/AAVEPanel";
import Image from "next/image";
import Link from "next/link";

export default function Dao() {
  const router = useRouter();

  const [timelockAddress, setTimelockAddress] = useState<`0x${string}`>();
  const [governorAddress, setGovernorAddress] = useState<`0x${string}`>();
  const [displayType, setDisplayType] = useState<string>("daoInfo");
  const [dao, setDao] = useState<any>();

  async function fetchDao(daoName: string) {
    const queryBody = `query {
        daos(where: {gov_: {name: "${daoName}"}}) {
          id
          gov {
            name
            id
            proposals
            quorum
            proposalThreshold
            proposalsQueued
          }
          timelock {
            id
          }
          token {
            id
          }
        }
      }`;

    try {
      let response = await client.query({ query: Daos(queryBody) });

      setTimelockAddress(response.data.daos[0].timelock.id);
      setGovernorAddress(response.data.daos[0].gov.id);
      setDao(response.data.daos[0]);
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchDao(router.query.dao as string);
  }, []);

  const setDisplay = (type: string) => {
    setDisplayType(type);
  };

  const getDisplay = (type: string) => {
    setDisplayType(type);
  };

  return (
    <div className="flex mt-6 flex-col">
      {dao && (
        <div className="flex flex-col w-screen">
          {displayType === "uniswapPositions" && (
            <div className="flex items-center text-center ml-14">
              <Link href={`/`} onClick={() => setDisplay("daoInfo")}>
                Home{" "}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Link
                href={`/${dao.gov.name}`}
                onClick={() => setDisplay("daoInfo")}
              >
                {dao.gov.name}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Image width={20} height={20} alt="Chain Image" src={Uniswap} />

              <span className="font-semibold mt-1 mx-2">Uniswap Positions</span>
            </div>
          )}
          {displayType === "uniswapPositionsOpen" && (
            <div className="flex items-center text-center ml-14">
              <Link href={`/`} onClick={() => setDisplay("daoInfo")}>
                Home{" "}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Link
                href={`/${dao.gov.name}`}
                onClick={() => setDisplay("daoInfo")}
              >
                {dao.gov.name}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Image width={20} height={20} alt="Chain Image" src={Uniswap} />
              <button
                onClick={() => setDisplayType("uniswapPositions")}
                className="mx-2"
              >
                Uniswap Positions
              </button>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <span className="font-semibold mx-2">Open LP position</span>
            </div>
          )}
          {displayType === "aavePositions" && (
            <div className="flex items-center text-center ml-14">
              <Link href={`/`} onClick={() => setDisplay("daoInfo")}>
                Home{" "}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Link
                href={`/${dao.gov.name}`}
                onClick={() => setDisplay("daoInfo")}
              >
                {dao.gov.name}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Image width={15} height={15} alt="Chain Image" src={AAVE} />
              <span className="font-semibold mt-1 mx-2">AAVE Positions</span>
            </div>
          )}
          {displayType === "aavePositionsOpen" && (
            <div className="flex items-center text-center ml-14">
              <Link href={`/`} onClick={() => setDisplay("daoInfo")}>
                Home{" "}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Link
                href={`/${dao.gov.name}`}
                onClick={() => setDisplay("daoInfo")}
              >
                {dao.gov.name}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <Image width={15} height={15} alt="Chain Image" src={AAVE} />
              <button
                onClick={() => setDisplayType("aavePositions")}
                className="mx-2"
              >
                AAVE Positions
              </button>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <span className="font-semibold mx-2">Open position</span>
            </div>
          )}
          {displayType === "daoInfo" && (
            <div className="flex items-center text-center ml-14">
              <Link href={`/`} onClick={() => setDisplay("daoInfo")}>
                Home{" "}
              </Link>
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <span className="font-semibold ">{dao.gov.name}</span>
            </div>
          )}

          <div className="flex items-center mt-8 justify-between mr-14">
            <div className="flex items-center ml-14">
              <Image
                width={50}
                height={50}
                alt="Logo Image"
                src={`data:image/png;base64,${new Identicon(
                  dao.timelock.id,
                  64
                ).toString()}`}
                className="rounded-full "
              />
              <h1 className="font-semibold ml-6 text-2xl ml-14">
                {dao.gov.name}
              </h1>
            </div>
            <div className="flex items-center">
              <Image
                width={20}
                height={20}
                alt="Chain Image"
                src={ArbitrumChain}
              />
              <span className="ml-4 font-semibold">Arbitrum</span>{" "}
            </div>
          </div>
          <div className="mt-4 font-light ml-14">
            This is a {dao.gov.name} that fully controls {dao.gov.name} and it's
            on-chain treasury.
          </div>
        </div>
      )}
      {displayType === "daoInfo" ? (
        <div className="flex items-center flex-col justify-center mt-10 h-96 bg-beige mx-14 rounded-lg font-bold text-xl">
          <h1 className="mb-4">View positions in</h1>
          <div className="flex text-center">
            <button
              className="px-4 py-2 bg-beigeLight mx-2 rounded-lg w-36 flex items-center flex-col"
              onClick={() => setDisplay("uniswapPositions")}
            >
              <Image
                width={100}
                height={100}
                alt="Chain Image"
                src={Uniswap}
                className="p-2"
              />{" "}
              <span className="mt-2">Uniswap</span>
            </button>
            <button
              className="px-4 py-2 bg-beigeLight mx-2 rounded-lg w-36 flex items-center flex-col"
              onClick={() => setDisplay("aavePositions")}
            >
              <Image
                width={80}
                height={80}
                alt="Chain Image"
                src={AAVE}
                className="p-2"
              />{" "}
              <span className="mt-2">AAVE</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={"w-full"}>
          {timelockAddress && governorAddress && displayType === "aavePositions"
            ? timelockAddress &&
              governorAddress && (
                <AAVEPanel
                  display={displayType}
                  timelockAddress={timelockAddress}
                  governorAddress={governorAddress}
                  getDisplay={getDisplay}
                />
              )
            : timelockAddress &&
              governorAddress &&
              (displayType === "uniswapPositions" ||
                displayType === "uniswapPositionsOpen") && (
                <UniswapPanel
                  display={displayType}
                  timelockAddress={timelockAddress}
                  governorAddress={governorAddress}
                  getDisplay={getDisplay}
                />
              )}
        </div>
      )}
      {displayType === "aavePositionsOpen" &&
        timelockAddress &&
        governorAddress && (
          <AAVEPanel
            display={displayType}
            timelockAddress={timelockAddress}
            governorAddress={governorAddress}
            getDisplay={getDisplay}
          />
        )}
    </div>
  );
}
