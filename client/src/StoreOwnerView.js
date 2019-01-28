import React, { Component } from 'react'
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Button, Table } from 'react-bootstrap';
import StoreContract from "./contracts/Store.json";


class StoreOwnerView extends Component {
  constructor(props) {
    super(props);

    this.addItemHandleSubmit = this.addItemHandleSubmit.bind(this);
    this.itemNameHandleChange = this.itemNameHandleChange.bind(this);
    this.itemDescHandleChange = this.itemDescHandleChange.bind(this);
    this.itemPriceHandleChange = this.itemPriceHandleChange.bind(this);
    this.fetchStores = this.fetchStores.bind(this);
    this.updateStockCount = this.updateStockCount.bind(this);

    this.state = {
      itemNameValue: '',
      itemDescValue: '',
      itemPriceValue: '',
      items: [],
    }

  }

  componentDidMount() {
    this.fetchStores();
  }

  itemNameHandleChange(e) {
    this.setState({ itemNameValue: e.target.value });
  }

  itemDescHandleChange(e) {
    this.setState({ itemDescValue: e.target.value });
  }

  itemPriceHandleChange(e) {
    this.setState({ itemPriceValue: e.target.value });
  }

  fetchStores = async() => {
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

  addItemHandleSubmit(e) {
    e.preventDefault();
    if (!this.state.itemNameValue || !this.state.itemDescValue || !this.state.itemPriceValue) {
       return;
    }

    const wei = this.props.web3.utils.toWei(this.state.itemPriceValue, "ether");
    this.state.instance.methods.addNewItem(this.state.itemNameValue, this.state.itemDescValue, wei).send({ from: this.props.currentAccount })
    .then(result => {
      console.log('addItem', result);
      this.fetchStores();
    });
  }

  updateStockCount(sku, newVal) {
    // this is a hack - mutating state directly
    this.state.items.find(n => n.sku === sku).stockCount = newVal;
    this.forceUpdate()
  }

  sendUpdateStockCount(sku, newCount) {
    this.state.instance.methods.updateStockCount(sku, newCount).send({from: this.props.currentAccount});
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
            <th>Update stock</th>
          </tr>
        </thead>
        <tbody>
        {this.state.items.map(item =>
          <tr key={item.sku}>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{this.props.web3.utils.fromWei(item.price, "ether")}</td>
            <td>
              <input type="number" style={{width: '50px', marginRight: '5px'}} value={item.stockCount} onChange={(e) => this.updateStockCount(item.sku, e.target.value)} />
              <button onClick={() => this.sendUpdateStockCount(item.sku, item.stockCount)} type="button">Update</button>
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
          <h2>{this.props.index}/ {this.state.name}</h2>
          <p>Owner: {this.state.owner}</p>
        </Col>
      </Row>
      <Row className="show-grid">
        <Col xs={12} md={8} mdOffset={2}>
            { items }
        </Col>
      </Row>
      <Row className="show-grid">
        <Col xs={12} md={8} mdOffset={2}>
            <h4>Add a new item</h4>
            <form onSubmit={this.addItemHandleSubmit}>
              <FormGroup controlId="addItemForm">
                <FormControl
                  type="text"
                  value={this.state.itemNameValue}
                  placeholder="Name"
                  onChange={this.itemNameHandleChange}
                />
                <FormControl
                  type="text"
                  value={this.state.itemDescValue}
                  placeholder="Description"
                  onChange={this.itemDescHandleChange}
                />
                <FormControl
                  type="text"
                  value={this.state.itemPriceValue}
                  placeholder="Price (ETH)"
                  onChange={this.itemPriceHandleChange}
                />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </form>
          </Col>
        </Row>
        </div>
    )
  }
}

export default StoreOwnerView
