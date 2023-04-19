import React from 'react';
import { NavLink } from 'react-router-dom';

const AboutNavItem = ({label, to}) => {
    return (
        <li className='AboutNavItem'>
            <NavLink exact to={to} className='aboutLink' activeClassName='aboutLink-active'>
                <span className='aboutSpan'>{label}</span>
            </NavLink>
        </li>
    );
}

export default AboutNavItem;
