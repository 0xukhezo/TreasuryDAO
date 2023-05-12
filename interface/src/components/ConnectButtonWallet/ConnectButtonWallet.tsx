import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectButtonWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="border-2 border-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 h-12 bg-gray-200"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="border-2 border-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 h-12 bg-gray-200"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div
                  style={{ display: "flex", gap: 12 }}
                  className="justify-end "
                >
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  ></button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="border-2 border-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 h-12 bg-gray-200"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
