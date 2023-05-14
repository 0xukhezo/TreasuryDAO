import React from "react";

interface FeeSelectorInterface {
  getFeeSelected: (fee: number) => void;
  fee: number;
  selectedFee: number | undefined;
}

function FeeSelector({
  getFeeSelected,
  fee,
  selectedFee,
}: FeeSelectorInterface) {
  return (
    <button
      onClick={() => getFeeSelected(fee)}
      className={
        fee === selectedFee
          ? "border-2 border-black px-4 py-2 rounded-lg mr-4"
          : "border-2 border-black px-4 py-2 rounded-lg mr-4 opacity-20"
      }
    >
      {fee / 10000}
      <span className="ml-2">%</span>
    </button>
  );
}

export default FeeSelector;
