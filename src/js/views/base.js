
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

export const elements = {
    searchForm: $('.search'),
    searchInput: $('.search__field'),
    searchResultList: $('.results__list')
};