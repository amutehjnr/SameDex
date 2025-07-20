const { ethers } = require("hardhat");
require("dotenv").config();

const CHAINS = {
  sepolia: {
    rpc: "https://ethereum-sepolia.publicnode.com",
    bridge: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
    usdt: "0xa06962C1d1992b270330A84B808D5459D70B34C8",
    usdc: "0xD5E6A0AC8527Df7771481E2b22A6058DD9fd5973",
  },
  fuji: {
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    bridge: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    usdt: "0xaea4eF42B393745b003Ce8F98AC6367E48674383",
    usdc: "0x8d5E36052D6a9B22E10E3dA64b534C78E1B3B7F8",
  },
  bsctestnet: {
    rpc: "https://rpc.ankr.com/bsc_testnet_chapel/6d93a93416ebd14d49ba9965f3c4a06302151aa1bb82f21f585ad5c6dafb1e95",
    bridge: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
    usdt: "0x9B2213449432517A82952E5C794B068efC9fe362",
    usdc: "0x9A44219dc3E641A2f71ADBd411B87876D8393391",
  },
  arbitrumsepolia: {
    rpc: "https://arbitrum-sepolia.infura.io/v3/b30182d4f8ff43fd99f6a176e5c2251d",
    bridge: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
    usdt: "0xcCAF774333c9eae5AD7fC7d38dFF6dF2513F6dFB",
    usdc: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
  },
  basesepolia: {
    rpc: "https://sepolia.base.org",
    bridge: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
    usdt: "0xcD95FAA362e6B817385B45676CEB1d2e00e89713",
    usdc: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
  },
};

const user = "0xe2396133f57767CEeDC3fA97168bc8b46C0Cc3e2";
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function symbol() view returns (string)",
];

const format = (val) => ethers.formatUnits(val, 18);

async function check() {
  for (const [chain, config] of Object.entries(CHAINS)) {
    console.log(`\n🌍 ${chain}`);
    try {
      const provider = new ethers.JsonRpcProvider(config.rpc);
      const usdt = new ethers.Contract(config.usdt, ERC20_ABI, provider);
      const usdc = new ethers.Contract(config.usdc, ERC20_ABI, provider);

      const [usdtSymbol, usdtAllowance] = await Promise.all([
        usdt.symbol(),
        usdt.allowance(user, config.bridge),
      ]);

      const [usdcSymbol, usdcAllowance] = await Promise.all([
        usdc.symbol(),
        usdc.allowance(user, config.bridge),
      ]);

      console.log(`→ ${usdtSymbol} approved:`, usdtAllowance > 0n ? `✅ (${format(usdtAllowance)})` : "❌");
      console.log(`→ ${usdcSymbol} approved:`, usdcAllowance > 0n ? `✅ (${format(usdcAllowance)})` : "❌");
    } catch (err) {
      console.error(`❌ Error checking ${chain}: ${err.message}`);
    }
  }
}

check().catch(console.error);
