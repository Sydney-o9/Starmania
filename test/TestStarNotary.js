const StarNotary = artifacts.require("StarNotary");
const truffleAssert = require('truffle-assertions');

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let starId = 6;
    let user1 = accounts[1];
    await instance.createStar('awesome star', starId, {from: user1});

    // 2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    // [STUDENT] Make sure the name is correct
    assert.equal(await instance.name(), "Starmania Token");
    // [STUDENT] Make sure the symbol is correct
    assert.equal(await instance.symbol(), "ST");
});

it('lookUptokenIdToStarInfo test', async() => {

    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let starId = 7;
    let user1 = accounts[1];
    await instance.createStar('Toto Star', starId, {from: user1});

    // 2. Call your method lookUptokenIdToStarInfo
    let name = await instance.lookUptokenIdToStarInfo(starId);

    // 3. Verify if you Star name is the same
    assert.equal(name, "Toto Star");
});

it("should not be able to lookUptokenIdToStarInfo if star does not exist", async () => {

    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let imaginaryStarId = 404;
    let user1 = accounts[1];

    await truffleAssert.reverts(
        instance.lookUptokenIdToStarInfo(imaginaryStarId),
        "This star does not exist."
    );
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();

    // 1. create 2 Stars with different tokenId
    let starId1 = 9;
    let user1 = accounts[1];
    await instance.createStar('First Star', starId1, {from: user1});

    let starId2 = 10;
    let user2 = accounts[2];
    await instance.createStar('Second Star', starId2, {from: user2});

    // Sanity Check, we verify the owners are correct to begin with
    assert.equal(await instance.ownerOf.call(starId1), user1);
    assert.equal(await instance.ownerOf.call(starId2), user2);

    // 2. Call the exchangeStars functions implemented in the Smart Contract
    instance.exchangeStars(starId1, starId2, {from: user1}),

    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf.call(starId1), user2);
    assert.equal(await instance.ownerOf.call(starId2), user1);

});

it('does not let a user exchange a star he/she does not own', async() => {
    let instance = await StarNotary.deployed();

    // We create 2 Stars with different tokenId
    let starId1 = 11;
    let user1 = accounts[1];
    await instance.createStar('First Star', starId1, {from: user1});

    let starId2 = 12;
    let user2 = accounts[2];
    await instance.createStar('Second Star', starId2, {from: user2});

    let naughtyExchanger = accounts[3];

    // We call the exchangeStars functions implemented in the Smart Contract
    // And verify it failed
    await truffleAssert.reverts(
        instance.exchangeStars(starId1, starId2, {from: naughtyExchanger}),
        "Only the owner of one of the stars can exchange stars with someone else."
    );

    // We make sure the stars are still well guarded in their respective wallets
    assert.equal(await instance.ownerOf.call(starId1), user1);
    assert.equal(await instance.ownerOf.call(starId2), user2);
});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();

    // 1. create a Star with different tokenId
    let starId1 = 13;
    let user1 = accounts[1];
    await instance.createStar('A Star', starId1, {from: user1});

    // Sanity Check, we verify the owners are correct to begin with
    assert.equal(await instance.ownerOf.call(starId1), user1);

    // 2. use the transferStar function implemented in the Smart Contract
    let user2 = accounts[2];
    instance.transferStar(user2, starId1, {from: user1}),

    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(starId1), user2);
});

it('does not let a user transfer a star he/she does not own', async() => {
    let instance = await StarNotary.deployed();

    // 1. create a Star with different tokenId
    let starId1 = 14;
    let user1 = accounts[1];
    await instance.createStar('A Star', starId1, {from: user1});

    // Sanity Check, we verify the owners are correct to begin with
    assert.equal(await instance.ownerOf.call(starId1), user1);

    // 2. use the transferStar function implemented in the Smart Contract
    let thief = accounts[2];

    // We verify the transfer failed as the transferer is not the owner
    await truffleAssert.reverts(
        instance.transferStar(user1, starId1, {from: thief}),
        "Only the owner can transfer its stars to someone else."
    );

    // We make sure the star is still well guarded in user1's wallet
    assert.equal(await instance.ownerOf.call(starId1), user1);
});