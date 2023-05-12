import React from "react";

interface DaoInfoPanelInterface {
  dao: any;
}

export default function DaoInfoPanel({ dao }: DaoInfoPanelInterface) {
  return (
    <div>
      <div className="grid gid-cols-3">
        <div>
          <span>Holders</span>
          <span>{dao.gov.proposalThreshold}</span>
        </div>

        <div>
          <span>Tokens neccesary to vote</span>
          <span>{dao.gov.proposalThreshold}</span>
        </div>

        <div>
          <span>Quorum</span>
          <span>{dao.gov.quorum}</span>
        </div>

        <div>
          <span>Proposals</span>
          <span>{dao.gov.proposals}</span>
        </div>

        <div>
          <span>In quorum</span>
          <span>{dao.gov.proposalsQueued}</span>
        </div>
      </div>
    </div>
  );
}
