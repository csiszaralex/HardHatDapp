// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import 'hardhat/console.sol';

contract Ballot {
  struct Voter {
    // uint weight;
    bool voted;
    uint vote;
  }

  struct Proposal {
    bytes32 name;
    uint voteCount;
  }

  error TooEarly(uint time);
  error TooLate(uint time);

  modifier onlyBeforeEnd() {
    //TODO
    if (block.timestamp >= endTime) revert TooLate(endTime);
    _;
  }
  modifier onlyAfterEnd() {
    if (block.timestamp <= endTime - createTime) revert TooEarly(endTime);
    _;
  }

  mapping(address => Voter) public voters;
  Proposal[] public proposals;
  bytes32 public name;
  uint private createTime;
  uint public startTime;
  uint public endTime;

  constructor(bytes32[] memory proposalNames, bytes32 n, uint currentTime, uint from, uint to) {
    name = n;
    createTime = currentTime;
    startTime = createTime + from;
    endTime = startTime + to;

    for (uint i = 0; i < proposalNames.length; i++) {
      proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
    }
  }

  function vote(uint proposal) external onlyBeforeEnd {
    Voter storage sender = voters[msg.sender];
    console.log('ITT');
    // require(sender.weight != 0, 'Has no right to vote');
    require(!sender.voted, 'Already voted.');
    sender.voted = true;
    sender.vote = proposal;

    proposals[proposal].voteCount += 1;
    // proposals[proposal].voteCount += sender.weight;
  }

  function amIVoted() public view returns (bool) {
    return voters[msg.sender].voted;
  }

  function getProposalsCount() public view returns (uint) {
    return proposals.length;
  }

  function winningProposal() public view onlyAfterEnd returns (uint winningProposal_) {
    uint winningVoteCount = 0;
    for (uint p = 0; p < proposals.length; p++) {
      if (proposals[p].voteCount > winningVoteCount) {
        winningVoteCount = proposals[p].voteCount;
        winningProposal_ = p;
      }
    }
  }

  function winnerName() public view onlyAfterEnd returns (bytes32 winnerName_) {
    winnerName_ = proposals[winningProposal()].name;
  }
}
