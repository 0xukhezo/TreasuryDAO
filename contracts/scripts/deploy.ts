import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { GovDeployer__factory, GovDeployer, GovFactory__factory, GovFactory } from "../typechain-types"
import { DAOCreatedEventFilter, DAOCreatedEventObject, DAOCreatedEvent } from "../typechain-types/contracts/GovFactory"



async function main() {

  const hre: HardhatRuntimeEnvironment = await import('hardhat')

  const [deployer] = await ethers.getSigners()

  //GovDeployer
  const govDeployerFactory: GovDeployer__factory = await ethers.getContractFactory("GovDeployer")
  const govDeployer: GovDeployer = await govDeployerFactory.deploy()
  await govDeployer.deployed()

  //Factory
  const govFactoryFactory: GovFactory__factory = await ethers.getContractFactory("GovFactory")
  const govFactory: GovFactory = await govFactoryFactory.deploy(govDeployer.address)
  await govFactory.deployed()

  console.log(`GovFactory deployed in: ${govFactory.address}`)


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

  await tx.wait(1)

  const filter: DAOCreatedEventFilter = await govFactory.filters.DAOCreated(deployer.address)
  const logs: Array<any> = await govFactory.queryFilter(filter)
  const event: DAOCreatedEventObject = logs[0].args

  console.log(`Dao deployed in: ${await govFactory.getDaos()}`)

  //Verify
  await hre.run("verify:verify", {
    address: govFactory.address,
    constructorArguments: [
      govDeployer.address
    ]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
