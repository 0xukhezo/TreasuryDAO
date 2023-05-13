import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  newMockEvent,
  createMockedFunction
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts"
import {  Token } from "../generated/schema"
import { DAOCreated as DAOCreatedEvent } from "../generated/GovFactory/GovFactory"
import { handleDAOCreated } from "../src/mapping/gov-factory"
import { createDAOCreatedEvent } from "./gov-factory-utils"
import { FACTORY_ADDRESS } from "../src/utils/constants"
import { log } from '@graphprotocol/graph-ts'

//const Gov
const govName = "InvestmentDAO"
const quorumNumerator = "51"
const proposalThreshold = "1000000000000000000"

const tokenName = "Better World Club"
const tokenSymbol = "BWC"
const initialSupply = "100000000000000000000"
const govAddr = Address.fromString("0x0000000000000000000000000000000000000001")
const timelockAddr = Address.fromString("0x0000000000000000000000000000000000000002")
const tokenAddr = Address.fromString("0x0000000000000000000000000000000000000003")
const senderAddr = Address.fromString("0x0000000000000000000000000000000000000004")

describe("Event Dao Created", () => {
  beforeAll(() => {

    //Mocked functions
    //Gov
    createMockedFunction(govAddr, 'name', 'name():(string)')
      .returns([ethereum.Value.fromString(govName)])

    createMockedFunction(govAddr, 'quorumNumerator', 'quorumNumerator():(uint256)')
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(quorumNumerator))])

    createMockedFunction(govAddr, 'proposalThreshold', 'proposalThreshold():(uint256)')
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(proposalThreshold))])

    //Token
    createMockedFunction(tokenAddr, 'name', 'name():(string)')
      .returns([ethereum.Value.fromString(tokenName)])

    createMockedFunction(tokenAddr, 'symbol', 'symbol():(string)')
      .returns([ethereum.Value.fromString(tokenSymbol)])

    createMockedFunction(tokenAddr, 'totalSupply', 'totalSupply():(uint256)')
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(initialSupply))])

    let newDAOCreatedEvent = createDAOCreatedEvent(senderAddr, govAddr, timelockAddr, tokenAddr)
    handleDAOCreated(newDAOCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("Should have been created token entity", () => {
    let token = Token.load(tokenAddr.toHexString())
    assert.assertNotNull(token)
    assert.stringEquals(tokenAddr.toHexString(), token!.get("id")!.toString())

    let name = token!.get("name")!.toString()
    let symbol = token!.get("symbol")!.toString()
    let supply = token!.get("supply")
    assert.assertNotNull(name)
    assert.assertNotNull(symbol)
    assert.stringEquals(name, tokenName)
    assert.stringEquals(symbol, tokenSymbol)
  })



})
