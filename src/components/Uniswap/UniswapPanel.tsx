interface UniswapPanelInterface {
  display: string;
  timelockAddress: `0x${string}`;
  governorAddress: `0x${string}`;
}

export default function UniswapPanel({
  display,
  timelockAddress,
  governorAddress,
}: UniswapPanelInterface) {
  return <div>UniswapPanel</div>;
}
