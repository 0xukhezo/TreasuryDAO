import { NaturalPositionCreated as NaturalPositionCreatedEvent, NaturalPositionClosed as NaturalPositionClosedEvent } from "../../generated/templates/GovHelper/GovHelper";
import { NaturalPosition } from "../../generated/schema"
import { log } from "@graphprotocol/graph-ts";


export function handleNaturalPositionCreated(event: NaturalPositionCreatedEvent): void {

    let id = event.address.toHexString().concat(event.params.collateralToken.toHexString()).concat(event.params.borrowToken.toHexString())

    let position = NaturalPosition.load(id)

    if (position === null) {
        position = new NaturalPosition(id)
        position.amountIn = event.params.collateralAmount
        position.tokenIn = event.params.collateralToken.toHexString()
        position.timelock = event.address.toHexString()
        position.tokenBorrow = event.params.borrowToken.toHexString()
        position.price = event.params.price
        position.isOpen = true
        position.save()

    } else {
        log.error("PositionNatural {} found. We can not created one more tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    }
}

export function handleNaturalPositionClosed(event: NaturalPositionClosedEvent): void {

    let id = event.address.toHexString().concat(event.params.tokenIn.toHexString()).concat(event.params.borrowToken.toHexString())

    let position = NaturalPosition.load(id)

    if (position === null) {
        log.error("PositionNatural {} found. We can not created one more tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        position = new NaturalPosition(id)
        position.isOpen = false
        position.save()
    }
}



