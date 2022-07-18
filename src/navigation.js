// Decide the page for the api
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
    location.hash = '#search=' + searchFormInput.value;
});
trendingBtn.addEventListener("click", () => {
    location.hash = '#trends';
});
window.addEventListener('DOMContentLoaded', () => {
        // Agregando un estado de carga inical
        window.history.pushState({ loadUrl: window.location.href }, null, '');
    },
    false,
);
arrowBtn.addEventListener("click", () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = '';
    } else {
        window.history.back();
    }
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

// Listen every scroll on my app
window.addEventListener("scroll", infiniteScroll, false);


function navigator() {
    console.log({ location });

    // Como cada vez que navegemos se va a crear un distinto infScroll,
    // para evitar tener mas de los necesarios, lo removemos 
    if (infiniteScroll) {
        window.removeEventListener("scroll", infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }

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
    // scroll Top, en algunos navegadores no funciana
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Le agregamo lo que haya agarrado la funcion que haya agarrado la var
    // en la navegacion y la agregamos al event listener
    infiniteScroll && window.addEventListener("scroll", infiniteScroll, { passive: false });

}


function homePage() {
    console.log('Home!!!');

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesMoviesPreview();
}
function trendsPage() {
    console.log("Trends!!!");

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');   
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = "Trending"

    getTrendingMovies();

    // We tell to infinite scroll in what page i am
    infiniteScroll = getPaginatedTrendingMovies;
}
function searchPage() {
    console.log('Search!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');


    // ['#search', 'searchedValue']
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query)
}
function movieDetailsPage() {
    console.log('Movie!!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    // ['#movie', '23454']
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);

}
function categoriesPage() {
    console.log('Category!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // Sacando el id de la url
    const [_, categoryData] = location.hash.split('='); // ['#category, 'id-name]
    const [categoryId, categoryName] = categoryData.split("-");

    headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);
}

