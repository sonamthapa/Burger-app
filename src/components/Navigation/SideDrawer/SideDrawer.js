import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './sideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';


const sideDrawer = (props) => {
    //by default SideDrawer is close
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            {/* cannot pass array of string so converting into single string */}
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
            <div className={classes.Logo}>
                <Logo /> 
            </div>
            <nav>
               <NavigationItems isAuthenticated = {props.isAuth} />
            </nav>
            </div>
        </Aux>
    )
}

export default sideDrawer;
