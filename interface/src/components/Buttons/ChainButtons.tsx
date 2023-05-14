import React from "react";
import Image from "next/image";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import PolygonChain from "../../../public/PolygonChain.svg";
import ArbitrumChain from "../../../public/ArbitrumChain.svg";
import OptimismChain from "../../../public/OptimismChain.svg";

export default function ChainButtons() {
  return (
    <div className="flex-col my-8">
      <h1 className="mx-10 mb-4">Explore DAOs</h1>
      <div className="flex justify-between ">
        <div className="mx-6 flex items-center">
          <button className="mx-2 bg-beige p-2 rounded-lg font-semibold">
            All DAOs
          </button>
          <button className="mx-2 flex items-center p-2 hover:bg-beige hover:rounded-lg">
            <Image
              width={20}
              height={20}
              alt="Chain Image"
              src={ArbitrumChain}
            />
            <span className="ml-2 font-semibold">Arbitrum</span>
          </button>
          <button className="mx-2 flex items-center p-2 hover:bg-beige hover:rounded-lg">
            <Image
              width={20}
              height={20}
              alt="Chain Image"
              src={PolygonChain}
            />
            <span className="ml-2 font-semibold">Polygon</span>
          </button>
          <button className="mx-2 flex items-center p-2 hover:bg-beige hover:rounded-lg">
            <Image
              width={20}
              height={20}
              alt="Chain Image"
              src={OptimismChain}
            />
            <span className="ml-2 font-semibold">Optimism</span>
          </button>
        </div>
        <div className="relative w-96 mx-8">
          <input
            placeholder="Search by name"
            className="border-2 border-beige rounded-lg w-full py-1 px-8"
          />
          <div className="absolute inset-y-0 left-2 flex items-center pr-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-beige" />
          </div>
        </div>
      </div>
    </div>
  );
}
