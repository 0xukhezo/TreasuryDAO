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
    },
  },
  plugins: [],
};
