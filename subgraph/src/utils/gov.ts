import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Gov } from '../../generated/templates/Gov/Gov'
import { ONE_BI, ZERO_BI} from "./../utils/constants"

export function fetchGovName(govAddress: Address): string{
    let contract = Gov.bind(govAddress)
    
    let name = 'unknow'
    let nameResult = contract.try_name()
    if (!nameResult.reverted) {
        name = nameResult.value
    }

    return name
}

export function fetchGovProposalThreshold(govAddress: Address): BigInt{
    let contract = Gov.bind(govAddress)
    
    let threshold = ZERO_BI
    let thresholdResult = contract.try_proposalThreshold()
    if (!thresholdResult.reverted) {
        threshold = thresholdResult.value
    }
    return threshold
}

export function fetchGovQuorum(govAddress: Address): BigInt{
    let contract = Gov.bind(govAddress)
    
    let quorum = ZERO_BI
    let quorumResult = contract.try_quorumNumerator1()
    if (!quorumResult.reverted) {
        quorum = quorumResult.value
    }
    return quorum
}