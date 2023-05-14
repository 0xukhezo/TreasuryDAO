import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { arbitrum, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import React from "react";
import Navbar from "@/components/Layout/Navbar";
const { chains, provider, webSocketProvider } = configureChains(
  [arbitrum, optimism, polygon],
  [
    alchemyProvider({ apiKey: "jV48FiIqymNxVnj4BcMjimmRgaNfXPlC" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Treasury DAO",
  chains,
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Treasury DAO</title>
        <meta name="description" content="Treasury DAO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <Navbar />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
