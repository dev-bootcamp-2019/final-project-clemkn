pragma solidity ^0.5.0;

import './Store.sol';

contract Marketplace {

  address[] public adminsList;
  address[] public storeOwnersList;
  mapping (address => bool) public admins;
  mapping (address => bool) public storeOwners;
  mapping (address => address[]) public storeAddressesByOwner;

  /* Events */
  event LogAdminAdded(address indexed _admin);
  event logAdminDeleted(address indexed _admin);
  event LogStoreOwnerAdded(address indexed _storeOwner);
  event LogStoreOwnerDeleted(address indexed _storeOwner);
  event LogNewStoreCreated(address owner, address store);

  /* Modifiers */
  modifier isAdmin(bool _exists) {
    require(_exists, "This function is only available to admins");
    _;
  }

  modifier isStoreOwner(bool _exists) {
      require(_exists, "This function is only available to store owners");
      _;
  }

  /* Functions */
  function addAdmin(address _newAdmin)
    public
    isAdmin(admins[msg.sender])
  {
    admins[_newAdmin] = true;
    adminsList.push(_newAdmin);
    emit LogAdminAdded(_newAdmin);
  }

  function addStoreOwner(address _newStoreOwner)
    public
    isAdmin(admins[msg.sender])
  {
    storeOwners[_newStoreOwner] = true;
    storeOwnersList.push(_newStoreOwner);
    emit LogStoreOwnerAdded(_newStoreOwner);
  }

  function createNewStore(string memory name, string memory description)
    public
    isStoreOwner(storeOwners[msg.sender])
  {
    Store newStore = new Store(msg.sender, name, description);
    storeAddressesByOwner[msg.sender].push(address(newStore));
    emit LogNewStoreCreated(msg.sender, address(newStore));
  }

  function getStoreAddressesByOwner()
    public
    view
    returns(address[] memory)
  {
    return storeAddressesByOwner[msg.sender];
  }

  function getUserRole()
    public
    view
    returns(string memory)
  {
    if(admins[msg.sender] == true) {
      return "admin";
    }
    else if(storeOwners[msg.sender] == true) {
      return "storeOwner";
    }
    else {
      return "regular";
    }
  }

  function getAdmins()
    public
    view
    returns(address[] memory)
  {
    return(adminsList);
  }

  function getStoreOwners()
    public
    view
    returns(address[] memory)
  {
    return(storeOwnersList);
  }

  /* Init */
  constructor() public {
    admins[msg.sender] = true;
    adminsList.push(msg.sender);
  }

}
