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

  // owner: person who deployed dai token to network
contract('TokenFarm', ([owner, investor]) => {
  // write tests here, trying to replicate migrations
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
})