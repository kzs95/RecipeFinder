// @ts-check
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { captialise } from '../Utilities/utilityFn.js';
import './recipe.css';
import serveIcon from './serve.svg';
import timeIcon from './time.svg';

function RecipeMisc({misc}) {
    const { time, serve } = misc;
    return (
        <>
            <div className='misc-data'><div><img src={serveIcon} alt="servings"/></div><div>Serves {serve}</div></div>
            <div className='misc-data'><div><img src={timeIcon} alt="Preparation time"/></div><div>{time} minutes</div></div>
        </>
    )
}

export default function Recipe() {
    const { recipeId } = useParams();
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState({ name: '', imgURL: '', misc: {}, source: {}, ingredients: [], instructions: [] });

    useEffect(() => {
        async function fetchInfo() {
            setLoading(true);
            try {
                const getRecipeInfo = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`);
                // const getRecipeInfo = await fetch('/cognee/cogneeInfo.json');
                if (getRecipeInfo.status === 200) {
                    const recipeInfo = await getRecipeInfo.json();
                    const recipeName = recipeInfo.title;
                    const sources = { [recipeInfo.sourceName]: recipeInfo.sourceUrl, spoonacular: recipeInfo.spoonacularSourceUrl };
                    const miscdata = { time: recipeInfo.readyInMinutes, serve: recipeInfo.servings };
                    // Both return array of objects
                    // The ingredients have duplication problem !
                    // [{id,aisle,image,consistency,name,nameClean,original,originalName,amount,unit,meta:[],measures:{us,metric:{amount,unitShort,unitLong}}}]
                    const { allIngredients: ingredientsArr } = recipeInfo.extendedIngredients.reduce((filter, ingredient) => {
                        if (!filter.idSet.has(ingredient.id)) {
                            filter.idSet.add(ingredient.id);
                            filter.allIngredients.push(ingredient);
                        }
                        return filter;
                    }, { idSet: new Set(), allIngredients: [] });
                    const instructionsArr = recipeInfo.analyzedInstructions;
                    // [{name:<string>,steps:[{number:<number>,step:<string>,equipment:[{id:<number>,name,localizedName,image:<string>}],ingredients:[{id:<number>,name,localizedName,image:<string>}]}]}]
                    document.title = `${recipeName} | Recipe Finder`;
                    setRecipeData({ ...recipeData, ...{ name: recipeName, imgURL: recipeInfo.image, misc: miscdata, source: sources, ingredients: ingredientsArr, instructions: instructionsArr } });
                    setLoading(false);
                }
            }
            catch (error) {
                console.warn(error);
            }
        }
        fetchInfo();
    }, [])

    if (loading) {
        return (
            <div>
                <h2>Recipe Details</h2>
                <p>Loading...</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>{recipeData.name}</h2>
                <figure>
                    <img alt={recipeData.name} src={recipeData.imgURL} />
                    <figcaption>{recipeData.name}</figcaption>
                </figure>
                <div className='recipe-misc'>
                    <RecipeMisc misc={recipeData.misc}/>
                </div>
                <div className='recipe-ingredient'>
                    <h3>Ingredients</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipeData.ingredients.map((ingredient, index, recipeArr) =>
                                <tr key={ingredient.id}>
                                    <td>{captialise(ingredient.name)}</td>
                                    <td>{`${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitShort}`}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <hr />
                <div className='recipe-instruction'>
                    <h3>Instructions</h3>
                    {recipeData.instructions.map(({ name, steps }, index) =>
                        <div key={`process-${String.fromCharCode(index + 65)}`}>
                            {name ? <span className='recipe-stepName'>{name}</span> : null}
                            <ol>
                                {steps.map(({ step }, index) => <li key={`step-${index + 1}`}>{step}</li>)}
                            </ol>
                        </div>
                    )}
                </div>
                <hr />
                <div className='recipe-sources'>
                    <h3>Source</h3>
                    <ul>
                        {Object.entries(recipeData.source).map(([site, url]) => <li key={`source-${site}`}><a rel="noreferrer" target='_blank' href={url}>{site}</a></li>)}
                    </ul>
                </div>
            </div>
        )
    }
}

// GET https://api.spoonacular.com/recipes/{id}/information (have even more detailed ingredients)
// GET https://api.spoonacular.com/recipes/{id}/ingredientWidget.json
// GET https://api.spoonacular.com/recipes/{id}/analyzedInstructions (Not worth it. aldy covered by information!)
// GET https://api.spoonacular.com/recipes/{id}/equipmentWidget.json (Meh)