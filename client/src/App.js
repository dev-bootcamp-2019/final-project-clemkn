import React, { Component } from "react";
import MarketplaceContract from "./contracts/Marketplace.json";
import getWeb3 from "./utils/getWeb3";

import AdminContainer from './AdminContainer';
import StoreOwnerContainer from './StoreOwnerContainer';
import UserContainer from './UserContainer';

import "./css/bootstrap.css";
import "./css/App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, marketplaceContract: null, storeContract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = MarketplaceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketplaceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.getUserRole().call({from: accounts[0]});

    // Update state with the result.
    this.setState({ userRole: response,currentAccount: accounts[0] });
  };

  render() {
    const userRole = this.state.userRole;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {userRole === '' && <p>Loading...</p>}
        {userRole === 'admin' && <AdminContainer
          web3={this.state.web3}
          currentAccount={this.state.currentAccount}
          marketplace={this.state.contract}></AdminContainer>}
        {userRole === 'storeOwner' && <StoreOwnerContainer
          web3={this.state.web3}
          currentAccount={this.state.currentAccount}
          marketplace={this.state.contract}></StoreOwnerContainer>}
        {userRole === 'regular' && <UserContainer
          web3={this.state.web3}
          currentAccount={this.state.currentAccount}
          marketplace={this.state.contract}></UserContainer>}
      </div>
    );
  }
}

export default App;
