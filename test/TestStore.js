var Store = artifacts.require("./Store.sol");

contract('Store', function(accounts) {

  let storeInstance;

  before(() => Store.new(accounts[1], 'Store name', 'Store description')
    .then(instance => storeInstance = instance)
  );

  it("should set the right owner.", function() {
    return storeInstance.owner.call()
      .then(owner => assert.equal(owner, accounts[1], "The store owner is not the right owner."));
  });

  it("should let the store owner create a new item", function() {
    return storeInstance.addNewItem.sendTransaction('Item name', 'Item description', 1, {from: accounts[1]})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[0].toNumber(), 1, "Sku is incorrect");
      })
  });

  it("should allow store owner to add inventory to an existing product.", function() {
    return storeInstance.updateStockCount.sendTransaction(1, 3, {from: accounts[1]})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[1].toNumber(), 3, "Product's inventory was not updated correctly.");
      });
  });

  it("should allow a shopper to purchase a product from the store, and product balance reduces by correct amount.", function() {
    return storeInstance.buyItem.sendTransaction(1, 3, {value: 3})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[1].toNumber(), 0, "Product's inventory was not updated after a sale correctly.");
      });
  });

});
