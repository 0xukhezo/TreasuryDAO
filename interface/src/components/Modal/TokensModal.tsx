import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TokenCard from "../Uniswap/TokenCard";
import coinData from "../../../utils/tokens";

interface TokensModalInterface {
  getOpenModal: (openmodal: boolean) => void;
  getTokenSelected: (token: boolean) => void;
  token1?: any;
  stable?: any;
}

export default function TokensModal({
  getOpenModal,
  getTokenSelected,
  token1,
  stable,
}: TokensModalInterface) {
  const [open, setOpen] = useState(true);
  let tokens = Object.entries(coinData);

  const closeModal = (token?: any) => {
    if (token) {
      getTokenSelected(token);
    }
    setOpen(false);
    getOpenModal(false);
  };

  if (token1) {
    tokens = Object.entries(coinData).filter((token) => {
      return token[0] !== token1[0];
    });
  }

  if (stable === "stable") {
    tokens = Object.entries(coinData).filter((token) => {
      return token[0] === "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
    });
  }

  if (stable === "noStable") {
    tokens = Object.entries(coinData).filter((token) => {
      return token[0] !== "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
    });
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start w-full">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Select a token
                    </Dialog.Title>
                    <div className="mt-2 overflow-auto h-66">
                      {tokens.map((token: any, index: number) => {
                        return (
                          <button
                            key={index}
                            onClick={() => closeModal(token)}
                            className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg "
                          >
                            <TokenCard token={token} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
