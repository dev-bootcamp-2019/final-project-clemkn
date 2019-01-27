import React, { Component } from 'react'
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">{this.props.pageTitle}</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem>
            Current Address: {this.props.currentAccount}
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
