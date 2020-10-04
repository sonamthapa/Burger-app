import React, { Component } from 'react';
import Aux from '../Aux';
import classes from './layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';


class Layout extends Component {
    state = {
        showSideDrawer: true
    }
    sideDrawerClosedHandler = (props) => {
        this.setState({showSideDrawer: false})
    }
    sideDrawerToggleHandler = (props) => {
        // has flaw beacase of async behavaiour of setState so,
        // this.setState({showSideDrawer: !this.state.showSideDrawer})
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }
    render() {
        return (
            <Aux>
                <Toolbar 
                    isAuth = {this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth = {this.props.isAuthenticated}
                    closed={this.sideDrawerClosedHandler}
                    open={this.state.showSideDrawer}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps)(Layout);