import React, { useState } from "react";
import TokensModal from "../Modal/TokensModal";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface TokenSelectorInterface {
  getTokenSelected: (token: boolean) => void;
  token?: any;
  stable?: any;
  token1?: any;
}

export default function TokenSelector({
  getTokenSelected,
  token,
  token1,
  stable,
}: TokenSelectorInterface) {
  const [openModal, setOpenModal] = useState(false);
  let img;

  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
  };

  if (token) {
    img = token[1][0].img as any;
  }

  return (
    <div className="flex items-center border-2 border-gray-500 rounded-2xl px-3 py-2 ">
      {openModal && (
        <TokensModal
          getOpenModal={getOpenModal}
          getTokenSelected={getTokenSelected}
          token1={token1}
          stable={stable}
        />
      )}
      <button onClick={() => setOpenModal(true)}>
        {token ? (
          <div className="flex items-center">
            <Image
              width={100}
              height={100}
              alt="Token Image"
              src={img.src}
              className="h-6 w-6 rounded-full"
            />
            <div className="ml-4">{token[1][0].symbol}</div>{" "}
            <ChevronDownIcon className="h-6 w-6 ml-6" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex items-center">
            <div>Select Token</div>
            <ChevronDownIcon className="h-6 w-6 ml-6" aria-hidden="true" />
          </div>
        )}
      </button>
    </div>
  );
}
