import React, { Component } from 'react';
import Icon from '../icons'
import {Link} from 'react-router-dom'

class NavItem extends Component {
    render() {
      const { exact, to, label } = this.props;

      return (
        <li className="NavItem">
          {exact ? (
            <Link to={to} className="nav-link" activeClassName="activeMainNav" style={this.props.style}>
              <div className="nav-icon">
                <Icon name={this.props.name} />
              </div>
              <span>{label}</span>
            </Link>
          ) : (
            <Link to={to} className="nav-link" activeClassName="activeMainNav" style={this.props.style}>
              <div className="nav-icon">
                <Icon name={this.props.name} />
              </div>
              <span>{label}</span>
            </Link>
          )}
        </li>
      );
    }
  }

export default NavItem;
