// Data

const api = axios.create({
    baseURL : 'https://api.themoviedb.org/3/',
    headers : {
        'content-type' : 'application/json;charset=utf-8'
    },
    params : {
        'api_key' : API_KEY
    }
});

// Nos devuelve todo lo guardado en ese lugar en LS
function likedMovieList() {
    const item = JSON.parse(localStorage.getItem("liked_movies"));
    let movies = !!item ? item : {};
    return movies;
}


function likeMovie(movie) {
    const likedMovies = likedMovieList();
    if (likedMovies[movie.id]) {
        // remover de LS
        likedMovies[movie.id] = undefined;
    } else {
        // agregar la peli de LS
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}
// Utils

// No ponemos options, porque por defecto nos va a observar todo el documento
const lazyLoading = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // const url = movieImg.getAttribute('data-src');
            const url = entry.target.getAttribute('data-src')
            // movieImg.setAttribute('src', url);
            entry.target.setAttribute('src', url);
            // observer.unobserve(entry.target); Undefine la segunda ?
        }
    });
});

// SI no queremos que tenga lazyloading
function createMovies(movies, container, { lazyLoad = false, clean=true } = {}) {

    clean && (container.innerHTML = "");

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        // Movie details
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-src' : 'src', 
            'http://image.tmdb.org/t/p/w300/' + movie.poster_path
        );
        movieImg.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });
        movieImg.addEventListener("error", () => {
            movieImg.setAttribute("src", "../Assets/img/img-404.jpg");
        });

        // Liked Button
        const movieBtn = document.createElement("button");
        movieBtn.classList.add("movie-btn");
        movieBtn.addEventListener("click", () => {
            movieBtn.classList.toggle("movie-btn---liked");
            likeMovie(movie);
        });

        // Observe
        lazyLoad && lazyLoading.observe(movieImg);

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);

    });
}

function createCategory(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', "id" + category.id);
        categoryTitle.addEventListener("click", () => {
            // name para que se entienda mejor
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

// Llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/all/day');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, true);
}

async function getCategoriesMoviesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    createCategory(categories, categoriesPreviewList);
}


async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params : {
            with_genres : id
        },
    });
    const movies = data.results;

    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true });
}

// Closure
function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
    
        const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);
        
        const pageIsNotMax = page < maxPage
        
        if (scrollIsButton && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
    
            const movies = data.results;
    
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params : {
            query
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection);
}

// Closure
function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
    
        const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        const pageIsNotMax = page < maxPage
    
        if (scrollIsButton && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
    
            const movies = data.results;
    
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/all/day');
    const movies = data.results;

    // Max Pages
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
    
    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerHTML = 'Cargar mas';
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

}

async function getPaginatedTrendingMovies() {
    
    // Remove the create button bellow
    // genericSection.querySelector("button") &&  genericSection.querySelector("button").remove();

    const { 
        scrollTop, 
        scrollHeight, 
        clientHeight 
    } = document.documentElement;

    const scrollIsButton = (scrollTop + clientHeight) >= (scrollHeight - 15);

    // Quiero que mi pagina no sea la maxima a la que podemos llegar
    const pageIsNotMax = page < maxPage

    if (scrollIsButton && pageIsNotMax) {
        page++;
        const { data } = await api('trending/all/day', {
            params: {
                page,
            },
        });

        const movies = data.results;

        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }

    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerHTML = 'Cargar mas';
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

async function getMovieById(id) {

    // Renombramos
    const { data : movie } = await api('movie/' + id);
    
    const movieImgUrl = 'http://image.tmdb.org/t/p/w500/' + movie.poster_path;
    
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
        `;
        
        movieDetailTitle.textContent = movie.title;
        movieDetailDescription.textContent = movie.overview;
        movieDetailScore.textContent = movie.vote_average;
        
        createCategory(movie.genres, movieDetailCategoriesList);
        getRelatedMoviesId(id);
    }
    
async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
    relatedMoviesContainer.scrollTo(0, 0);
}