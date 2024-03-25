import { ethers, web3 } from 'hardhat';
import lockS from '../artifacts/contracts/Lock.sol/Lock.json';

async function main() {
  const counter = await ethers.deployContract('Ballot', [
    [
      '0x50726f706f73616c204100000000000000000000000000000000000000000000',
      '0x50726f706f73616c204200000000000000000000000000000000000000000000',
      '0x50726f706f73616c204300000000000000000000000000000000000000000000',
    ],
  ]);
  await counter.waitForDeployment();
  console.log(`Ballott deployed to ${counter.target}, address: ${await counter.getAddress()}`);

  const ct = await ethers.deployContract('Counter');
  await ct.waitForDeployment();
  console.log(`Counter deployed to ${ct.target}, address: ${await ct.getAddress()}`);

  // counter.proposals
}
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
async function mainb() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = web3.utils.toWei('0.001', 'ether');
  const [deployer] = await web3.eth.getAccounts();
  const lockContract = new web3.eth.Contract(lockS.abi);
  const rawContract = lockContract.deploy({
    data: lockS.bytecode,
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

