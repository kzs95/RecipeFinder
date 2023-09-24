// @ts-check
import React, { useState } from 'react'
import './recipeform.css';
import { captialise } from '../Utilities/utilityFn.js';

const cuisines = ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German',
    'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic',
    'Southern', 'Spanish', 'Thai', 'Vietnamese'];

const mealtypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'];

export default function RecipeForm({ handleForm }) {
    const [keyword, setKeyword] = useState('');
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [mealtype, setMealtype] = useState('');

    function handleInputChange(setFunction, value) {
        setFunction(value);
    }

    function handleSubmit(event) {
        // The pagination component needs the url also. so here just process the search params and then send to home.js
        // Prev code process Url object:
        
        // event.preventDefault();
        // const formData = new FormData(event.target);
        // const spoonURL = new URL('https://api.spoonacular.com/recipes/complexSearch');
        // const searches = spoonURL.searchParams;
        // for (const [name, value] of formData) {
        //     if (value) searches.set(name, value);
        // }
        // searches.set('instructionsRequired', true);
        // searches.set('apiKey', process.env.REACT_APP_SPOONACULAR_API_KEY);
        // handleForm(spoonURL);

        event.preventDefault();
        const formData = new FormData(event.target);
        const searches = new URLSearchParams();
        for (const [name, value] of formData) {
            if (value) searches.set(name, value);
        }
        searches.set('instructionsRequired', true);
        handleForm(searches);
    }

    return (
        <form name='recipe_search' onSubmit={handleSubmit}>
            <label>Recipe Keyword
                <input required name='query' type='text' placeholder='Pasta, Fish, ...' pattern='[\s\w]+' value={keyword} onChange={(evt) => handleInputChange(setKeyword, evt.target.value)} />
                <small>Use latin characters and space only.</small>
            </label>
            <label>Type of Cuisine
                <select value={cuisine} name='cuisine' onChange={(evt) => handleInputChange(setCuisine, evt.target.value)}>
                    <option value=''>Any</option>
                    {cuisines.map((cuisine) => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
                </select>
            </label>
            <label>Type of Meal
                <select value={mealtype} name='type' onChange={(evt) => handleInputChange(setMealtype, evt.target.value)}>
                    <option value=''>Any</option>
                    {mealtypes.map((mealtype) => <option key={mealtype} value={mealtype}>{captialise(mealtype)}</option>)}
                </select>
            </label>
            <fieldset>
                <legend>Diet</legend>
                <label>
                    <input type='radio' name='diet' value='' onChange={(evt) => handleInputChange(setDiet, evt.target.value)} checked={diet === ''} />
                    No Preference
                </label>
                <label>
                    <input type='radio' name='diet' value='vegetarian' onChange={(evt) => handleInputChange(setDiet, evt.target.value)} checked={diet === 'vegetarian'} />
                    Vegetarian
                </label>
                <label>
                    <input type='radio' name='diet' value='vegan' onChange={(evt) => handleInputChange(setDiet, evt.target.value)} checked={diet === 'vegan'} />
                    Vegan
                </label>
            </fieldset>
            <input type='submit' value='Search Recipe'></input>
        </form>
    )
}