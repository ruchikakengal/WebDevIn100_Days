const apiKey = 'd922c2b6';
const imdbId = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('movieDetails');

if (!imdbId || imdbId === 'undefined') {
  container.innerHTML = `<p>Invalid or missing movie ID in the URL.</p>`;
  throw new Error('No valid IMDb ID found in URL.');
}

async function fetchMovieDetails() {
  const container = document.getElementById('movieDetails');

  if (!imdbId) {
    container.innerHTML = `<p>Invalid or missing movie ID.</p>`;
    return;
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}&plot=full`);
    const data = await res.json();

    if (data.Response === 'False') {
      container.innerHTML = `<p>Movie not found: ${data.Error}</p>`;
      return;
    }

    const poster = data.Poster !== 'N/A' ? data.Poster : 'fallback.jpg';

    container.innerHTML = `
      <div class="movie-details-card">
        <img src="${poster}" alt="${data.Title}" />
        <div class="movie-info">
          <h1>${data.Title}</h1>
          <p><strong>Release Date:</strong> ${data.Released}</p>
          <p><strong>IMDB Rating:</strong> ${data.imdbRating} / 10</p>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Director:</strong> ${data.Director}</p>
          <p><strong>Actors:</strong> ${data.Actors}</p>
          <p><strong>Plot:</strong> ${data.Plot}</p>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Error fetching movie details:', err);
    container.innerHTML = `<p>Error loading movie. Please try again later.</p>`;
  }
}

fetchMovieDetails();
