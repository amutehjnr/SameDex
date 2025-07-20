const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const name = process.env.TOKEN_NAME || "Tether USD";
  const symbol = process.env.TOKEN_SYMBOL || "USDT";

  const Token = await hre.ethers.getContractFactory("MintBurnERC20");
  const token = await Token.deploy(name, symbol);
  await token.waitForDeployment();

  console.log(`✅ Deployed ${symbol} at: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
