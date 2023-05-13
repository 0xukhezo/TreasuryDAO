import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import "@nomiclabs/hardhat-etherscan";
import "hardhat-contract-sizer"
import * as dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.7.6"
      }
    ],
  },
  networks: {
    arbitrum:{
      url: process.env.ARBITRUM_MAINNET_URL,
      accounts: [process.env.ARBITRUM_MAINNET_DEPLOY_KEY!]
    },
    arbitrumTestnet: {
      url: process.env.ARBITRUM_TESTNET_URL,
      accounts: [process.env.ARBITRUM_TESTNET_DEPLOY_KEY!,process.env.ARBITRUM_TESTNET_USER1_KEY!,process.env.ARBITRUM_TESTNET_USER2_KEY!,process.env.ARBITRUM_TESTNET_USER3_KEY!]
    },
    mumbai : {
      url: process.env.POLYGON_MUMBAI_URL,
      accounts: [process.env.ARBITRUM_TESTNET_DEPLOY_KEY!,process.env.ARBITRUM_TESTNET_USER1_KEY!,process.env.ARBITRUM_TESTNET_USER2_KEY!,process.env.ARBITRUM_TESTNET_USER3_KEY!]
    },
    hardhat: {
      forking: {
        url: process.env.ARBITRUM_MAINNET_URL!,
        //blockNumber: 82409006
      },
      allowUnlimitedContractSize: true,
    }
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY!,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY!,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!
    }
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    externalArtifacts: [
      './node_modules/@uniswap/v3-periphery/artifacts/contracts/**/*.json',
      './node_modules/@aave/core-v3/artifacts/contracts/**/*[!dbg].json',
      './node_modules/@aave/core-v3/artifacts/contracts/**/**/*[!dbg].json',
      './node_modules/@aave/core-v3/artifacts/contracts/**/**/**/*[!dbg].json',
    ], 
  },
};

export default config;
