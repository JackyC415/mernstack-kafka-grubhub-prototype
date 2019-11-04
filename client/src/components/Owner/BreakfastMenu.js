import React, { Component } from 'react';
import axios from 'axios';
import RemoveMenuItem from './RemoveMenuItem';
import { Link } from 'react-router-dom';

class BreakfastMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { items: '' };
  }

  componentDidMount() {
    axios.get('http://localhost:3001/getBreakfastMenu')
      .then(res => {
        this.setState({ items: res.data });
      }).catch((error) => {
        console.log(error);
      });
  }

  tabRow() {
    if (this.state.items instanceof Array) {
      return this.state.items.map(function (object, i) {
        return <RemoveMenuItem obj={object} key={i} />;
      })
    }
  }

  render() {
    return (
      <div className="container">
        <h3>Menu</h3>
        <Link to={"/addMenuItem"} >Add New Item</Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <td>Name</td>
              <td>Description</td>
              <td>Image</td>
              <td>Quantity</td>
              <td>Price</td>
              <td></td>
            </tr>
          </thead>
          <tbody> {this.tabRow()} </tbody>
        </table>
      </div>
    );
  }
}

export default BreakfastMenu;
