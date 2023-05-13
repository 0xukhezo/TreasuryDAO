import React, { useEffect, useState } from "react";
import Link from "next/link";

import { client, Daos } from "./api/Daos";

export default function Home() {
  const [daos, setDaos] = useState<Object[]>();
  const daotest = [
    {
      gov: {
        id: "0x936139366c5db48543368ee9cd075267d176a02c",
        name: "London DAO",
      },
      timelock: { id: "0x00b60986b613b953d6da14ea6ead2f93861b61bd" },
    },
  ];

  async function fetchDaos() {
    const queryBody = `query {
      daos {
        id
        gov {
          id
          name
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
      <div className="flex">
        {daotest !== undefined &&
          daotest.map((dao: any, index: number) => {
            return (
              <Link
                href={`/${dao.gov.name}`}
                key={index}
                className="border-2 border-gray-400 m-8 px-4 py-2 hover:bg-gray-300 rounded-lg bg-gray-50"
              >
                <div>{dao.gov.name}</div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
