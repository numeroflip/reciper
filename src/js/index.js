// https://forkify-api.herokuapp.com/api/search

import { elements, renderLoader, clearLoader }  from './views/base';
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/* Global state of the app 
    -Search object
    -Current recipe object
    -Shopping list object
    -Liked recipes
*/
const state = {};
window.state = state;

/*-----------------------------------------------
----------------SEARCH CONTROLLER-------------------------------
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
----------------RECIPE CONTROLLER-----------------------------
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

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked 
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec') 
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button clicked  
        state.recipe.updateServings('inc');  
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
    recipeView.exportServingsIngredients(state.recipe);
    console.log(state.recipe);
});

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));



/*-----------------------------------------------
----------------LIST CONTROLLER-----------------------------
-------------------------------------------------*/

const controlList = () => {
    // Create a list if there is none yet
    if(!state.list) {
        state.list = new List();
    }

    // Add each ingredients to the list and the UI
    state.recipe.ingredients.forEach(el => {
        state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(el);
    })

};
//  Handling delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
        // Handle the count
    } else if (e.target.matches('.shopping__count-value')) { 
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

