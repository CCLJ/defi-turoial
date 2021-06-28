pragma solidity ^0.5.0; // solidity does not handle decimals

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance; // a hash essentially
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // runs once when a smart contract is deployed to the blockchain
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // 1. Stake tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // transfer dai tokens from investors wallet to this smart contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add user to stakers array if it's first time staking
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
}