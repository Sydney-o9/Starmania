# Starmania

## Preliminary Notes

Please note the following:

- To be able to assert additional scenarios, I am using [truffle-assertions](https://github.com/rkalis/truffle-assertions)

As an example, this allows me to test reversion if a star does not exist:

```
await truffleAssert.reverts(
    instance.lookUptokenIdToStarInfo(imaginaryStarId),
    "This star does not exist."
    );
```

- To exchange stars, it was suggested to use the `_transferFrom` method which is unsafe, I have followed the instructions. It seems it would have been a good idea to use `safeTransferFrom` instead to transfer ownership of the tokens. Most importantly, it may have been preferable to have approval from the owner before proceeding with the transfer. Hence `_transferFrom` is quite dangerous, and at least `transferFrom` should have been used. To do this, we would have had to create a function to approve the transfer of a star for a period of time. Once granted approval, the transfer can be started by the other owner. 

## Task 1

- [x] Added `name` and `symbol` properties to `StarNotary`
- [x] Wrote tests for it

- [x] Added a function `lookUptokenIdToStarInfo`, that looks up the stars using the Token ID, and then returns the name of the star.

- [x] OPTIONAL: Created a modifier `starExists(unit _tokenId)` and modified function signature for `lookUptokenIdToStarInfo` to use this modifier