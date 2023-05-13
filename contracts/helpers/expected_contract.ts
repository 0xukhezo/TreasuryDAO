import { SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";

export async function getExpectedContractAddress(deployer: SignerWithAddress, actionsAfter:number) {
  
  const addressTransactionCount:number = await deployer.getTransactionCount();

  const expectedContractAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: addressTransactionCount + actionsAfter,
  });

  return expectedContractAddress;
};
