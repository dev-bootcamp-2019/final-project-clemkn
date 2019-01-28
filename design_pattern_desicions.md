# Design Pattern Decisions

## Architecture

This is the architecture a the marketplace designed in the smart contracts.

#### Marketplace

* Multiple admins
* Multiple store owners
* Multiple stores

#### Store

* An owner
* A name
* A description
* Multiple items

#### Item

* A name
* A description
* A price (wei)
* A stock count
* A sku


## Contract Design

### Marketplace Contract

Marketplace contract is the root contract of the decentralized online marketplace. The contract is responsible to store information about the admins, the store owners and the list of store contracts created.

### Store Contract

Store contract is the subcontract to store all the information about a store. It can store the owner of the store, the metadata (name, description) and the list of items users can buy. Items are designed through a Struct. Each store is independant and is reponsible to store it's own eth, recuding the amount of eth stored in one contract.

## Other Patterns

### The Circuit Breaker / Emergency Stop Pattern

This pattern allows to stop the execution if certain conditions are met and can be very useful when new errors are discovered. It has been implemented in the Store contract because it's the only level where users can interact with Ethers.
