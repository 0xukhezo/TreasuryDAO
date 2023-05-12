import Link from "next/link";
import React from "react";
import { ConnectButtonWallet } from "../ConnectButtonWallet/ConnectButtonWallet";

export default function Navbar() {
  return (
    <div className="py-2 bg-gray-500 flex justify-between pr-10 text-center">
      <Link href="/" className="ml-32 ">
        Daos{" "}
      </Link>
      <ConnectButtonWallet />
    </div>
  );
}
