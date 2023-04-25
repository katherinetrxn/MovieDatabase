// API KEY: "http://www.omdbapi.com/?i=tt3896198&apikey=72ab1b5"

// SLIDER & TOGGLE FILTER
  
const slider = document.getElementById("range");
const output = document.getElementById("value");
const toggle = document.querySelector(".toggle");
const toggleText = document.querySelector(".toggle__text");
const releaseDate = document.querySelector("#main__year--label");

output.innerHTML = slider.value;

function sliderChange() {
  if (filterOn) {
    output.innerHTML = slider.value;
    releaseDate.innerHTML = `Release Date: <b class="blue">${output.innerHTML}</b>`;
    renderMovies();
  }
};

function toggleYearFilter(event) {
  filterOn = event.target.checked;
  renderMovies();
  toggleText.innerHTML = filterOn ? "ON" : "OFF";
  releaseDate.innerHTML = filterOn ? `Release Year: <b class="blue">${output.innerHTML}</b>` : `Release Date: <b class="blue">N/A</b>`;
}

let filterOn = false;
toggleYearFilter({target: {checked: filterOn}});

// MOVIE FILTER

const searchInput = document.querySelector(".search-bar");
const searchResult = document.querySelector(".search__result");
const moviesListEl = document.querySelector(".movies");
const spinnerWrapper = document.querySelector(".spinner__wrapper");

async function renderMovies() {
  moviesListEl.innerHTML = ''
  spinnerWrapper.classList.add('movies__loading');

  const moviesCTA = document.querySelector('.movies__cta');
  if (moviesCTA) {
    moviesCTA.remove(); // remove the initial CTA to start
  }

  let filterString = '';
  if (filterOn) {
    filterString = `&y=${slider.value}`; // add year filter to search query
  };

  const url = `https://www.omdbapi.com/?i=tt3896198&apikey=74514e3b&s="${searchInput.value}"${filterString}`;
  const response = await fetch(url);
  const moviesData = await response.json();

  if (!moviesData.Search) {
    spinnerWrapper.classList.remove('movies__loading');
    modifySearchDisplay();
    return moviesNotFound(); // show error message if there are no search results
  };
  
  let filteredMovies = filterOn && searchInput.value ? moviesData.Search.filter(movie => movie.Year === slider.value) : moviesData.Search;
  
  setTimeout(() => {
    spinnerWrapper.classList.remove('movies__loading');
    moviesListEl.innerHTML = filteredMovies.map(movie => moviesHTML(movie)).join(''); // render filtered movies
  }, 300);

  modifySearchDisplay();

  if (moviesData.Search.length > 6) {
    filteredMovies = filteredMovies.slice(0, 6);
  };
};


function moviesHTML(movie) {
    return `<div class="movie-wrapper">
    <div class="movie">
      <figure class="movie__img">
        <div class="movie__img--overlay">
          <p>More info <i class="fa-solid fa-arrow-right"></i></p>
        </div>
        <img
          class="figure__img"
          src="${movie.Poster}"
          alt=""
        />
      </figure>
      <h2 class="movie__title">${movie.Title}</h2>
      <p class="movie__year">${movie.Year}</p>
    </div>
  </div>`;
};

function modifySearchDisplay () {
    const searchDisplay = document.querySelector(".search__result");
    searchDisplay.innerHTML = `Search results for\u00A0<b class="blue">"${searchInput.value}" </b>`;
    // "\u00A0" was added b/c the display wasn't including a space
};

function resetFilter() {
  location.reload();
};

function moviesNotFound() {
  moviesListEl.innerHTML = `<div class="reset">
  <h1 class="reset__title">Could not find any matches related to your search.</h1>
  <h2 class="reset__desc">Please change the filter or reset it below.</h2>
  <button class="reset__btn" onclick="resetFilter()">Reset Filter</button>
</div>`;
}

function toggleModal() {
  document.body.classList.toggle("modal--open");
};
