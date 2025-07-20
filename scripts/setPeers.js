const hre = require("hardhat");
const { getAddress, zeroPadValue } = require("ethers");
require("dotenv").config();

// Helper: Convert address to 32-byte format for LayerZero
function addressToBytes32(address) {
  return zeroPadValue(getAddress(address), 32);
}

// Official LayerZero V2 EIDs for testnets
const EIDS = {
  sepolia: 40161,
  bsctestnet: 40102,
  arbitrumsepolia: 40231,
  basesepolia: 40221,
  fuji: 40106,
};

// ✅ Correct deployed WrappedTokenBridge addresses
const PEERS = {
  sepolia: {
    address: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
    peers: {
      bsctestnet: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
      arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
      basesepolia: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
      fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    },
  },
  bsctestnet: {
    address: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
    peers: {
      sepolia: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
      arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
      basesepolia: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
      fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    },
  },
  arbitrumsepolia: {
    address: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
    peers: {
      sepolia: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
      bsctestnet: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
      basesepolia: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
      fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    },
  },
  basesepolia: {
    address: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
    peers: {
      sepolia: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
      bsctestnet: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
      arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
      fuji: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    },
  },
  fuji: {
    address: "0x1524E0cA3E84F6D21F087084BcaBaf59b7a5efDf",
    peers: {
      sepolia: "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC",
      bsctestnet: "0xFF7bEe934E12ec8cCDFB1e974E0036fc2d42c8D2",
      arbitrumsepolia: "0x6c5D31455e039Fc71aA22E4E2FA37398a09c1694",
      basesepolia: "0xeC894579F24b75136b98b87193C05097a9d85c8a",
    },
  },
};

async function main() {
  const network = hre.network.name;
  const config = PEERS[network];

  if (!config) throw new Error(`❌ No config for network: ${network}`);

  const bridge = await hre.ethers.getContractAt("WrappedTokenBridge", config.address);
  console.log(`🔗 Setting peers for ${network} bridge at ${config.address}`);

  for (const [peerName, peerAddr] of Object.entries(config.peers)) {
    const peerEid = EIDS[peerName];
    const peerBytes32 = addressToBytes32(peerAddr);

    try {
      const tx = await bridge.setPeer(peerEid, peerBytes32);
      await tx.wait();
      console.log(`✅ Set peer ${peerName} (${peerAddr})`);
    } catch (err) {
      console.error(`❌ Failed to set peer ${peerName}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
