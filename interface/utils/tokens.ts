import btcLogo from '../public/btc.svg';
import ethLogo from '../public/eth.svg';
import linkLogo from '../public/ic_link.svg';
import usdcLogo from '../public/usdc.svg';

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

  export const debtAAVEPolygon = []

  export const debtAAVEArbitrum = [
    {token:"0x92b42c66840C7AD907b4BF74879FF3eF7c529473", symbol:"WBTC", img:btcLogo},
    {token:"0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351", symbol:"WETH", img:ethLogo},
    {token:"0x953A573793604aF8d41F306FEb8274190dB4aE0e", symbol:"LINK", img:linkLogo},
    {token:"0xFCCf3cAbbe80101232d343252614b6A3eE81C989", symbol:"USDC", img:usdcLogo}
  ]

  export const debtAAVEOptimism  = [];