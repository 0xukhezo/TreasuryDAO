import btcLogo from '../public/ic_bitcoin.svg';
import ethLogo from '../public/ic_ethereum.svg';
import linkLogo from '../public/ic_link.svg';
import uniLogo from '../public/ic_unis.svg';
import usdcLogo from '../public/ic_usdc.svg';

export const coinDataArbitrum: {
    [key: string]: { img: string; symbol: string; }[];
  } = {
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": [{ "img": btcLogo, "symbol": "BTC" }],
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": [{ "img": ethLogo, "symbol": "ETH" }],
    "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": [{ "img": linkLogo, "symbol": "LINK" }],
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": [{ "img": usdcLogo, "symbol": "USDC" }],
  };

  export const coinDataOptimist: {
    [key: string]: { img: string; symbol: string; }[];
  } = {
    "0x68f180fcCe6836688e9084f035309E29Bf0A2095": [{ "img": btcLogo, "symbol": "WBTC" }],
    "0x4200000000000000000000000000000000000006": [{ "img": ethLogo, "symbol": "WETH" }],
    "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6": [{ "img": linkLogo, "symbol": "LINK" }],
    "0x7F5c764cBc14f9669B88837ca1490cCa17c31607": [{ "img": usdcLogo, "symbol": "USDC" }],
  };


  export const coinDataPolygon: {
    [key: string]: { img: string; symbol: string; }[];
  } = {
    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": [{ "img": btcLogo, "symbol": "WBTC" }],
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": [{ "img": ethLogo, "symbol": "WETH" }],
    "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39": [{ "img": linkLogo, "symbol": "LINK" }],
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": [{ "img": usdcLogo, "symbol": "USDC" }],
  };