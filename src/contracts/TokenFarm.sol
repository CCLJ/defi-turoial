pragma solidity ^0.5.0; // solidity does not handle decimals

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance; // a hash essentially
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // runs once when a smart contract is deployed to the blockchain
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stake tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // require, false => stop execution raising exception with custom message
        require(_amount > 0, "amount must be greater than 0");

        // transfer dai tokens from investors wallet to this smart contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add user to stakers array if it's first time staking
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender); // to later reward them
        }

        // update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // 2. Issues dapp reward tokens for staking
    function issueTokens() public {
        // allow only owner of contract to issue tokens
        require(msg.sender == owner, "caller must be the owner");

        for(uint iterator = 0; iterator < stakers.length; iterator++) {
            address recipient = stakers[iterator];
            uint balance = stakingBalance[recipient];

            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}