import React, {Component} from 'react';
import Icon from '../icons'
import {Link} from 'react-router-dom'

class FeaturedItem extends Component {
    render() {
        const { exact, to, label } = this.props;
        return (
                <Link exact={exact} to={to} className='featured-item-link' activeClassName="activeMainNav" style={this.props.style}>
                    <div className="playlist-icon">
                        <Icon name='Like' />
                    </div>
                    <span className="featured-label">{label}</span>
                </Link>
        );
    }
}

export default FeaturedItem;


