const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const T_TREASURY = "0x0000000000000000000000000000000000000000"; // Replace with Treasury Address
  const USDC_ADDRESS = "0x036cb97fabe1f1b64e40e115c940e74c2d751183"; // Base Mainnet USDC (Example)
  
  const Custody = await ethers.getContractFactory("Custody");
  const custody = await Custody.deploy(T_TREASURY, USDC_ADDRESS);

  await custody.deployed();

  console.log("Custody contract deployed to:", custody.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
