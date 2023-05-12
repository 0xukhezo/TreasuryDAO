import React from "react";

interface DaoInfoPanelInterface {
  dao: any;
}

export default function DaoInfoPanel({ dao }: DaoInfoPanelInterface) {
  return (
    <div>
      {dao !== undefined && (
        <div className="grid grid-cols-5 mx-10">
          <div className="flex flex-col">
            <span>Holders</span>
            <span>{dao.gov.proposalThreshold}</span>
          </div>

          <div className="flex flex-col">
            <span>Tokens neccesary to vote</span>
            <span>{dao.gov.proposalThreshold}</span>
          </div>

          <div className="flex flex-col">
            <span>Quorum</span>
            <span>{dao.gov.quorum}</span>
          </div>

          <div className="flex flex-col">
            <span>Proposals</span>
            <span>{dao.gov.proposals}</span>
          </div>

          <div className="flex flex-col">
            <span>In quorum</span>
            <span>{dao.gov.proposalsQueued}</span>
          </div>
        </div>
      )}
    </div>
  );
}
