import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-web3-v4';
import { HardhatUserConfig, task } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
};

task('accounts', 'Prints accounts', async (_, { web3 }) => {
  console.log(await web3.eth.getAccounts());
});

task('accounts2', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;

