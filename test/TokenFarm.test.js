const { assert } = require('chai');

// mocha testing library and chai assertion library
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

function tokens(n) {
  return web3.utils.toWei(n, 'Ether')
}

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', ([owner, investor]) => {
  // write tests here, trying to replicate migrations
  // owner: person who deployed dai token to network
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // load contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // transfer all Dapp Tokens to token farm - 1M
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // transfer to investor - adding from: for better test self explanation
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Moch Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Dapp deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    it('contract has tokens transferred', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance, tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      let result
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor mDai balance correct before staking')

      // approving is done in test only, and in frontend app
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor mDai balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm mDai balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result, true, 'investor staking status correct after staking')
    })
  })
})