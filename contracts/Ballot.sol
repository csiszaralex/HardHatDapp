// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Voting with delegation.
contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    mapping(address => uint) public tokens;
    Proposal[] public proposals;
    uint public end;


    constructor(bytes32[] memory proposalNames, uint end) {
        chairperson = msg.sender;
        end = end;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, 'Only chairperson can give right to vote.');
        require(!voters[voter].voted, 'The voter already voted.');
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    function vote(uint proposal) external {
        require(block.timestamp < end, 'Voting is closed.');
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, 'Has no right to vote');
        require(!sender.voted, 'Already voted.');
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposal_) {
        require(block.timestamp >= end, 'Voting is not yet closed.');
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        require(block.timestamp >= end, 'Voting is not yet closed.');
        winnerName_ = proposals[winningProposal()].name;
    }
}
