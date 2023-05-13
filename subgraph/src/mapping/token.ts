import { Factory, Dao, Gov, Token, Timelock, TokenHolder } from "../../generated/schema"
import { Approval as ApprovalEvent, Transfer, DelegateChanged } from "../../generated/templates/Token/Token"
import { log } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS, ONE_BI, ZERO_BI } from "../utils/constants"

export function handleApproval(event: ApprovalEvent): void {


}

export function handleTransfer(event: Transfer): void {

    let tokenHolderFrom = TokenHolder.load(event.params.from.toHexString())
    let tokenHolderTo = TokenHolder.load(event.params.to.toHexString())

    if (tokenHolderFrom === null) {
        log.error("TokenHolderFrom {} not found on Transfer event. tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        tokenHolderFrom.tokenBalance = tokenHolderFrom.tokenBalance.minus(event.params.value)
        tokenHolderFrom.save();
    }

    if (tokenHolderTo === null) {
        tokenHolderTo = new TokenHolder(event.params.to.toHexString())
        tokenHolderTo.tokenBalance = event.params.value
    } else {
        tokenHolderTo.tokenBalance = tokenHolderTo.tokenBalance.plus(event.params.value)
    }
    tokenHolderTo.save()

}
