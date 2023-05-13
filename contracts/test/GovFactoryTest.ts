import { loadFixture, mine, mineUpTo } from '@nomicfoundation/hardhat-network-helpers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { UtilsTest } from './UtilsTest'
import { DAOCreatedEventFilter, DAOCreatedEventObject, DAOCreatedEvent } from "../typechain-types/contracts/GovFactory"


const supplyERC20Timelock = ethers.utils.parseEther("10000");

describe('InvestmentDAO', function () {
    async function initialSetUp() {
        const [deployer, alvaro] = await ethers.getSigners()

        const { govFactory } = await UtilsTest.deployDaoFactory()

        return {
            govFactory,
            deployer,
            alvaro
        }
    }

    describe('1.) Deploy DAO', function () {
        it('Should be deployed DAO', async function () {
            const { govFactory, deployer, alvaro } = await loadFixture(initialSetUp)

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
            
            console.log(await govFactory.getDaos())

            //expect(await testERC20.balanceOf(alvaro.address)).eq(amountRequested);

        })
    })
})

