import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { GovDeployer__factory, GovToken, GovDeployer, GovFactory__factory, GovFactory, GovHelperDeployer, GovHelperDeployer__factory } from "../typechain-types"

async function main() {

    const hre: HardhatRuntimeEnvironment = await import('hardhat')

    const [deployer] = await ethers.getSigners()

    const token: GovToken = await ethers.getContractAt("GovToken", "0x484264a03bbb1fe22e13ad10ad500e381894307c")

     //Delegate votes
     await token.connect(deployer).delegate(deployer.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
