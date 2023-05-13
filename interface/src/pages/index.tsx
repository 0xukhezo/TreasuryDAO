import React, { useEffect, useState } from "react";
import Identicon from "identicon.js";
import Link from "next/link";
import Image from "next/image";

import PolygonChain from "../../public/PolygonChain.svg";

import { client, Daos } from "./api/Daos";
import ChainButtons from "@/components/Buttons/ChainButtons";
import { ethers } from "ethers";

export default function Home() {
  const [daos, setDaos] = useState<Object[]>();

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
    {
      gov: {
        id: "0x936139366c5db48543368ee9cd075267d176a02c",
        name: "APE DAO",
        proposals: "0",
        quorum: "34",
        proposalThreshold: "1000000000000000000",
        proposalsQueued: "0",
      },
      timelock: { id: "0x00b60986b613b953d6as14ea6ead2f93861b61bd" },
      token: {
        id: "0xc1c31b236d0dbff0760b7a9cbb935619f752f591",
      },
    },
  ];

  async function fetchDaos() {
    const queryBody = `query {
        daos {
          id
          gov {
            name
            id
            proposals
            quorum
            proposalThreshold
            proposalsQueued
            holders
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

      setDaos(response.data.daos);
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchDaos();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <ChainButtons />
        <div className="flex justify-between mx-20">
          <div className="flex">
            <span>Name</span>
          </div>
          <div className="flex">
            <span className="flex flex-col mx-10 font-extralight">Holder</span>
            <span className="flex flex-col mx-10 font-extralight">
              Proposals
            </span>
            <span className="flex flex-col mx-10 font-extralight">
              Threshold
            </span>
          </div>
          <div></div>
        </div>
        {daotest !== undefined &&
          daotest.map((dao: any, index: number) => {
            return (
              <Link
                href={`/${dao.gov.name}`}
                key={index}
                className="mx-8 my-2 px-10  rounded-lg bg-beige py-8 flex items-center justify-between "
              >
                <div className="flex items-center">
                  <Image
                    width={50}
                    height={50}
                    alt="Logo Image"
                    src={`data:image/png;base64,${new Identicon(
                      dao.timelock.id,
                      64
                    ).toString()}`}
                    className="rounded-full"
                  />
                  <div className="font-semibold ml-4">{dao.gov.name}</div>
                </div>
                <div className="grid grid-cols-3 mx-10 flex items-center text-center">
                  <div className="flex flex-col mx-16 font-extralight">
                    <span>{dao.gov.quorum}</span>
                  </div>

                  <div className="flex flex-col mx-16 font-extralight">
                    <span>
                      {ethers.utils.formatUnits(
                        dao.gov.proposalThreshold,
                        "18"
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col mx-16 font-extralight">
                    <span>{dao.gov.proposals}</span>
                  </div>
                </div>
                <div className="flex">
                  <Image
                    width={20}
                    height={20}
                    alt="Chain Image"
                    src={PolygonChain}
                  />
                  <span className="ml-4 font-semibold "> {dao.gov.name}</span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
