const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const selectMovie = document.getElementById("movie");
let count = document.getElementById("count");
let total = document.getElementById("total");

populateUI();
let ticketPrice = +selectMovie.value;

// Set Movie data and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Update selected Count using value from selected movie
function updateCountAndTotal() {
  let selectedSeatsCount = document.querySelectorAll(".row .seat.selected");
  count.innerHTML = selectedSeatsCount.length;
  ticketPrice
    ? (total.innerText = selectedSeatsCount.length * ticketPrice)
    : (total.innerText = " => Please select a movie");

  // get seleted seats into an array
  // map through array
  // return a new array
  // index of returns index of array
  const seatsIndex = [...selectedSeatsCount].map((seat) =>
    // this returns the index of elements containing class of selected in this case
    // every time we click this map functions runs and returns a list containing indexes of
    // elements with class selected

    [...seats].indexOf(seat)
  );
  localStorage.setItem("seatIndex", JSON.stringify(seatsIndex));
}

// Populate UI
function populateUI() {
  // getting stored index of selected seats from local storage
  const selectedSeats = JSON.parse(localStorage.getItem("seatIndex"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    // looping through list of seats
    seats.forEach((seat, index) => {
      // indexOf() returns index of given value
      // here we are checking if selectedSeats contains the seat from seats
      // if yes than add class of selected
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    // The selectedIndex property sets or returns the index of the selected
    // option in a drop-down list. The index starts at 0.
    selectMovie.selectedIndex = selectedMovieIndex;
  }
}

// Movie select eventListner
selectMovie.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateCountAndTotal();
});

// Event Listener
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateCountAndTotal();
  }
});

// update count and total happens only on event change
// we need to trigger the updateCountAndTotal()
updateCountAndTotal();