pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract Store {

  address payable public owner;
  string public name;
  string public description;
  mapping (uint256 => Item) public itemsBySku;
  uint256 public latestSku;

  /* Struct */
  struct Item {
    uint sku;
    uint stockCount;
    uint price;
    string name;
    string description;
  }

  /* Events */
  event LogNewItemAdded(string name, string description, uint256 indexed sku, uint256 price);
  event LogStockCountUpdated(uint256 indexed sku, uint256 newStockCount);
  event LogPurchaseMade(uint256 indexed sku, uint256 quantity);

  /* Modifiers */
  modifier isOwner() {
    require(msg.sender == owner, "This action can only be performed by the store owner.");
    _;
  }

  modifier isSkuExists(uint256 sku) {
    require(SafeMath.sub(latestSku, sku) >= 0, "This item does not exist in this store.");
    _;
  }

  modifier enoughStockAvailable(uint256 sku, uint256 quantity) {
    require(SafeMath.sub(itemsBySku[sku].stockCount, quantity) >= 0, "Not enough inventory left.");
    _;
  }

  modifier enoughEthSent(uint256 sku, uint256 quantity) {
      require(msg.value >= SafeMath.mul(itemsBySku[sku].price, quantity), "Not enough Ether provided.");

      _;

      if (msg.value > SafeMath.mul(itemsBySku[sku].price, quantity)) {
        msg.sender.transfer(SafeMath.sub(msg.value, SafeMath.mul(itemsBySku[sku].price, quantity)));
      }
  }

  /* Constructor */
  constructor(address payable _owner, string memory _name, string memory _description)
    public
  {
    owner = _owner;
    name = _name;
    description = _description;
    latestSku = 0;
  }

  function addNewItem(string memory _name, string memory _description, uint256 _price)
    public
    isOwner
  {
    Item memory newItem = Item({
        sku: SafeMath.add(latestSku, 1),
        stockCount: 0,
        price: _price,
        name: _name,
        description: _description
    });

    itemsBySku[SafeMath.add(latestSku, 1)] = newItem;
    latestSku = SafeMath.add(latestSku, 1);
    emit LogNewItemAdded(newItem.name, newItem.description, newItem.sku, newItem.price);
  }

  function updateStockCount(uint256 _sku, uint256 newStockCount)
    public
    isSkuExists(_sku)
    isOwner
  {
    itemsBySku[_sku].stockCount = newStockCount;
    emit LogStockCountUpdated(_sku, newStockCount);
  }

  function buyItem(uint256 _sku, uint256 quantity)
    public
    payable
    isSkuExists(_sku)
    enoughStockAvailable(_sku, quantity)
    enoughEthSent(_sku, quantity)
  {
    itemsBySku[_sku].stockCount = SafeMath.sub(itemsBySku[_sku].stockCount, quantity);
    emit LogPurchaseMade(_sku, quantity);
  }

  function withdraw()
    public
    payable
    isOwner
  {
    owner.transfer(address(this).balance);
  }

}
