import { ethers } from "hardhat";

import * as dotenv from 'dotenv'
dotenv.config()
const {CRYPTO_DEV_TOKEN_ADDRESS} = require('../constants')

const main = async () => {

  const cryptoDevTokenAdress = CRYPTO_DEV_TOKEN_ADDRESS

  const exchangeContract = await ethers.getContractFactory('Exchange');

  const deployedExchange = await exchangeContract.deploy(cryptoDevTokenAdress)

  await deployedExchange.deployed()

  console.log('Exchange Contract Address: ',deployedExchange.address)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
