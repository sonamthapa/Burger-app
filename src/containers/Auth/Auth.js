import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './auth.module.css';
import * as Actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';




class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true

                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6

                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    }
    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
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
    inputChangedHandler = (event, controlName) => {
        //gives email, password etc--> not a deep clone
        const updatedControls = {
            ...this.state.controls,
        //deep cloning to get value property
            [controlName]: {
            ...this.state.controls[controlName],
            value: event.target.value,
            valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
            touched: true
            }
        };
        this.setState({controls: updatedControls})
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignup)
    }
    switchAuthHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup}
        })
    }
    render() {
        const formElementArray = [];
        for(let key in this.state.controls) {
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        let form = formElementArray.map(formElement => (
                <Input 
                        key = {formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value ={formElement.config.value}
                        invalid= {!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        //based on forElement.id update value
                        changed={(event) =>this.inputChangedHandler(event,formElement.id)}
                        />
           
        ));

        if(this.props.loading) {
            form = <Spinner />
        }
        let errorMessage = null;
        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        let authRedirect = null;
        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success" >Submit</Button>
                </form>
                <Button 
                    clicked={this.switchAuthHandler}
                    btnType="Danger">Switch{this.state.isSignup ? 'SIGNIN': 'SIGNUP'}</Button>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath

    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password, isSignup) => dispatch(Actions.auth(email,password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(Actions.setAuthRedirectPath('/'))
    }  
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);