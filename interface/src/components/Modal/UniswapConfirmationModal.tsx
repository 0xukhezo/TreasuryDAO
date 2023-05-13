import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CreatePositionButton from "../Buttons/CreatePositionButton";
import Uniswap from "../../../public/Uniswap.svg";
import Image from "next/image";

export default function UniswapConfirmationModal() {
  const [open, setOpen] = useState(true);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-beigeLight px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center rounded-full">
                    <Image
                      width={100}
                      height={100}
                      alt="Chain Image"
                      src={Uniswap}
                      className="p-2"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-center font-semibold leading-6 text-gray-900 w-3/4 mx-auto"
                    >
                      Create a governance proposal to close this LP position
                    </Dialog.Title>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <CreatePositionButton />
                  <div className="mt-2 sm:mt-3">
                    <button
                      type="button"
                      className="px-4 py-1 rounded-full h-12 border-2 border-black mx-auto w-40"
                      onClick={() => setOpen(false)}
                    >
                      Go back
                    </button>
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
