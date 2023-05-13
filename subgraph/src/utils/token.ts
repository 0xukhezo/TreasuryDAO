import { BigInt, Address, } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/templates/Token/Token'

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
    let contract = Token.bind(tokenAddress)
    let totalSupplyValue = BigInt.fromI32(0)
    let totalSupplyResult = contract.try_totalSupply()
    if (!totalSupplyResult.reverted) {
      totalSupplyValue = totalSupplyResult.value
    }
    return totalSupplyValue
  }

  export function fetchTokenName(tokenAddress: Address): string {
    let contract = Token.bind(tokenAddress)
    let nameValue: string = "" 
    let nameResult = contract.try_name()
    if (!nameResult.reverted) {
      nameValue = nameResult.value
    }
    return nameValue
  }

  export function fetchTokenSymbol(tokenAddress: Address): string {
    let contract = Token.bind(tokenAddress)
    let symbolValue: string = "" 
    let symbolResult = contract.try_symbol()
    if (!symbolResult.reverted) {
      symbolValue = symbolResult.value
    }
    return symbolValue
  }
