// // SPDX-License-Identifier: GPL-3.0
// pragma solidity >=0.7.0 <0.9.0;

// import './Ballot.sol';

// contract BallotController {
//   struct B {
//     address creator;
//     uint from;
//     uint to;
//     uint voteHonor;
//   }

//   address public owner;
//   uint public createHonor;
//   mapping(address => uint) public balances;
//   mapping(address => B) contracts;

//   error OnlyOwner();
//   error ContractNotExistent();
//   error ThisBallotAlreadyStarted();
//   error OnlyCreator();

//   modifier onlyOwner() {
//     if (msg.sender != owner) revert OnlyOwner();
//     _;
//   }
//   modifier contractNeedExist(address c) {
//     if (contracts[c].voteHonor == 0) revert ContractNotExistent();
//     _;
//   }
//   modifier contractNotStarted(address c) {
//     if (contracts[c].voteHonor == 0) revert ContractNotExistent();
//     if (contracts[c].from < block.timestamp) revert ThisBallotAlreadyStarted();
//     _;
//   }
//   modifier onlyCreator(address c) {
//     if (owner == msg.sender) _; //BUG We want it?
//     if (contracts[c].creator != msg.sender) revert OnlyCreator();
//     _;
//   }

//   constructor() {
//     owner = msg.sender;
//     createHonor = 2;
//   }

//   function setOwner(address newOwner) external onlyOwner {
//     owner = newOwner;
//   }

//   function setCreationHonor(uint amount) external onlyOwner {
//     createHonor = amount;
//   }

//   function createBallot(bytes32[] memory proposalNames, uint from, uint to) external returns (uint) {
//     //TODO Has rights to create a ballot
//     uint start = block.timestamp + from;
//     uint end = start + to;
//     Ballot b = new Ballot(proposalNames, start, end);
//     contracts[address(b)] = B(msg.sender, from, to, 1);

//     balances[msg.sender] += createHonor;
//     return 52;
//     // return address(b);
//   }

//   function setContractVoteHonor(address c, uint amount) external contractNotStarted(c) onlyCreator(c) {
//     contracts[c].voteHonor = amount;
//   }

//   function vote(address addr, uint proposal) external contractNeedExist(addr) {
//     Ballot ballot = Ballot(addr);
//     //TODO Has rights to vote
//     ballot.vote(msg.sender, proposal);
//     balances[msg.sender] += contracts[addr].voteHonor;
//   }
// }
