import React from "react";
import Image from "next/image";

interface TokenCardInterface {
  token: any;
}

export default function TokenCard({ token }: TokenCardInterface) {
  const img = token[1][0].img as any;
  return (
    <div className="flex items-center">
      <Image
        width={100}
        height={100}
        alt="Token Image"
        src={img.src}
        className="h-12 w-12 border-2 border-blue-500 rounded-full p-1"
      />
      <div className="ml-4">{token[1][0].symbol}</div>
    </div>
  );
}
