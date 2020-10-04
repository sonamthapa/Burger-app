import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './contactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';



class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation: {
                        required: true

                    },
                    valid: false,
                    touched: false
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Street'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'ZipCode'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5,
                        isNumeric: true
                    },
                    valid: false,
                    touched: false
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Your Email'
                    },
                    value: '',
                    validation: {
                        required: true,
                        isEmail: true
                    },
                    valid: false,
                    touched: false
                },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                     options: [
                                {value: 'fastes',displayValue: 'Fastest'},
                                {value: 'cheapest',displayValue: 'Cheapest'}
                            ]
                    },
                    value: 'fastest',
                    validation: {},
                    valid: true
                }
        },
            formIsValid: false
    }
    orderHandler = (event) => {
        event.preventDefault();
        //extract the value from the state and map to name,street,country
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            //key:value pair
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            userId: this.props.userId,
            orderData: formData
        }
        this.props.onOrderBurger(order,this.props.token,this.props.userId)

    }
    checkValidity (value, rules) {
        let isvalid = true;
        if (rules.required){
            isvalid = value.trim() !== '' &&isvalid;
        }
        if (rules.minLength) {
            isvalid = value.length >= rules.minLength &&isvalid
        }
        if (rules.maxLength) {
            isvalid = value.length <= rules.maxLength &&isvalid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isvalid = pattern.test(value) && isvalid;
          }
        
          if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isvalid = pattern.test(value) && isvalid;
          }

        return isvalid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //gives name,street,country etc--> not a deep clone
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //deep cloning to get value
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        //state object which contains all elements is updatedOrderForm
        for(let inputIdentifiers in updatedOrderForm) {
            //overall forms validity
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})

    }
    render() {
        const formElementArray = [];
        for(let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
            {formElementArray.map(formElement => (
                <Input 
                        key = {formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value ={formElement.config.value}
                        invalid= {!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        //based on forElement.id update value
                        changed={(event) =>this.inputChangedHandler(event,formElement.id)}/>
            ))}
            <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
        )
        if (this.props.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your ContactData</h4>
                {form}
            </div>
        );
    }
}
//receive state automatically
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token ) => dispatch(orderActions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(ContactData, axios));
