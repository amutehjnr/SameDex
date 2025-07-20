const hre = require("hardhat");

const endpoints = {
  sepolia:        { eid: 40161, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
  polygonamoy:    { eid: 40231, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
  bsctestnet:     { eid: 40102, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
  arbitrumsepolia:{ eid: 40232, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
  fuji:           { eid: 40106, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
  basesepolia:    { eid: 40230, endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" },
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  const config = endpoints[networkName];

  if (!config) {
    console.error(`❌ No endpoint config for network: ${networkName}`);
    process.exit(1);
  }

  console.log(`🚀 Deploying WrappedTokenBridge to ${networkName}...`);

  const WrappedTokenBridge = await hre.ethers.getContractFactory("WrappedTokenBridge");
  const bridge = await WrappedTokenBridge.deploy(config.endpoint, deployer.address);
  await bridge.waitForDeployment();

  console.log(`✅ Deployed at: ${await bridge.getAddress()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
