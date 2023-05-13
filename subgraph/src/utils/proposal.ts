import { BigInt, Address } from '@graphprotocol/graph-ts'
//import { Gov } from '../../generated/templates/Gov/Gov'
import {Proposal, Gov} from "../../generated/schema";
import { ONE_BI, ZERO_BI} from "./../utils/constants"


export function getOrCreateProposal(
    id: string,
    gov: string,
    createIfNotFound: boolean = true,
    save: boolean = false
  ): Proposal {
    let proposal = Proposal.load(id);
  
    if (proposal == null && createIfNotFound) {
      proposal = new Proposal(id);
  
      let governance = Gov.load(gov);
  
      if(governance !== null){
          governance!.proposals = governance!.proposals.plus(ONE_BI);
          governance!.save();
      }
  
      if (save) {
        proposal.save();
      }
    }
  
    return proposal as Proposal;
  }