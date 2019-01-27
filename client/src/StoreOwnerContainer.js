import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Button } from 'react-bootstrap';
import Header from './Header.js';

import StoreOwnerView from './StoreOwnerView.js'

class StoreOwnerContainer extends Component {

  constructor(props) {
    super(props);

    this.addStoreHandleSubmit = this.addStoreHandleSubmit.bind(this);
    this.storeNameHandleChange = this.storeNameHandleChange.bind(this);
    this.storeDescHandleChange = this.storeDescHandleChange.bind(this);
    this.getStoreAddresses = this.getStoreAddresses.bind(this);

    this.state = {
      loading: false,
      storeNameValue: '',
      storeDescValue: '',
      message: '',
      storeAddresses: [],
    };
  }

  componentDidMount() {
    this.getStoreAddresses();
  }

  getStoreAddresses() {
    const { currentAccount, marketplace } = this.props;
    marketplace.methods.getStoreAddressesByOwner().call({from: currentAccount})
    .then(storeAddresses => this.setState({storeAddresses, loading: false}));
  }

  storeNameHandleChange(e) {
    this.setState({ storeNameValue: e.target.value });
  }

  storeDescHandleChange(e) {
    this.setState({ storeDescValue: e.target.value });
  }

  addStoreHandleSubmit(e) {
    e.preventDefault();
    if (!this.state.storeNameValue || !this.state.storeDescValue) {
      return;
    }

    const { currentAccount, marketplace } = this.props;
    marketplace.methods.createNewStore(this.state.storeNameValue, this.state.storeDescValue).send({ from: currentAccount })
    .then(result => {
      this.setState({ message: "New store created" })
      this.getStoreAddresses();
      this.forceUpdate();
    });
  }


  render() {

    const stores = this.state.storeAddresses.map((storeAddress, index) =>
      <StoreOwnerView
        index={index}
        key={storeAddress}
        address={storeAddress}
        web3={this.props.web3}
        currentAccount={this.props.currentAccount}
      ></StoreOwnerView>);


    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='Store Owner Page'></Header>

        <Grid>
        {this.state.message != '' ?
          <Row className="show-grid">
            <Col xs={12} md={8} mdOffset={2}>
              <Alert bsStyle="success">{ this.state.message }</Alert>
            </Col>
          </Row>
        :null}

        <Row className="show-grid">
          <Col xs={12} md={8} mdOffset={2}>
            <h2>Add a new store</h2>

            <form onSubmit={this.addStoreHandleSubmit}>
              <FormGroup controlId="addStoreForm">
                <FormControl
                  type="text"
                  value={this.state.storeNameValue}
                  placeholder="Name"
                  onChange={this.storeNameHandleChange}
                />
                <FormControl
                  type="text"
                  value={this.state.storeDescValue}
                  placeholder="Description"
                  onChange={this.storeDescHandleChange}
                />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </form>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={12} md={8} mdOffset={2}>
            <h2>Stores</h2>
            {stores.length ? stores : <div>No stores...</div>}
          </Col>
        </Row>
        </Grid>
      </div>
    );
  }
}

export default StoreOwnerContainer
