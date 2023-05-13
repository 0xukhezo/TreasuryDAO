import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { GovDeployer__factory, GovDeployer, GovFactory__factory, GovFactory, GovHelperDeployer, GovHelperDeployer__factory } from "../typechain-types"
import { DAOCreatedEventFilter, DAOCreatedEventObject, DAOCreatedEvent } from "../typechain-types/contracts/GovFactory"

async function main() {

    const hre: HardhatRuntimeEnvironment = await import('hardhat')

    const [deployer] = await ethers.getSigners()

    const govFactory: GovFactory = await ethers.getContractAt("GovFactory", "0x8c30fA625151Ea3719E54565af897E281932F110")

    const tx = await govFactory.deployDao(
        process.env.DAO_TOKEN_NAME!,
        process.env.DAO_TOKEN_SYMBOL!,
        process.env.MIN_DELAY_TIMELOCK!,
        process.env.DAO_NAME!,
        process.env.INITIAL_VOTING_DELAY!,
        process.env.INITIAL_VOTING_PERIOD!,
        process.env.QUORUM!,
        process.env.INITIAL_PROPOSAL_THRESHOLD!,
        process.env.DAO_TOKEN_AMOUNT_PREMINT!
    )

    

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
