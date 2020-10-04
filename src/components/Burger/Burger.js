import React from 'react';
import classes from './burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';


const burger = (props) => {
        console.log(props.ingredients)
        let transformedIngredients = Object.keys(props.ingredients)
        //console.log(transformedIngredients)
        .map(igKey => {
            //console.log(igKey)
            //.log(props.ingredients[igKey])
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                //console.log(i)
                return <BurgerIngredient key={igKey + i } type ={igKey} />;
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
        if (transformedIngredients.length === 0) {
            transformedIngredients = <p>Please start adding ingredients</p>
        }
        //console.log(transformedIngredients)
        return (
            <div className = {classes.Burger}>
                <BurgerIngredient type="bread-top" />
                { transformedIngredients }
                <BurgerIngredient type="bread-bottom" />
            </div>
        );
}

export default burger;