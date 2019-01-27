var Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {

  it("should set an admin to the marketplace.", function() {
    return Marketplace.deployed()
      .then(instance => instance.admins.call(accounts[0]))
      .then(isAdmin => assert.equal(isAdmin, true, "The marketplace contract creator was not set as an admin."));
  });

  it("should add an admin.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.addAdmin.sendTransaction(accounts[3], {from: accounts[0]});
    })
    .then(() => marketplaceInstance.admins.call(accounts[3]))
    .then(isAdmin => assert.equal(isAdmin, true, "The admin address was not stored correctly."));
  });

  it("should add a store owner.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.addStoreOwner.sendTransaction(accounts[1], {from: accounts[0]});
    })
    .then(() => marketplaceInstance.storeOwners.call(accounts[1]))
    .then(isStoreOwner => assert.equal(isStoreOwner, true, "The store owner request address was not stored correctly."));
  });

  it("should create a new store by the store owner.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.createNewStore.sendTransaction('Store name', 'Store description', {from: accounts[1]});
    })
    .then(() => marketplaceInstance.getStoreAddressesByOwner.call({from: accounts[1]}))
    .then(stores => assert.equal(stores.length, 1, "Store was not created correctly."));
  });

  it("should reconize address as an admin user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[0]}) })
      .then(userRole => assert.equal(userRole, "admin", "The address is not reconize as admin."));
  });

  it("should reconize address as a store owner user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[1]}) })
      .then(userRole => assert.equal(userRole, "storeOwner", "The address is not reconize as storeOwner."));
  });

  it("should reconize address as a regular user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[2]}) })
      .then(userRole => assert.equal(userRole, "regular", "The address is not reconize as regular."));
  });

});
