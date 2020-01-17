
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

export const elements = {
    searchForm: $('.search'),
    searchInput: $('.search__field'),
    searchResultList: $('.results__list'),
    searchResPages: $('.results__pages'),
    searchRes: $('.results'),
    recipe: $('.recipe'),
    shopping: $('.shopping__list')
};

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class=${elementStrings.loader}>
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    ` ;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = $("." + elementStrings.loader);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}