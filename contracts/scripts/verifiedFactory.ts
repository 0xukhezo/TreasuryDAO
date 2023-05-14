import { ethers } from "hardhat";
import { getExpectedContractAddress } from '../helpers/expected_contract';
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Gov, Gov__factory, GovToken, GovToken__factory, TimelockController, TimelockController__factory } from "../typechain-types"


async function main() {


  const hre: HardhatRuntimeEnvironment = await import('hardhat')

  const [deployer] = await ethers.getSigners()

  /*gov :
0x5a0a838902c62337ce15b788271d7fc553e449a1
timelock :
0x9515c1065905f91b41e261e0fa419f2dfed082b1
token :
0x484264a03bbb1fe22e13ad10ad500e381894307c
helper :
0x924bea079e53dd690968d357e585051d2fd6cd7a

  //Token
  const token: GovToken = await ethers.getContractAt("GovToken","")
  
  //Gov
  const gov: Gov = await ethers.getContractAt("Gov","")*/

  //Timelock
  const timelock: TimelockController = await ethers.getContractAt("TimelockController", "0x9515c1065905f91b41e261e0fa419f2dfed082b1")

  console.log(timelock.address)


  //Verify
  await hre.run("verify:verify", {
    address: timelock.address,
    constructorArguments: [
      process.env.MIN_DELAY_TIMELOCK!,
      [],
      [],
      "0x8c30fA625151Ea3719E54565af897E281932F110"
    ]
  })

 /* await hre.run("verify:verify", {
    address: timelock.address,
    constructorArguments: [
      process.env.MIN_DELAY_TIMELOCK!,
      [govAddres],
      [govAddres],
      AddressZero
    ]
  })

  await hre.run("verify:verify", {
    address: gov.address,
    constructorArguments: [
      token.address,
      timelock.address,
      process.env.DAO_NAME!,
      process.env.INITIAL_VOTING_DELAY!,
      process.env.INITIAL_VOTING_PERIOD!,
      process.env.QUORUM!,
      process.env.INITIAL_PROPOSAL_THRESHOLD!
    ]
  })*/

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
