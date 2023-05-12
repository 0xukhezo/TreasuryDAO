import btcLogo from '../public/ic_bitcoin.svg';
import ethLogo from '../public/ic_ethereum.svg';
import linkLogo from '../public/ic_link.svg';
import uniLogo from '../public/ic_unis.svg';
import usdcLogo from '../public/ic_usdc.svg';

const coinData: {
    [key: string]: { img: string; symbol: string; }[];
  } = {
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": [{ "img": btcLogo, "symbol": "BTC" }],
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": [{ "img": ethLogo, "symbol": "ETH" }],
    "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": [{ "img": linkLogo, "symbol": "LINK" }],
    "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0": [{ "img": uniLogo, "symbol": "UNI" }],
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": [{ "img": usdcLogo, "symbol": "USDC" }],
  };

export default coinData
