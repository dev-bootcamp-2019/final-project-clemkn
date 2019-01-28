pragma solidity ^0.5.0;

import "./SafeMath.sol";

/** @title Store. */
contract Store {

  address payable public owner;
  string public name;
  string public description;
  mapping (uint256 => Item) public itemsBySku;
  uint256 public latestSku;
  bool public stopped = false;

  /* Struct Item */
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
  event LogContractStateToggled(bool isStopped);

  /** @dev Check if sender is owner. */
  modifier isOwner() {
    require(msg.sender == owner, "This action can only be performed by the store owner.");
    _;
  }

  /** @dev Check if sku exists. */
  modifier isSkuExists(uint256 sku) {
    require(SafeMath.sub(latestSku, sku) >= 0, "This item does not exist in this store.");
    _;
  }

  /** @dev Check if enough stock is available */
  modifier enoughStockAvailable(uint256 sku, uint256 quantity) {
    require(SafeMath.sub(itemsBySku[sku].stockCount, quantity) >= 0, "Not enough stock left.");
    _;
  }

  /** @dev Check if enough eth is sent. */
  modifier enoughEthSent(uint256 sku, uint256 quantity) {
      require(msg.value >= SafeMath.mul(itemsBySku[sku].price, quantity), "Not enough eth provided.");

      _;

      if (msg.value > SafeMath.mul(itemsBySku[sku].price, quantity)) {
        msg.sender.transfer(SafeMath.sub(msg.value, SafeMath.mul(itemsBySku[sku].price, quantity)));
      }
  }

  /** @dev Check the string length */
  modifier isStringLengthEnough(string memory str) {
    require(bytes(str).length <= 32, "String is too short");
    _;
  }

  /** @dev Don't execute in emergency */
  modifier stopInEmergency {
    if (!stopped) {
      _;
    }
  }

  /** @dev Execute in emergency */
  modifier onlyInEmergency {
    if (stopped) {
      _;
    }
  }


  /** @dev Init the Store contract.
    * @param _owner Adress of the owner account.
    * @param _name Name of the store.
    * @param _description Description of the store.
    */
  constructor(address payable _owner, string memory _name, string memory _description)
    public
    isStringLengthEnough(_name)
    isStringLengthEnough(_description)
  {
    owner = _owner;
    name = _name;
    description = _description;
    latestSku = 0;
  }

  /** @dev Add a new item to the current store.
    * @param _name Name of the item.
    * @param _description Description of the item Height of the rectangle.
    * @param _price Price of the item (wei).
    */
  function addNewItem(string memory _name, string memory _description, uint256 _price)
    public
    isOwner
    isStringLengthEnough(_name)
    isStringLengthEnough(_description)
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

  /** @dev Update the stock count of an item.
    * @param _sku Sku to identify the item.
    * @param newStockCount New stock count for the item.
    */
  function updateStockCount(uint256 _sku, uint256 newStockCount)
    public
    isSkuExists(_sku)
    isOwner
  {
    itemsBySku[_sku].stockCount = newStockCount;
    emit LogStockCountUpdated(_sku, newStockCount);
  }

  /** @dev Buy an item.
    * @param _sku Sku to identify the item.
    * @param quantity Quantity to buy.
    */
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

  /** @dev Withdraw funds. */
  function withdraw()
    public
    payable
    isOwner
  {
    owner.transfer(address(this).balance);
  }

  /** @dev Owner can toggle contract in case of emergency. */
  function toggleContractActive()
    public
    isOwner
  {
      stopped = !stopped;
      emit LogContractStateToggled(stopped);
  }

}
