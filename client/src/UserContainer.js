import React, { Component } from 'react'
import Header from './Header.js';
import StoreUserView from './StoreUserView';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Button, Table } from 'react-bootstrap';


class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [],
    }
  }


  componentDidMount() {
    const {currentAccount, marketplace } = this.props;
    marketplace.getPastEvents("LogNewStoreCreated", { fromBlock: 0, toBlock: 'latest' }, (error, events) => {
      if (!error) {
        const stores = events.map(n => {
          return n.returnValues.store;
        });
        this.setState({ stores });
      }
    });
  }

  render() {
    const stores = this.state.stores.length
    ? this.state.stores.map(store =>
          <StoreUserView currentAccount={this.props.currentAccount}
                            web3={this.props.web3}
                            address={store}
                            key={store}></StoreUserView>)
    : <div>There are no stores in the marketplace yet, check back later!</div>;

    return (
      <div>
        <Header currentAccount={this.props.currentAccount} pageTitle='User Page'></Header>

        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8} mdOffset={2}>
              <h1>Stores</h1>
            </Col>
          </Row>
          { stores }
        </Grid>
      </div>
    )
  }
}

export default UserContainer
