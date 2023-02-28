import React from 'react'

const Bars = (props) => {
    return(
<svg xmlns="http://www.w3.org/2000/svg" 
    version='1.1'
    viewBox="0 0 512 512" 
    stroke='currentColor'
    strokeLinecap='round'
    stroke-width='40'
    space="preserve"
    data-testid='bars-icon'
    >
        <path d="M80 362.667v-213.333"/>
        <path d="M156 416v-320"></path>
        <path d="M236 496v-480"></path>
        <path d="M316 416v-320"></path>
        <path d="M396 362.667v-213.333"></path>
        </svg>
    );
}



export default Bars;