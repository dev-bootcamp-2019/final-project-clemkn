import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Button } from 'react-bootstrap';
import Header from './Header.js';

class AdminContainer extends Component {

  constructor(props) {
    super(props);

    this.adminHandleChange = this.adminHandleChange.bind(this);
    this.adminHandleSubmit = this.adminHandleSubmit.bind(this);
    this.storeOwnerHandleChange = this.storeOwnerHandleChange.bind(this);
    this.storeOwnerHandleSubmit = this.storeOwnerHandleSubmit.bind(this);

    this.state = {
      loading: false,
      openStoreRequests: [],
      adminValue: '',
      storeOwnerValue: '',
      message: '',
      admins: [],
      storeOwners: []
    };
  }

  componentDidMount() {
    this.runExample();
  }

  runExample = async() => {
    const { currentAccount, marketplace } = this.props;
    const _adminsList = await marketplace.methods.getAdmins().call({from: currentAccount});
    const _storeOwnerList = await marketplace.methods.getStoreOwners().call({from: currentAccount});

    this.setState({ admins: _adminsList, storeOwners: _storeOwnerList });
  }

  getValidationState(length) {
    if (length >= 42) return 'success';
    else if (length > 0) return 'error';
    return null;
  }

  adminHandleChange(e) {
    this.setState({ adminValue: e.target.value });
  }

  storeOwnerHandleChange(e) {
    console.log("change", e.target.value);
    this.setState({ storeOwnerValue: e.target.value });
  }

  adminHandleSubmit(e) {
    e.preventDefault();
    if (this.getValidationState(this.state.adminValue.length) === "success") {
      const { currentAccount, marketplace } = this.props;
      marketplace.methods.addAdmin(this.state.adminValue).send({from: currentAccount})
      .then(result => {
        this.setState({ adminValue: '', message: 'Admin has been added.' });
        this.runExample();
        this.forceUpdate();
      })
    }
  }

  storeOwnerHandleSubmit(e) {
    e.preventDefault();
    if (this.getValidationState(this.state.storeOwnerValue.length) === "success") {
      const { currentAccount, marketplace } = this.props;
      marketplace.methods.addStoreOwner(this.state.storeOwnerValue).send({from: currentAccount})
      .then(result => {
        this.setState({ storeOwnerValue: '', message: 'Store Owner has been added.' });
        this.runExample();
        this.forceUpdate();
      })
    }
  }

  render() {
    const requests = this.state.openStoreRequests.length
      ? this.state.openStoreRequests.map((request, index) =>
        <div key={request}>
          <span style={{marginRight: '10px'}}>Requesting Address: {request}</span>
          <button onClick={() => {}}>Approve</button>
        </div>)
      : <div>No open requests...</div>;

    const { admins, storeOwners } = this.state;

    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='Admin Page'></Header>

        <Grid>
          {this.state.message != '' ?
            <Row className="show-grid">
              <Col xs={12} md={8} mdOffset={2}>
                <Alert bsStyle="success">{ this.state.message }</Alert>
              </Col>
            </Row>
          :null}

          <Row className="show-grid">
            <Col xs={12} md={6}>
              <h2>Admins</h2>
              <ul>
                {admins.map(function(admin, index) {
                  return <li key={index}>{admin}</li>;
                })}
              </ul>

              <form onSubmit={this.adminHandleSubmit}>
                <FormGroup controlId="adminForm">
                  <ControlLabel>Add new admin</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.adminValue}
                    placeholder="Enter new admin address..."
                    onChange={this.adminHandleChange}
                  />
                </FormGroup>
                <Button type="submit">Submit</Button>
              </form>
            </Col>

            <Col xs={12} md={6}>
              <h2>Store Owners</h2>
              <ul>
                {storeOwners.map(function(storeOwner, index) {
                  return <li key={index}>{storeOwner}</li>;
                })}
              </ul>

              <form onSubmit={this.storeOwnerHandleSubmit}>
                <FormGroup controlId="storeOwnerForm">
                  <ControlLabel>Add new store owner</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.storeOwnerValue}
                    placeholder="Enter new store owner address..."
                    onChange={this.storeOwnerHandleChange}
                  />
                </FormGroup>
                <Button type="submit">Submit</Button>
              </form>
            </Col>
          </Row>

        </Grid>
      </div>
    );
  }
}

export default AdminContainer
