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
  import { Factory, Dao, Gov, Token } from "../generated/schema"
  import { DAOCreated as DAOCreatedEvent } from "../generated/GovFactory/GovFactory"
  import { handleDAOCreated } from "../src/mapping/gov-factory"
  import { createDAOCreatedEvent } from "./gov-factory-utils"
  import { FACTORY_ADDRESS } from "../src/utils/constants"
  import { log } from '@graphprotocol/graph-ts'
  
  //Const gov
  const govName = "InvestmentDAO"
  const quorumNumerator = "51"
  const proposalThreshold = "1000000000000000000"
  
  const tokenName = "Better World Club"
  const tokenSymbol = "BWC"
  const initialSupply = "100000000000000000000"
  const gov = Address.fromString("0x0000000000000000000000000000000000000001")
  const timelock = Address.fromString("0x0000000000000000000000000000000000000002")
  const token = Address.fromString("0x0000000000000000000000000000000000000003")
  const sender = Address.fromString("0x0000000000000000000000000000000000000004")
  
  describe("Describe entity assertions", () => {
    beforeAll(() => {
  
      //Mocked functions
      createMockedFunction(gov, 'name', 'name():(string)')
        .returns([ethereum.Value.fromString(govName)])
  
      createMockedFunction(gov, 'quorumNumerator', 'quorumNumerator():(uint256)')
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(quorumNumerator))])
  
      createMockedFunction(gov, 'proposalThreshold', 'proposalThreshold():(uint256)')
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(proposalThreshold))])
  
      createMockedFunction(token, 'name', 'name():(string)')
        .returns([ethereum.Value.fromString(tokenName)])
  
      createMockedFunction(token, 'symbol', 'symbol():(string)')
        .returns([ethereum.Value.fromString(tokenSymbol)])
  
      createMockedFunction(token, 'totalSupply', 'totalSupply():(uint256)')
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(initialSupply))])
  
      let newDAOCreatedEvent = createDAOCreatedEvent(sender, gov, timelock, token)
      handleDAOCreated(newDAOCreatedEvent)
    })
  
    afterAll(() => {
      clearStore()
    })
  
    test("Should have been created factory entity", () => {
      let factory = Factory.load(FACTORY_ADDRESS)
      assert.stringEquals(FACTORY_ADDRESS, factory!.get("id")!.toString())
    })
  
    test("Should have been created DAO entity", () => {
      assert.entityCount("Dao", 1)
      let retrievedDao = Dao.load(gov.toHexString())
      let idStored = retrievedDao!.get("id")!.toString()
  
      assert.assertNotNull(idStored)
      assert.stringEquals(gov.toHexString(), idStored)
  
    })
  
    test("Should have been created Gov entity", () => {
  
      assert.entityCount("Gov", 1)
      //const retrievedGov = Gov.load(gov.toHexString())
  
    })
  
    test("Should have been created Timelock entity", () => {
      assert.entityCount("Timelock", 1)
    })
  
    test("Should have been created Token entity", () => {
      assert.entityCount("Token", 1)
    })

    test("Should have been created Token-holder entity", () => {
      assert.entityCount("TokenHolder", 1)
    })
  
  })
  