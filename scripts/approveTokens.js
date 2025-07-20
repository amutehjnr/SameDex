// scripts/approveTokens.js
const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

const BRIDGE_ADDRESS = {
  sepolia: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
  fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
  bsctestnet: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
  arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
  basesepolia: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
};

const TOKENS = {
  usdt: {
    sepolia: "0xa06962C1d1992b270330A84B808D5459D70B34C8",
    fuji: "0xaea4eF42B393745b003Ce8F98AC6367E48674383",
    bsctestnet: "0x9B2213449432517A82952E5C794B068efC9fe362",
    arbitrumsepolia: "0xcCAF774333c9eae5AD7fC7d38dFF6dF2513F6dFB",
    basesepolia: "0xcD95FAA362e6B817385B45676CEB1d2e00e89713",
  },
  usdc: {
    sepolia: "0xD5E6A0AC8527Df7771481E2b22A6058DD9fd5973",
    fuji: "0x8d5E36052D6a9B22E10E3dA64b534C78E1B3B7F8",
    bsctestnet: "0x9A44219dc3E641A2f71ADBd411B87876D8393391",
    arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
    basesepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
  },
};

async function main() {
  const [signer] = await ethers.getSigners();
  const network = hre.network.name;
  const bridgeAddress = BRIDGE_ADDRESS[network];

  if (!bridgeAddress) throw new Error(`No bridge address for ${network}`);

  for (const tokenType of ["usdt", "usdc"]) {
    const tokenAddress = TOKENS[tokenType][network];
    if (!tokenAddress) {
      console.log(`❌ No ${tokenType.toUpperCase()} token for ${network}`);
      continue;
    }

    const token = await ethers.getContractAt("IERC20", tokenAddress, signer);
    try {
      const amount = ethers.parseUnits("1000000", 18); // ensure correct parsing
      const tx = await token.approve(bridgeAddress, amount);
      await tx.wait();
      console.log(`✅ Approved ${tokenType.toUpperCase()} on ${network}`);
    } catch (err) {
      console.error(`❌ Failed to approve ${tokenType.toUpperCase()} on ${network}:`, err.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
