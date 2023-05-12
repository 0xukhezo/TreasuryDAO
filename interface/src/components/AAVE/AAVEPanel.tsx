import React from "react";

interface AAVEPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function AAVEPanel({
  display,
  timelockAddress,
  governorAddress,
}: AAVEPanelInterface) {
  return <div>AAVEPanel</div>;
}
