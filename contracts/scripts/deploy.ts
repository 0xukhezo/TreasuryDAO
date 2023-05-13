import { ethers } from "hardhat";
import { ParaSwapDebtSwapAdapterV3__factory, ParaSwapDebtSwapAdapterV3 } from "../typechain-types"

const addressesProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"
const pool = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"
const augustusRegistry = "0xdC6E2b14260F972ad4e5a31c68294Fba7E720701"

async function main() {

  const [deployer] = await ethers.getSigners()

  const paraSwapFactory: ParaSwapDebtSwapAdapterV3__factory = await ethers.getContractFactory("ParaSwapDebtSwapAdapterV3");
  const paraSwap: ParaSwapDebtSwapAdapterV3 = await paraSwapFactory.deploy( addressesProvider, pool, augustusRegistry, deployer.address)
  await paraSwap.deployed()

  console.log(paraSwap.address)



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
