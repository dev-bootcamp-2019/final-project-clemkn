# Consensys Final Project: Decentralized Marketplace
##### Clément Quennesson - clement.quennesson@gmail.com

### Additional Documentation

* [Design Pattern Documentation](https://github.com/dev-bootcamp-2019/final-project-clemkn/blob/master/design_pattern_desicions.md)
* [Avoiding Common Attacks Documentation](https://github.com/dev-bootcamp-2019/final-project-clemkn/blob/master/avoiding_common_attacks.md)
* [Deployed Addresses](https://github.com/dev-bootcamp-2019/final-project-clemkn/blob/master/deployed_addresses.txt)

### Deployment on Rinkeby
Contract Address: [0xd6178AABd58938e9bdB28f4ae72baaE7691B8E4a](https://rinkeby.etherscan.io/address/0xd6178aabd58938e9bdb28f4ae72baae7691b8e4a)

### Overview
This application is an online marketplace that operates on the blockchain. This marketplace supports 3 roles of users.

* Admins: Add admins / store owners
* Store Owners: Manage stores and items
* Regular users: Browse stores and buy items

### Setup

Note: You have to check that the local blockchain is running on port 8545.

1. Clone the repo: `https://github.com/dev-bootcamp-2019/final-project-clemkn.git`
2. Move into the directory: `cd final-project-clemkn`
3. Start the local blockchain using ganache: `ganache-cli`
4. Open a second window and compile the contracts with truffle: `truffle compile`
5. Migrate the contracts with truffle: `truffle migrate`
6. Run the tests with truffle: `truffle test`
7. Install the front end dependencies via npm in the client folder: `cd client && npm install`
8. Open the react app (in client folder): `npm run start`
9. Open your browser with MetaMask and navigate to http://localhost:3000
10. Appreciate :)

### Interaction with the marketplace

* Note 1: Your current account will be the first admin of the marketplace.
* Note 2: Use the accounts on MetaMask to test the marketplace with all the user roles.

#### Admins:

* Can add new admins.
* Can add new store owners.

#### Store Owners:

* Can view their stores (with items).
* Can add new stores (name, description).
* Can add new items in specific store (name, description, price).
* Can update the stock of an item.

#### Regular users:

* Can explore all the stores and items.
* Can buy an item with a specific quantity.
