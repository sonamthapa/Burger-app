import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';



class CheckOut extends Component {

    checkoutCanceledHandler = (props) => {
        this.props.history.goBack();
    }
    checkoutCantinuedHandler = (props) => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let summary = <Redirect to="/"/>
        if (this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                    ingredients={this.props.ings}
                    checkoutCanceled={this.checkoutCanceledHandler}
                    checkoutContinued={this.checkoutCantinuedHandler}/>
                    <Route path ={this.props.match.path + '/contact-data'} 
                    component={ContactData} />
                </div>
            );
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}


export default connect(mapStateToProps)(CheckOut);


// componentWillMount() {
//     const query = new URLSearchParams(this.props.location.search);
//     const ingredients = {};
//     let price = 0;
//     for (let param of query.entries()) {
//         if (param[0] === 'price') {
//             price = param[1];
//         }else {
//         //['salad', '1']
//         //now convert into object ingredients
//         ingredients[param[0]] = +param[1];
//         }
//     }
//     this.setState({ingredients: ingredients, totalPrice: price})
// }
//  //Whatever props i get here is passed to contactdata--> OR you can use withRouter wrapper
//  render= { (props)=> (<ContactData ingredients = {this.state.ingredients} price={this.state.totalPrice} {...props}/>)}