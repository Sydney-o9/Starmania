# Starmania

I have called this project `Starmania`. Here are infos about the ERC-721 token I have created:

- ERC-721 Token Name: `Starmania Token`
- ERC-721 Token Symbol: `ST`

Also, the contract address on the Rinkeby Network:

- `0x2f88A89cc270b9c0107538bE92460af29D06fC33`

See on [Rinkeby Etherscan](https://rinkeby.etherscan.io/address/0x2f88A89cc270b9c0107538bE92460af29D06fC33)

Finally I have created 4 stars:

- Star id `1`, named `Udacity Star`, owned by `0xA9e39Ed28cBd782d66Ec76700E5F4B5B2031778C`
- Star id `2`, named `Toto Star`, owned by `0x314ddeAeEB51187cE9833bb9A7bFd1cA898F3b9A`
- Star id `3`, named `Cam Star`, owned by `0xe02Fb45C99D8e5A2F2037a35F4D1b1f2b79062AE`
- Star id `4`, named `Matt Star`, owned by `0xA9e39Ed28cBd782d66Ec76700E5F4B5B2031778C`

See [Deployment Information](#deployment-information-on-rinkeby) below for more information about the deployment on the Rinkeby network.

## Demo

![Demo](doc/MyFirstDApp.gif)

## Versions

- Truffle v5.1.61 (core: 5.1.61)
- Solidity v0.5.16 (solc-js)
- Node v12.16.1
- Web3.js v1.2.9
- OpenZeppelin v2.1.2

## Deployment Information on Rinkeby

```
   Deploying 'StarNotary'
   ----------------------
   > transaction hash:    0x8f79b7aec12dea7f65392825c9333b04fc52179c4b4d1235cb8dfe317fc4fdeb
   > Blocks: 1            Seconds: 9
   > contract address:    0x2f88A89cc270b9c0107538bE92460af29D06fC33
   > block number:        7892542
   > block timestamp:     1610615873
   > account:             0xA9e39Ed28cBd782d66Ec76700E5F4B5B2031778C
   > balance:             0.97734516
   > gas used:            1997884 (0x1e7c3c)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.01997884 ETH
```

## Preliminary Notes

Please note the following:

- To be able to assert additional scenarios, I am using [truffle-assertions](https://github.com/rkalis/truffle-assertions)

As an example, this allows us to test reversion if a star does not exist:

```
await truffleAssert.reverts(
    instance.lookUptokenIdToStarInfo(imaginaryStarId),
    "This star does not exist."
    );
```

- To exchange stars, it was suggested to use the `_transferFrom` method which is unsafe, I have followed the instructions. It seems it would have been a good idea to use `safeTransferFrom` instead to transfer ownership of the tokens. Most importantly, it may have been preferable to have approval from the owner before proceeding with the transfer. Hence `_transferFrom` is quite dangerous, and at least `transferFrom` should have been used. To do this, we would have had to create a function to approve the transfer of a star for a period of time. Once granted approval, the transfer can be started by the other owner. 

- When writing tests, I have created 2 new test cases to ensure `revert` happens in critical security scenarios i.e. the unhappy paths. These are `it('does not let a user exchange a star he/she does not own', ..` and `it('does not let a user transfer a star he/she does not own', ..)`.

- I am using Port 8545 locally