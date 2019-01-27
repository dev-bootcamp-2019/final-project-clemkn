pragma solidity ^0.5.0;

import './Store.sol';

/** @title Marketplace. */
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

  /** @dev Check if admin exists */
  modifier isAdmin(bool _exists) {
    require(_exists, "This function is only available to admins");
    _;
  }
  /** @dev Check if store owner exists */
  modifier isStoreOwner(bool _exists) {
      require(_exists, "This function is only available to store owners");
      _;
  }

  /** @dev Add a new admin.
  * @param _newAdmin Address of the new admin.
  */
  function addAdmin(address _newAdmin)
    public
    isAdmin(admins[msg.sender])
  {
    admins[_newAdmin] = true;
    adminsList.push(_newAdmin);
    emit LogAdminAdded(_newAdmin);
  }

  /** @dev Add a new store owner.
    * @param _newStoreOwner Address of the new store owner.
    */
  function addStoreOwner(address _newStoreOwner)
    public
    isAdmin(admins[msg.sender])
  {
    storeOwners[_newStoreOwner] = true;
    storeOwnersList.push(_newStoreOwner);
    emit LogStoreOwnerAdded(_newStoreOwner);
  }

  /** @dev Create a new store.
    * @param name Name of the new store.
    * @param description Description of the new store.
    */
  function createNewStore(string memory name, string memory description)
    public
    isStoreOwner(storeOwners[msg.sender])
  {
    Store newStore = new Store(msg.sender, name, description);
    storeAddressesByOwner[msg.sender].push(address(newStore));
    emit LogNewStoreCreated(msg.sender, address(newStore));
  }

  /** @dev Retrieve the stores' address by the current account.
    * @return address[] The stores' address.
    */
  function getStoreAddressesByOwner()
    public
    view
    returns(address[] memory)
  {
    return storeAddressesByOwner[msg.sender];
  }

  /** @dev Retrieve the role of the current account.
    * @return A string indicating the user role.
    */
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

  /** @dev Retrieve the admin list.
    * @return A list of the admins' address.
    */
  function getAdmins()
    public
    view
    returns(address[] memory)
  {
    return(adminsList);
  }

  /** @dev Retrieve the store owners.
    * @return A list of the store owners' address.
    */
  function getStoreOwners()
    public
    view
    returns(address[] memory)
  {
    return(storeOwnersList);
  }

  /** @dev Init the contract with the current account as an admin.
    */
  constructor() public {
    admins[msg.sender] = true;
    adminsList.push(msg.sender);
  }

}
