
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith("#search=")) {
        searchPage()
    } else if (location.hash.startsWith("#movie=")) {
        movieDetailsPage()
    } else if (location.hash.startsWith("#category=")) {
        categoriesPage()
    } else {
        homePage();
    }
}


function homePage() {
    getTrendingMoviesPreview();
    getCategoriesMoviesPreview();
    console.log('Home!!!');
}
function trendsPage() {
    console.log("Trends!!!");
}
function searchPage() {
    console.log('Search!!!');
}
function movieDetailsPage() {
    console.log('Movie!!!');
}
function categoriesPage() {
    console.log('Category!!!');
}

