var Store = artifacts.require("./Store.sol");

contract('Store', function(accounts) {

  let storeInstance;

  /*
   * We need to create a new instance of
   * the store to perform the tests below.
   */
  before(() => Store.new(accounts[1], 'Store name', 'Store description')
    .then(instance => storeInstance = instance)
  );

  /*
   * This test ensures that the store contract creator
   * is correctly set as the owner of the store.
   */
  it("should set the right owner.", function() {
    return storeInstance.owner.call()
      .then(owner => assert.equal(owner, accounts[1], "The store owner is not the right owner."));
  });

  /*
   * This test ensures that a store owner can create
   * a new item in the store.
   */
  it("should let the store owner create a new item", function() {
    return storeInstance.addNewItem.sendTransaction('Item name', 'Item description', 1, {from: accounts[1]})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[0].toNumber(), 1, "Sku is incorrect");
      })
  });

  /*
   * This test ensures that the store owner can update
   * the stock for an existing item.
   */
  it("should allow store owner to update stock to an existing product.", function() {
    return storeInstance.updateStockCount.sendTransaction(1, 3, {from: accounts[1]})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[1].toNumber(), 3, "Item's stock was not updated correctly.");
      });
  });

  /*
   * This test ensures that the stock for an existing item
   * is updated after a sale.
   */
  it("should allow a shopper to purchase a product from the store, and product balance reduces by correct amount.", function() {
    return storeInstance.buyItem.sendTransaction(1, 3, {value: 3})
      .then(() => storeInstance.itemsBySku.call(1))
      .then(item => {
        assert.equal(item[1].toNumber(), 0, "Item's stock was not updated after a sale correctly.");
      });
  });

});
