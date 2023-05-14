import Image from "next/image";
import Link from "next/link";
import React from "react";
import usdcLogo from "../../../public/Logo.svg";

import { ConnectButtonWallet } from "../ConnectButtonWallet/ConnectButtonWallet";

export default function Navbar() {
  return (
    <div className="py-4 bg-almostBlack flex justify-between flex items-center px-10">
      <Link href="/">
        <Image width={200} height={200} alt="Logo Image" src={usdcLogo} />
      </Link>
      <ConnectButtonWallet />
    </div>
  );
}
