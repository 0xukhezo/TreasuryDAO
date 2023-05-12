import { ethers } from "ethers";

const { AddressZero } = ethers.constants
import abi from "../abi/abis.json";
import { ERC20 } from "../types/ERC20";

const referalCodeUkhezo = "0x556b68657a6f436f646500000000000000000000000000000000000000000000"

const gmxRouterAddr = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064"
const gmxPositionRouterAddr = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
const gmxVaultAddr = "0x489ee077994B6658eAfA855C308275EAd8097C4A"
const gmxReaderAddr = "0x22199a49A999c351eF7927602CFB187ec3cae489"
const timelock = "0x00B60986B613B953d6DA14EA6eAd2f93861B61bD";

const provider = ethers.getDefaultProvider(
    `https://arb-mainnet.g.alchemy.com/v2/zdXmoaJlrmy-RYGmcRk3H0Y270sDCPwg`
  );


  function createParamOpenPosition(collateralToken: ERC20, amountCollateral: string, indexToken: ERC20, executionFees: string, sizeDeltaUSD: string, acceptablePriceUSD: string, isLong:boolean): Array<any> {
    const increaseParams = [
        [collateralToken.address],                                  // _path
        indexToken.address,                                         // _indexToken
        amountCollateral,                                           // _amountIn
        0,                                                          // _minOut
        ethers.utils.parseUnits(sizeDeltaUSD, "30"),                // _sizeDelta
        isLong,                                                      // _isLong
        ethers.utils.parseUnits(acceptablePriceUSD, "30"),          // _acceptablePrice
        executionFees,                                              // executionFee
        referalCodeUkhezo,                                          // referal code
        AddressZero                                                 // targetCallback
    ]
   
    return increaseParams;
}

function createParamCloseShortPosition(collateralToken: ERC20, indexToken: ERC20, executionFees: string, collateralDeltaUSD:string, sizeDeltaUSD: string, acceptablePriceUSD: string, receiver: string): Array<any> {

    let decreaseParams = [
        [collateralToken.address],                        // _collateralToken
        indexToken.address,                               // _indexToken
        ethers.utils.parseUnits(collateralDeltaUSD, "30"),// _collateralDelta
        ethers.utils.parseUnits(sizeDeltaUSD, "30"),      // _sizeDelta
        false,                                            // _isLong
        receiver,                                         // _receiver
        ethers.utils.parseUnits(acceptablePriceUSD, "30"),// _acceptablePrice
        0,                                                // _minOut
        executionFees,                                    // _executionFee
        false,                                            // _withdrawETH
        AddressZero                                       // _callbackTarget
    ]
    return decreaseParams

}

export default async function createProposalOpenPosition(collateralToken: ERC20, amountCollateral: string, indexToken: ERC20, sizeDeltaUSD: string, acceptablePriceUSD: string, isLong:boolean, title:string, description:string) {
    
    const positionRouter = new ethers.Contract(gmxPositionRouterAddr, abi.abiPositionRouter, provider)
    const router = new ethers.Contract(gmxRouterAddr, abi.abiRouter, provider)
    const executionFees = await positionRouter.minExecutionFee()
    
    let callDatas = []
    let targets = []
    let values = []
   
    //ApprovePlugin
    callDatas.push(router.interface.encodeFunctionData('approvePlugin', [positionRouter.address]))
    targets.push(router.address)
    values.push('0')
    
    //Approve collateral
    callDatas.push(collateralToken.interface.encodeFunctionData('approve', [router.address, amountCollateral]))
    targets.push(collateralToken.address)
    values.push('0')

    //CreatePosition
    const increaseParams = createParamOpenPosition(collateralToken, amountCollateral, indexToken, executionFees, sizeDeltaUSD, acceptablePriceUSD, isLong)
    callDatas.push(positionRouter.interface.encodeFunctionData('createIncreasePosition', [...increaseParams]))
    targets.push(positionRouter.address)
    values.push(executionFees.toString())
   
    const descriptionHash = `# ${title} \n ${description}`

    return  { callDatas, targets, values, descriptionHash }
}

export async function createProposalCloseShortPosition(collateralToken: ERC20, indexToken: ERC20, collateralDelta:string, sizeDeltaUSD: string, acceptablePriceUSD: string, receiver: string) {

    const positionRouter = new ethers.Contract(gmxPositionRouterAddr, abi.abiPositionRouter, provider)
    const executionFees = await positionRouter.minExecutionFee()

    let callDatas = []
    let targets = []
    let values = []

    //ClosePosition
    const decreaseParams = createParamCloseShortPosition(collateralToken, indexToken, executionFees,collateralDelta, sizeDeltaUSD, acceptablePriceUSD, receiver)

    callDatas.push(positionRouter.interface.encodeFunctionData('createDecreasePosition', [...decreaseParams]))
    targets.push(positionRouter.address)
    values.push(executionFees.toString())

    const descriptionHash = '# Close a short in GMX \nTransfer amountB from proposer to DAO and transfer amounA from DAO to proposer'

    return { callDatas, targets, values, descriptionHash }
}

export async function getOpenPosition(collaterallTokenAddr: string, indexTokenAddr: string, isLong: boolean, timelockAddress:string) {

    const reader = new ethers.Contract(gmxReaderAddr, abi.abiReader, provider)
    const position = await reader.getPositions(gmxVaultAddr, timelockAddress, [collaterallTokenAddr], [indexTokenAddr], [isLong])

    return position

    console.log(`Size: ${ethers.utils.formatUnits(position[0].toString(), "30")}`)              // Total value position
    console.log(`Collateral: ${ethers.utils.formatUnits(position[1].toString(), "30")}`)        // Value you enter in the position
    console.log(`AveragePrice: ${ethers.utils.formatUnits(position[2].toString(), "30")}`)      // Average price
    console.log(`EntryFundingRate: ${position[3].toString()}`)                                  // 
    console.log(`HasRealisedProfit: ${position[4].toString()}`)                                 // 
    console.log(`RealisedPnl: ${ethers.utils.formatUnits(position[5].toString(), "30")}`)       // Amount of profit you take from the position
    console.log(`LastIncreasedTime: ${position[6].toString()}`)                                 // The last time you move assets or/in the position
    console.log(`HasProfit 1 true: ${position[7].toString()}`)                                  // If 1 you have profit if 0 you havnet got
    console.log(`Delta: ${ethers.utils.formatUnits(position[8].toString(), "30")}`)             // Profit in the position

}