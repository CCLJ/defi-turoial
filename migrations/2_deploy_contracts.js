const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

// migrate blockchain - add new smart contracts to the blockchain
// accounts = the ones shown on ganache
module.exports = async function(deployer, network, accounts) {
  // deploy mock DAI Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // deploy dapp token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // transfer dapp tokens to token farm; these will be used as the reward from the farm
  // when someone stakes a dai token
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000'); // 1 million with 18 decimals 0's

  // transfer 100 dai tokens to an investor (one of the accounts on ganache)
  await daiToken.transfer(accounts[1], '100000000000000000000');
}
