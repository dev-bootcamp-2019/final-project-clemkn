var Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {

  /*
   * This test ensures that the marketplace contract creator
   * is correctly set as the first admin on the marketplace.
   * This is important because only admins are allowed to
   * take specific actions like add store owners from requests.
   */
  it("should set an admin to the marketplace.", function() {
    return Marketplace.deployed()
      .then(instance => instance.admins.call(accounts[0]))
      .then(isAdmin => assert.equal(isAdmin, true, "The marketplace contract creator was not set as an admin."));
  });

  /*
   * This test ensures that an admin can add a new admin on the marketplace.
   * This is important because only admins are allowed to
   * take specific actions like add store owners from requests.
   */
  it("should add an admin.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.addAdmin.sendTransaction(accounts[3], {from: accounts[0]});
    })
    .then(() => marketplaceInstance.admins.call(accounts[3]))
    .then(isAdmin => assert.equal(isAdmin, true, "The admin address was not stored correctly."));
  });

  /*
   * This test ensures that admins are able to
   * convert users to store owners.
   */
  it("should add a store owner.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.addStoreOwner.sendTransaction(accounts[1], {from: accounts[0]});
    })
    .then(() => marketplaceInstance.storeOwners.call(accounts[1]))
    .then(isStoreOwner => assert.equal(isStoreOwner, true, "The store owner request address was not stored correctly."));
  });

  /*
   * This test ensures that a store owner can create a new
   * store contract instance.
   */
  it("should create a new store by the store owner.", function() {
    let marketplaceInstance;
    return Marketplace.deployed().then(instance => {
      marketplaceInstance = instance;
      return marketplaceInstance.createNewStore.sendTransaction('Store name', 'Store description', {from: accounts[1]});
    })
    .then(() => marketplaceInstance.getStoreAddressesByOwner.call({from: accounts[1]}))
    .then(stores => assert.equal(stores.length, 1, "Store was not created correctly."));
  });

  /*
   * This test ensures that the admin users are correctly identified
   * in order to display the appropriate UI.
   */
  it("should recognize address as an admin user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[0]}) })
      .then(userRole => assert.equal(userRole, "admin", "The address is not reconize as admin."));
  });

  /*
   * This test ensures that the store owners are correctly identified
   * in order to display the appropriate UI.
   */
  it("should recognize address as a store owner user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[1]}) })
      .then(userRole => assert.equal(userRole, "storeOwner", "The address is not reconize as storeOwner."));
  });

  /*
   * This test ensures that the regular users are correctly identified
   * in order to display the appropriate UI.
   */
  it("should recognize address as a regular user.", function() {
    return Marketplace.deployed()
      .then(instance => { return instance.getUserRole.call({from: accounts[2]}) })
      .then(userRole => assert.equal(userRole, "regular", "The address is not reconize as regular."));
  });

});
