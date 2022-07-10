async function getTrendingMoviesPreview(params) {
    const res = await fetch('https://api.themoviedb.org/3/trending/all/day?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;
}