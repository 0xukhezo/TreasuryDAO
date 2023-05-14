import { ERC20 } from "../types/ERC20"
import { GovHelper } from "../types/GovHelper"
import { IWETH9 } from "../types/IWETH"

export async function createProposeOpenNaturalPosition(
    helper: GovHelper,
    collateralToken: ERC20,
    collateralAmount: string,
    borrowToken: IWETH9,
    borrowAmount: string,
    interestRateMode: string,
    priceFeed: string,
    slippage: string,
    poolFee: string,
    variableDebtToken: any
  ) {
    let callDatas = []
    let targets = []
    let values = []

    //Approve delegation
    callDatas.push(variableDebtToken.interface.encodeFunctionData('approveDelegation', [helper.address,borrowAmount]))
    targets.push(variableDebtToken.address)
    values.push('0')

    //Approve USDC
    callDatas.push(collateralToken.interface.encodeFunctionData('approve', [helper.address, collateralAmount]))
    targets.push(collateralToken.address)
    values.push('0')
   
    //BorrowSwap
    const params: any = [collateralToken.address,collateralAmount,borrowToken.address,borrowAmount,interestRateMode,priceFeed,slippage,poolFee]
    callDatas.push(helper.interface.encodeFunctionData('borrowSwap', [...params]).toString())
    targets.push(helper.address)
    values.push('0')

    const descriptionHash = `# Open AAVE Position \n Create a position in AAVE `
  
    return { callDatas, targets, values, descriptionHash }
  }

export async function createProposeCloseNaturalPosition(tokenIn:ERC20, helper: GovHelper, borrowToken: IWETH9, borrowAmount: string, priceFeed: string, slippage:string, poolFee:string, interestRateMode: string,balanceAUsdc:string, pool:any, timelockAddr:string){
    let callDatas = []
    let targets = []
    let values = []

    console.log(helper.address, borrowAmount)

    callDatas.push(tokenIn.interface.encodeFunctionData('approve', [helper.address, borrowAmount]))
    targets.push(tokenIn.address)
    values.push('0')

    console.log(tokenIn.address, borrowAmount, borrowToken.address,slippage,poolFee,priceFeed,interestRateMode)

    callDatas.push(helper.interface.encodeFunctionData('swapRepay', [tokenIn.address, borrowAmount, borrowToken.address,slippage,poolFee,priceFeed,interestRateMode]))
    targets.push(helper.address)
    values.push('0')

    console.log(tokenIn.address,balanceAUsdc,timelockAddr)

    callDatas.push(pool.interface.encodeFunctionData('withdraw',[tokenIn.address,balanceAUsdc,timelockAddr]))
    targets.push(pool.address)
    values.push('0')

    const descriptionHash =`# Close AAVE Position \n Close a position in AAVE `

    return { callDatas, targets, values, descriptionHash }

}