import React , { Component } from 'react';
import Aux from '../../hoc/Aux';
import axios from '../../axios-orders';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import * as orderActions from '../../store/actions/index';
import * as authActions from '../../store/actions/index';


class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false
    }

    componentDidMount () {
        //console.log(this.props)
        //calling to onInitIngredients
        this.props.onInitIngredients()
      
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
        .map(igkey => {
            return ingredients[igkey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        //control and show modal
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
            
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }


    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            //returns true or false
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //{salad: true, bacon: false etc}

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls 
                    ingredientAdded = {this.props.onIngredientAdded} 
                    ingredientRemoved = {this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    purchasable = {this.updatePurchaseState(this.props.ings)}
                    ordered = {this.purchaseHandler}
                    isAuth = {this.props.isAuthenticated}
                    price = {this.props.price} />
                </Aux>            
            );
            orderSummary = <OrderSummary 
            price = {this.props.price}
            ingredients = {this.props.ings}
            purchaseCanceled = {this.purchaseCancelHandler}
            purchaseContinued = {this.purchaseContinueHandler}/>;
        }
        return (
            <Aux>
{/* Wrapping Mpdal component will control the update of OrderSumary to prevent unnecesary re-rendering and save performance */}
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
//receive state automatically
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredients(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredients(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase: () => dispatch(orderActions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(authActions.setAuthRedirectPath(path))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));


//before redux
// addIngredientHandler = (type) => {
//     const oldCount = this.state.ingredients[type];
//     const updatedCount = oldCount + 1 ;
//     const updatedIngredients = {
//         ...this.state.ingredients
//     };
//     updatedIngredients[type] = updatedCount;
//     const priceAddition = INGREDIENT_PRICES[type];
//     const oldPrice = this.state.totalPrice;
//     const newPrice = oldPrice + priceAddition;
//     this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
//     this.updatePurchaseState(updatedIngredients)

// }

// removeIngredientHandler = (type) => {
//     const oldCount = this.state.ingredients[type];
//     if (oldCount <= 0) {
//         return;
//     }
//     const updatedCount = oldCount - 1 ;
//     const updatedIngredients = {
//         ...this.state.ingredients
//     };
//     updatedIngredients[type] = updatedCount;
//     const priceDeduction = INGREDIENT_PRICES[type];
//     const oldPrice = this.state.totalPrice;
//     const newPrice = oldPrice - priceDeduction;
//     this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
//     this.updatePurchaseState(updatedIngredients)
// }
// purchaseContinueHandler = () => {
//     //pass ingredients and totalPrice through queryParams from burgerBuilder to checkout
//     const queryParams = [];
//     for (let i in this.state.ingredients) {
//         //strings of property name is equal to property value
//         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
//     }
//     queryParams.push('price=' + this.state.totalPrice);
//     const queryString = queryParams.join('&');
//     this.props.history.push({
//         pathname: '/checkout',
//         search: '?' + queryString
//     })
// }
