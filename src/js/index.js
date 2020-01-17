// https://forkify-api.herokuapp.com/api/search

import axios from "axios";
import Search from './models/Search'
import { elements, renderLoader, clearLoader }  from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe'
import List from './models/List'

/* Global state of the app 
    -Search object
    -Current recipe object
    -Shopping list object
    -Liked recipes
*/
const state = {};

/*-----------------------------------------------
----------------SEARCH CONTROLLER----------------
-------------------------------------------------
*/


const controlSearch = async () => {

    // 1) get query from view
    const query = searchView.getInput(); //TODO


    console.log(query);
    
    if (query) {
        // 2) New search object, and add to the state
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {  
            // 4) Search for recipes
            await state.search.getResults();
            
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            clearLoader();
            alert('Something went wrong while searching!')
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})


/*-----------------------------------------------
----------------RECIPE CONTROLLER----------------
-------------------------------------------------
*/

const controlRecipe = async () => {
    // Get the ID from the URL
    const id = window.location.hash.replace('#', '');
    if (id) {
        
        // Prepare UI for Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //  Highlight selected search item
        if (state.search)  searchView.highlightSelected(id);
        // Create new recipe object
        state.recipe = new Recipe(id);
        // TESTING
        window.r = state.recipe;
        
        try {
        // Get recipe data  
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings, time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(err) {
            alert('Error processing recipe!');
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked 
        if (state.recipe.servings > 1) state.recipe.updateServings('dec') 
    }else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button clicked  
        state.recipe.updateServings('inc');  
    }
    recipeView.exportServingsIngredients(state.recipe);
    console.log(state.recipe);
});

window.l = new List();
