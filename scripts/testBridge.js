// scripts/testBridge.js
const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

const NETWORK = hre.network.name;

// Adjust these based on destination and assets
const BRIDGE_CONTRACT = {
  fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf", // Fuji bridge
};

const TOKENS = {
  usdt: {
    fuji: "0xaea4eF42B393745b003Ce8F98AC6367E48674383", // USDT on Fuji
  },
};

const DST_EID = 40161; // Sepolia
const RECEIVER = "0xB3D9a26Fa3105381BbEf6028b0e50A203D802514";
const AMOUNT = ethers.parseUnits("0.5", 18); // 0.5 USDT

const MSG_VALUE = ethers.parseEther("0.01"); // LayerZero fee

async function main() {
  if (!BRIDGE_CONTRACT[NETWORK]) {
    throw new Error(`❌ No bridge contract for network ${NETWORK}`);
  }

  const [sender] = await ethers.getSigners();
  console.log(`🔗 Sender: ${sender.address}`);

  const bridge = await ethers.getContractAt("WrappedTokenBridge", BRIDGE_CONTRACT[NETWORK]);

  try {
    const tx = await bridge.bridge(
      DST_EID,
      TOKENS.usdt[NETWORK],
      AMOUNT,
      RECEIVER,
      { value: MSG_VALUE }
    );
    console.log("🚀 Transaction sent. Waiting for confirmation...");
    await tx.wait();
    console.log(`✅ Bridged 0.5 USDT from ${NETWORK} to Sepolia`);
  } catch (err) {
    console.error("❌ Bridge transaction failed:", err.message);
  }
}

main().catch((error) => {
  console.error("❌ Script error:", error);
  process.exit(1);
});
