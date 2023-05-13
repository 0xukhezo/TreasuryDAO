import { ethers } from 'hardhat'
import { mineUpTo } from '@nomicfoundation/hardhat-network-helpers'
import { getExpectedContractAddress } from '../helpers/expected_contract';
import { Gov, Gov__factory, GovDeployer__factory, GovDeployer, GovToken, GovToken__factory, TimelockController, TimelockController__factory, GovFactory__factory, GovFactory } from "../typechain-types"

export module UtilsTest {

  export async function deployDaoTest() {
    const [deployer] = await ethers.getSigners()
    const { AddressZero } = ethers.constants

    //Token
    const tokenFactory: GovToken__factory = await ethers.getContractFactory("GovToken")
    const token: GovToken = await tokenFactory.deploy(process.env.DAO_TOKEN_NAME!, process.env.DAO_TOKEN_SYMBOL!)
    await token.deployed()

    await token.mint(deployer.address,ethers.utils.parseEther("100"))

    const govAddres = await getExpectedContractAddress(deployer, 1);

    //Timelock
    const timelockFactory: TimelockController__factory = await ethers.getContractFactory("TimelockController")
    const timelock: TimelockController = await timelockFactory.deploy(process.env.MIN_DELAY_TIMELOCK!, [govAddres], [govAddres], AddressZero)
    await timelock.deployed()

    //Gov
    const govFactory: Gov__factory = await ethers.getContractFactory('Gov')
    const gov: Gov = await govFactory.deploy(token.address, timelock.address, process.env.DAO_NAME!, process.env.INITIAL_VOTING_DELAY!, process.env.INITIAL_VOTING_PERIOD!, process.env.QUORUM!, process.env.INITIAL_PROPOSAL_THRESHOLD!)
    await gov.deployed()

    await token.connect(deployer).transferOwnership(timelock.address)

    return { gov, token, timelock }
  }

  export async function deployDaoFactory() {
    const [deployer] = await ethers.getSigners()
   
    //GovDeployer
    const govDeployerFactory: GovDeployer__factory = await ethers.getContractFactory("GovDeployer")
    const govDeployer: GovDeployer = await govDeployerFactory.deploy()
    await govDeployer.deployed()

    //GovFactory
    const govFactoryFactory: GovFactory__factory = await ethers.getContractFactory("GovFactory")
    const govFactory: GovFactory = await govFactoryFactory.deploy(govDeployer.address)

    return { govFactory }
  }

  export async function skipBlock(blocks: any) {
    const blockNumber = await ethers.provider.getBlockNumber()
    await mineUpTo(blockNumber + Number(blocks))
  }

}
