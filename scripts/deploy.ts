import { ethers, web3 } from 'hardhat';
// import {abi as BallotController} from '../artifacts/contracts/BallotController.sol/BallotController.json';
import { ContractTransactionResponse } from 'ethers';
import fs from 'fs';

async function main() {
  const dones = { ballot: '' };
  const ballot = await ethers.deployContract('Ballot', [
    [
      web3.utils.padRight(web3.utils.asciiToHex('Proposal A'), 64),
      web3.utils.padRight(web3.utils.asciiToHex('Bela'), 64),
      web3.utils.padRight(web3.utils.asciiToHex('Cili'), 64),
      //0x50726f706f73616c204100000000000000000000000000000000000000000000
      //0x50726f706f73616c2041000000000000000000000000000000000000000000
    ],
    web3.utils.padRight(web3.utils.asciiToHex('Who is the best?'), 64),
    new Date().getTime(),
    600,
    600000,
  ]);
  await ballot.waitForDeployment();
  dones.ballot = await ballot.getAddress();
  console.log(`Ballott deployed to ${ballot.target}`);

  const str = JSON.stringify(dones);
  fs.writeFileSync('dones.json', str);
}

async function mainx() {
  //Create a BallotController contract
  const ballotController = ({} = await ethers.deployContract('BallotController'));
  await ballotController.waitForDeployment();
  await ballotController.setCreationHonor(3);

  console.log(`BallotController deployed to ${ballotController.target}, and set creation honor to 3`);

  //Create a Ballot with Ballott Controller
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ballot: ContractTransactionResponse = await ballotController.createBallot(
    [
      '0x50726f706f73616c204100000000000000000000000000000000000000000000',
      '0x50726f706f73616c204200000000000000000000000000000000000000000000',
      '0x50726f706f73616c204300000000000000000000000000000000000000000000',
    ],
    currentTimestampInSeconds + 60,
    120,
  );
  console.log(ballot);

  // const b = await ethers.getContractAt("Ballot", ballot);
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
    `Lock with ${ethers.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`,
  );
}
async function mainb() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = web3.utils.toWei('0.001', 'ether');
  const [deployer] = await web3.eth.getAccounts();
  // const lockContract = new web3.eth.Contract(lockS.abi);
  // const rawContract = lockContract.deploy({
  //   data: lockS.bytecode,
  //   arguments: [unlockTime],
  // });

  // const lock = await rawContract.send({
  //   from: deployer,
  //   gasPrice: '10000000000',
  //   value: lockedAmount.toString(),
  // });

  // console.log(
  //   `Lock with ${web3.utils.fromWei(lockedAmount, 'ether')}ETH and unlock timestamp ${unlockTime} deployed to ${
  //     lock.options.address
  //   }`,
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
