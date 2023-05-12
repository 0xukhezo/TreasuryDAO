import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import { BarsArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { client, Daos } from "./api/Daos";
import UniswapPanel from "@/components/Uniswap/UniswapPanel";
import DaoInfoPanel from "@/components/Dao/DaoInfoPanel";
import GMXLateralBarButtons from "@/components/Buttons/GMXLateralBarButtons";
import UniswapLateralBarButtons from "@/components/Buttons/UniswapLateralBarButtons";
import AAVELateralBarbuttons from "@/components/Buttons/AAVELateralBarbuttons";
import AAVEPanel from "@/components/AAVE/AAVEPanel";

export default function Dao() {
  const router = useRouter();
  const { chain } = useNetwork();

  const [timelockAddress, setTimelockAddress] = useState<`0x${string}`>();
  const [governorAddress, setGovernorAddress] = useState<`0x${string}`>();
  const [displayType, setDisplayType] = useState<string>("daoInfo");
  const [lateralOpen, setLateralOpen] = useState<boolean>(true);
  const [dao, setDao] = useState<any>();

  async function fetchDao(daoName: string) {
    // const queryBody = `query {
    //     daos(where: {gov_: {name: "${daoName}"}}) {
    //       id
    //       gov {
    //         name
    //         id
    //         proposals
    //         quorum
    //         proposalThreshold
    //         proposalsQueued
    //       }
    //       timelock {
    //         id
    //       }
    //       token {
    //         id
    //       }
    //     }
    //   }`;

    try {
      // let response = await client.query({ query: Daos(queryBody) });
      const daotest = [
        {
          gov: {
            id: "0x936139366c5db48543368ee9cd075267d176a02c",
            name: "London DAO",
            proposals: "0",
            quorum: "51",
            proposalThreshold: "1000000000000000000",
            proposalsQueued: "0",
          },
          timelock: { id: "0x00b60986b613b953d6da14ea6ead2f93861b61bd" },
          token: {
            id: "0xc1c31b236d0dbff0760b7a9cbb935619f752f591",
          },
        },
      ];
      setTimelockAddress(daotest[0].timelock.id as `0x${string}`);
      setGovernorAddress(daotest[0].gov.id as `0x${string}`);
      setDao(daotest[0]);

      // setTimelockAddress(response.data.daos[0].timelock.id);
      // setGovernorAddress(response.data.daos[0].gov.id);
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

  return (
    <div className="flex ">
      {lateralOpen && (
        <div className="w-1/5 flex flex-col border-r-2 border-r-black h-screen bg-gray-500">
          <button
            onClick={() => setLateralOpen(false)}
            className="my-4 flex flex-row justify-end mr-6"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-col items-center">
            <button
              onClick={() => setDisplay("daoInfo")}
              className="w-1/2 py-2 border-2 border-black rounded-xl items-center"
            >
              DAO info
            </button>
          </div>
          <div className="flex flex-col items-center">
            <AAVELateralBarbuttons setDisplay={setDisplay} />
            <UniswapLateralBarButtons setDisplay={setDisplay} />
          </div>
        </div>
      )}
      <div className={lateralOpen ? "w-4/5 " : "w-full"}>
        {!lateralOpen && (
          <button onClick={() => setLateralOpen(true)}>
            <BarsArrowDownIcon
              className="h-10 w-10 -rotate-90"
              aria-hidden="true"
            />
          </button>
        )}
        {displayType === "daoInfo" ? (
          <DaoInfoPanel dao={dao} />
        ) : timelockAddress &&
          governorAddress &&
          (displayType === "aavePositions" ||
            displayType === "aaveOpenPosition") ? (
          timelockAddress &&
          governorAddress && (
            <AAVEPanel
              display={displayType}
              timelockAddress={timelockAddress}
              governorAddress={governorAddress}
            />
          )
        ) : (
          timelockAddress &&
          governorAddress && (
            <UniswapPanel
              display={displayType}
              timelockAddress={timelockAddress}
              governorAddress={governorAddress}
            />
          )
        )}
      </div>
    </div>
  );
}
