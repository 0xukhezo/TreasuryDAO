import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { GovDeployer__factory, GovDeployer, GovFactory__factory, GovFactory, GovHelperDeployer, GovHelperDeployer__factory } from "../typechain-types"
import { DAOCreatedEventFilter, DAOCreatedEventObject, DAOCreatedEvent } from "../typechain-types/contracts/GovFactory"

//Arbitrum
const poolAddressProviderAddr = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"
const swapRouterAddr = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
const oracleUsdcUsd = "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3"

async function main() {

  const hre: HardhatRuntimeEnvironment = await import('hardhat')

  const [deployer] = await ethers.getSigners()

  //GovDeployer
  const govDeployerFactory: GovDeployer__factory = await ethers.getContractFactory("GovDeployer")
  const govDeployer: GovDeployer = await govDeployerFactory.deploy()
  await govDeployer.deployed()

  //GovHelperDeployer
  const govHelperDeployerFactory: GovHelperDeployer__factory = await ethers.getContractFactory("GovHelperDeployer")
  const govHelperDeployer: GovHelperDeployer = await govHelperDeployerFactory.deploy(poolAddressProviderAddr,swapRouterAddr,oracleUsdcUsd)
  await govHelperDeployer.deployed()

  //Factory
  const govFactoryFactory: GovFactory__factory = await ethers.getContractFactory("GovFactory")
  const govFactory: GovFactory = await govFactoryFactory.deploy(govDeployer.address, govHelperDeployer.address)
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
