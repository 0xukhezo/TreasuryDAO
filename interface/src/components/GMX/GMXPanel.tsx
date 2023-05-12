interface GMXPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function GMXPanel({
  display,
  timelockAddress,
  governorAddress,
}: GMXPanelInterface) {
  return <div>GMXPanel</div>;
}
