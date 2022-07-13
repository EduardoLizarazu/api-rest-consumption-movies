const api = axios.create({
    baseURL : 'https://api.themoviedb.org/3/',
    headers : {
        'content-type' : 'application/json;charset=utf-8'
    },
    params : {
        'api_key' : API_KEY
    }
});


// Utils

function createMovies(movies, container) {
    container.innerHTML = "";
    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        // Movie details
        movieContainer.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'http://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg);
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

    createMovies(movies, trendingMoviesPreviewList);
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

    createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params : {
            query
        },
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getTrendingMovies() {
    const { data } = await api('trending/all/day');
    const movies = data.results;

    createMovies(movies, genericSection);
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

}
