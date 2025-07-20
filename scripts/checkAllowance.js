const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();

  // Replace with token and bridge address of the chain you're checking
  const tokenAddress = "0xa06962C1d1992b270330A84B808D5459D70B34C8"; // USDT on Sepolia
  const bridgeAddress = "0x1CE5ED576F57B40289D84851aB1ac87649e2ACbC"; // Bridge on Sepolia

  const token = await ethers.getContractAt("IERC20", tokenAddress);

  const allowance = await token.allowance(signer.address, bridgeAddress);
  console.log(`Allowance from ${signer.address} to ${bridgeAddress}: ${allowance.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
