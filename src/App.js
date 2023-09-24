import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './Home/home.js';
import Recipe from './Recipe/recipe.js';

import './App.css';

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <nav>
          <Link to="/" id='homeIcon'><h1>Recipe Finder</h1></Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RecipeFinder/" element={<Home />} />
          <Route path="/recipe/:recipeId" element={<Recipe />} />
        </Routes>
      </BrowserRouter>
      <div>This page uses <a id='credit' target='blank' href='https://spoonacular.com/food-api'>spoonacular API</a></div>
    </div>
  );
}
