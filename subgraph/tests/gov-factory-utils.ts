import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { DAOCreated } from "../generated/GovFactory/GovFactory"

export function createDAOCreatedEvent(
  sender: Address,
  gov: Address,
  timelock: Address,
  token: Address
): DAOCreated {
  let daoCreatedEvent = changetype<DAOCreated>(newMockEvent())

  daoCreatedEvent.parameters = new Array()

  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("gov", ethereum.Value.fromAddress(gov))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("timelock", ethereum.Value.fromAddress(timelock))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return daoCreatedEvent
}
