import React, { useState } from "react";
import RecipeForm from '../RecipeForm/recipeform.js'
import ThumbnailLink from '../Thumbnail/thumbnail_link.js'
import ResultPagination from '../ResultPagination/result_pagination.js'

function ThumbnailInfoCheck(rcpObj) {
    const reqKey = ['id', 'title', 'image'];
    const allPresent = reqKey.reduce((status, key) => status && Object.keys(rcpObj).includes(key), true);
    return allPresent;
}

export default function Home() {
    const searchNum = 20;
    const [fetchStatus, setFetchStatus] = useState({ loading: false, done: false, found: 0 }); //loading: fetch ongoing, done : fetch returned, found: no of recipe found
    const [recipeList, setRecipeList] = useState([]); //keep track of current recipes displayed/obtained
    const [resultPageNo, setResultPageNo] = useState(1); //keep track of no. of pages of result
    const [searchParams, setSearchParams] = useState(); //keep track of the searchParams, react-router's useSearchParams() show the query in URL, which I don't want

    async function fetchRecipe(searchParamObj, skip = 0) {
        const spoonURL = new URL('https://api.spoonacular.com/recipes/complexSearch');
        searchParamObj.set('apiKey', process.env.REACT_APP_SPOONACULAR_API_KEY);
        searchParamObj.set('number', searchNum);
        searchParamObj.set('offset', skip * searchNum);
        spoonURL.search = searchParamObj.toString();
        setFetchStatus({ ...fetchStatus, ...{ loading: true, done: false } });
        try {
            const getRecipe = await fetch(spoonURL.href);
            if (getRecipe.status === 200) {
                const recipes = await getRecipe.json();
                searchParamObj.delete('apiKey');
                // Should hide the API key? Guess this will make API key needed to be fetch from .env every fetch, rather than keep it as search params
                setRecipeList(recipes.results);
                setResultPageNo(Math.ceil(recipes.totalResults / recipes.number));
                setSearchParams(searchParamObj);
                setFetchStatus({ loading: false, done: true, found: recipes.totalResults });
            }
        }
        catch (error) {
            console.warn(error);
        }
    }

    function nextPage(pageNum) {
        fetchRecipe(searchParams, pageNum - 1);
    }

    if (fetchStatus.loading) {
        return (<>
            <h2>Recipe Search</h2>
            <div>
                <RecipeForm handleForm={fetchRecipe} />
            </div>
            <p>Searching...</p>
        </>
        );
    }

    return (
        <>
            <h2>Recipe Search</h2>
            <div>
                <RecipeForm handleForm={fetchRecipe} />
            </div>
            {recipeList.length > 0 ?
                <><h2>Search Result</h2>
                    <span>{fetchStatus.found} results found.</span>
                    <div className='flexbox'>
                        {recipeList.map((recipe) =>
                            recipe && ThumbnailInfoCheck(recipe) ? <ThumbnailLink key={recipe.id} recipeId={recipe.id} thumbText={recipe.title} imgURL={recipe.image} /> : null)
                        }
                    </div>
                </> : fetchStatus.done ? <p>No Results</p> : null
            }
            {resultPageNo > 1 ? <ResultPagination pageNum={resultPageNo} updatePageFn={nextPage} /> : null}
        </>
    )
}