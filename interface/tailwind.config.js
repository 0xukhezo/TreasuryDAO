/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        container: "750px",
        containerUniswap: "800px",
      },
      width: { container: "798px", containerCampaign: "798px" },
      colors: {
        almostBlack: "#242423",
        beige: "#ECE4DD",
        beigeLight: "#F5F1EE",
        brown: "#988676",
        short: "#C45041",
        long: "#61AE46",
      },
    },
  },
  plugins: [],
};
