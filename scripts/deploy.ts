import { ethers, web3 } from 'hardhat';
import artifacts from '../artifacts/contracts/Lock.sol/Lock.json';

async function maina() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = ethers.parseEther('0.001');

  const lock = await ethers.deployContract('Lock', [unlockTime], {
    value: lockedAmount,
  });
  await lock.waitForDeployment();
  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}
async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = web3.utils.toWei('0.001', 'ether');
  const [deployer] = await web3.eth.getAccounts();
  const lockContract = new web3.eth.Contract(artifacts.abi);
  const rawContract = lockContract.deploy({
    data: artifacts.bytecode,
    arguments: [unlockTime],
  });



  const lock = await rawContract.send({
    from: deployer,
    gasPrice: '10000000000',
    value: lockedAmount.toString(),
  });

  console.log(
    `Lock with ${web3.utils.fromWei(
      lockedAmount,
      'ether'
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.options.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

