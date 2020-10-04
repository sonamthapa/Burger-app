import React from 'react';
//informing to webpack
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './logo.module.css';


const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={burgerLogo} alt="MyBurger"/>
    </div>
);

export default logo;