import { DAOCreated as DAOCreatedEvent } from "../../generated/GovFactory/GovFactory"
import { Token as TokenTemplate, Gov as GovTemplate} from "../../generated/templates"
import { Factory, Dao, Gov, Token, Timelock, TokenHolder } from "../../generated/schema"
import { log } from '@graphprotocol/graph-ts'
import { fetchGovName, fetchGovProposalThreshold, fetchGovQuorum } from "../utils/gov"
import { fetchTokenTotalSupply, fetchTokenName, fetchTokenSymbol } from "../utils/token"
import {FACTORY_ADDRESS, ONE_BI, ZERO_BI} from "./../utils/constants"

export function handleDAOCreated(event: DAOCreatedEvent): void {

  // load factory
  let factory = Factory.load(FACTORY_ADDRESS)

  if(factory === null){
    factory = new Factory(FACTORY_ADDRESS)
    factory.daoCount = ZERO_BI
  }
  factory.daoCount = factory.daoCount.plus(ONE_BI)

  //Create DAO
  let dao = new Dao(event.params.gov.toHexString()) as Dao
  dao.sender = event.params.sender
  dao.transactionHash = event.transaction.hash
  dao.gov = event.params.gov.toHexString()
  dao.token = event.params.token.toHexString()
  dao.helper = event.params.helper.toHexString()
  dao.timelock = event.params.timelock.toHexString()

  // Create gov
  let gov = new Gov(event.params.gov.toHexString()) as Gov
  gov.name = fetchGovName(event.params.gov)
  gov.proposalThreshold = fetchGovProposalThreshold(event.params.gov)
  gov.quorum = fetchGovQuorum(event.params.gov)
  gov.proposals = ZERO_BI
  gov.proposalsQueued = ZERO_BI
  gov.save()
  GovTemplate.create(event.params.gov)
  
  // Create token
  let token = new Token(event.params.token.toHexString()) as Token
  token.name = fetchTokenName(event.params.token)
  token.symbol = fetchTokenSymbol(event.params.token)
  token.supply = fetchTokenTotalSupply(event.params.token)
  token.holders = ONE_BI
  token.totalDelegates = ZERO_BI
  token.save()
  TokenTemplate.create(event.params.token)

  //Token holder
  let tokenHolder = new TokenHolder(event.params.sender.toHexString())
  tokenHolder.tokenBalance = ZERO_BI
  tokenHolder.save()

  // Create timelock
  let timelock = new Timelock(event.params.timelock.toHexString()) as Timelock
  timelock.save()
  dao.save()

  factory.save()
}
