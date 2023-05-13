import { ProposalCreated, ProposalCanceled, ProposalQueued, ProposalExecuted, VoteCast } from "../../generated/templates/Gov/Gov";
import { Factory, Dao, Gov, Token, Timelock, Proposal } from "../../generated/schema"
import { Address, BigInt, Bytes, Value, log } from "@graphprotocol/graph-ts";
import { ONE_BI, ZERO_BI, STATUS_ACTIVE, STATUS_PENDING, STATUS_CANCELLED, STATUS_QUEUED , STATUS_EXECUTED} from "./../utils/constants"


export function handleProposalCreated(event: ProposalCreated): void {

    let proposal = new Proposal(event.params.proposalId.toString());
    let governance = Gov.load(event.address.toHexString());

    if (governance === null) {
        log.error("Gov {} not found on ProposalCreated. tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        governance.proposals = governance.proposals.plus(ONE_BI);
        governance.save();
    }

    proposal.targets = changetype<Bytes[]>(event.params.targets);
    proposal.values = event.params.values;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;
    proposal.startBlock = event.params.startBlock;
    proposal.endBlock = event.params.endBlock;
    proposal.description = event.params.description;
    proposal.status =
        event.block.number >= proposal.startBlock ? STATUS_ACTIVE : STATUS_PENDING;

    proposal.save();
}

export function handleProposalCanceled(event: ProposalCanceled): void {
    let proposal = Proposal.load(event.params.proposalId.toString());

    if(proposal === null){
        log.error("Proposal {} not found on ProposalCanceled. tx_hash: {}", [
            event.params.proposalId.toString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        proposal.status = STATUS_CANCELLED;
        proposal.save();
    }
  
}

  export function handleProposalQueued(event: ProposalQueued): void {
    let gov = Gov.load(event.address.toHexString());
    let proposal = Proposal.load(event.params.proposalId.toString());

    if(proposal === null){
        log.error("Proposal {} not found on ProposalQueued. tx_hash: {}", [
            event.params.proposalId.toString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        proposal.status = STATUS_QUEUED;
        proposal.save();
    }

    if(gov === null){
        log.error("Gov {} not found on ProposalQueued. tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        gov.proposalsQueued = gov.proposalsQueued.plus(ONE_BI)
        gov.save();
    }
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    let gov = Gov.load(event.address.toHexString());
    let proposal = Proposal.load(event.params.proposalId.toString());

    if(proposal === null){
        log.error("Proposal {} not found on ProposalExecuted. tx_hash: {}", [
            event.params.proposalId.toString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        proposal.status = STATUS_EXECUTED;
        proposal.save();
    }
  
    if(gov === null){
        log.error("Gov {} not found on ProposalExecuted. tx_hash: {}", [
            event.address.toHexString(),
            event.transaction.hash.toHexString()
        ]);
    } else {
        gov.proposalsQueued = gov.proposalsQueued.minus(ONE_BI)
        gov.save();
    }
  
  }