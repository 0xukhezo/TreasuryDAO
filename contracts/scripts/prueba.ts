import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { INonfungiblePositionManager } from "../typechain-types"

async function main() {

    const nonFungiblePositionManager: INonfungiblePositionManager = await ethers.getContractAt(
        'INonfungiblePositionManager',
        "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
      )

      const filter = nonFungiblePositionManager.filters.Transfer(
        null,
        "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        null
      );
  
      const logs: Array<any> = await nonFungiblePositionManager.queryFilter(
        filter
      );

    console.log(logs)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
