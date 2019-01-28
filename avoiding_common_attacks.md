# Avoiding Common Attacks

## The Circuit Breaker Pattern
As mentioned in Design Pattern Decisions, the Circuit Breaker Pattern is implemented at the Store contract level because it's the only contract where users can manage Ethers.

## Integer Overflow

* The SafeMath library contract from OpenZeppelin was used to prevent integer overflow attacks and conduct arithmetic safely.
* The Store contract uses uint256 data type.

## Protect data visibility

The contracts explicity label the visibility of the state variables and the functions.

## Differentiate functions and events

Each events start with Log to defferentiate the function and the event in order to prevent the risk of confusion.

## Protect againt raw data

Both contract can accept user inputs as string data type. All the functions that require string, a modifier checks the length.

## Tx.origin authentification

Using tx.origin makes the contract vulnerable to phishing attack. I am using `msg.sender` instead of `tx.origin` as a preventive technique. 
