import React, { Component } from 'react'
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Button, Table } from 'react-bootstrap';
import StoreContract from './contracts/Store.json'

class StoreUserView extends Component {
  constructor(props) {
    super(props);

    this.fetchStore = this.fetchStore.bind(this);

    this.state = {
      loading: true,
      instance: null,
      name: '',
      description: '',
      items: [],
      buyQuantity: 0,
    };
  }

  componentDidMount() {
    this.fetchStore();
  }

  fetchStore = async() => {
    const instance = new this.props.web3.eth.Contract(
      StoreContract.abi,
      this.props.address,
    );

    const name = await instance.methods.name().call();
    const description = await instance.methods.description().call();
    const owner = await instance.methods.owner().call();
    const latestSku = await instance.methods.latestSku().call();

    const items = [];
    for (let i = 1; i <= latestSku; i++) {
      const item = await instance.methods.itemsBySku(i).call()
      items.push(item)
    }

    this.setState({ instance, name, description, owner, items });
    this.forceUpdate();
  }

  updateBuyQuantity(sku, newVal) {
    this.setState({ buyQuantity: newVal });
    this.forceUpdate();
  }

  buyItem(item, buyQuantity) {
    this.state.instance.methods.buyItem(item.sku, buyQuantity).send({
      from: this.props.currentAccount,
      value: item.price * buyQuantity
    })
    .then(result => {
      this.state.items.find(n => n.sku === item.sku).stockCount = this.state.items.find(n => n.sku === item.sku).stockCount - buyQuantity;
      this.forceUpdate();
    });

  }

  render() {

        const items = this.state.items.length > 0
        ? (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Sku</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (ETH)</th>
                <th>Stock</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
            {this.state.items.map(item =>
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{this.props.web3.utils.fromWei(item.price, "ether")}</td>
                <td>{item.stockCount}</td>
                <td>
                  <input type="number" min="0" max={item.stockCount} style={{width: '50px', marginRight: '5px'}} value={this.state.buyQuantity} onChange={(e) => this.updateBuyQuantity(item.sku, e.target.value)} />
                  <button onClick={() => this.buyItem(item, this.state.buyQuantity)} type="button">Buy</button>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        )
        : <div>None yet...</div>;

    return (
      <div>
      <Row className="show-grid">
        <Col xs={12} md={8} mdOffset={2}>
          <h2>{this.state.name}</h2>
          <p>Owner: {this.state.owner}</p>
        </Col>
      </Row>
      <Row className="show-grid">
        <Col xs={12} md={8} mdOffset={2}>
            { items }
        </Col>
      </Row>
      </div>
    )
  }

}

export default StoreUserView
