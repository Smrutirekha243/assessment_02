let movies = [];

// Fetch movie data from movies.json
async function loadMovies() {
    try {
        const response = await fetch("movies.json");
        movies = await response.json();
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

function myFunction(element) {
    const movieCard = element.closest(".movie-card");
    const selectedSlotInput = movieCard.querySelector(".selected-slot");

    if (element.style.backgroundColor === "green") {
        element.style.backgroundColor = ""; 
        selectedSlotInput.value = ""; 
    } else {
        
        const parent = element.closest(".slot-option");
        parent.querySelectorAll("input").forEach(btn => btn.style.backgroundColor = "");

        
        element.style.backgroundColor = "green";
        selectedSlotInput.value = element.value;
    }
}


function handleBooking(event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value.trim();
    const birthDate = document.getElementById("birthdate").value;

    if (name === "" || birthDate === "") {
        alert("Please enter your name and birthdate.");
        return;
    }

    const movieCard = event.target.closest(".movie-card");
    const movieName = movieCard.querySelector("h3").textContent;
    const selectedSlot = movieCard.querySelector(".selected-slot").value;

    if (!selectedSlot) {
        alert("Please select a slot before booking.");
        return;
    }

    alert(`🎟️ Ticket Confirmed!\n\nName: ${name}\nMovie: ${movieName}\nShow Time: ${selectedSlot}`);
}

function ageCalculator(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function getMovies() {
    const name = document.getElementById("name").value.trim();
    const birthDate = document.getElementById("birthdate").value;
    const movieContainer = document.getElementById("movie-list");

    movieContainer.innerHTML = "";

    if (name === "" || birthDate === "") {
        alert("Please enter your name and birthdate.");
        return;
    }

    const age = ageCalculator(birthDate);
    const filteredMovies = movies.filter(movie => age >= movie.ageRestriction);

    if (filteredMovies.length === 0) {
        movieContainer.innerHTML = "<p>No movies available for your age</p>";
    } else {
        filteredMovies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            movieCard.innerHTML = `
                <img src="${movie.posterUrl}" alt="${movie.name}">
                <h3>${movie.name}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Age: ${movie.ageRestriction}+</p>
                <p>Showtimes:</p>

                <form>
                    <div class="slot-option">
                        ${movie.showTime?.[0] ? `<input type="button" class="slot-timing" onclick="myFunction(this)" value="${movie.showTime[0]}">` : ""}
                        ${movie.showTime?.[1] ? `<input type="button" class="slot-timing" onclick="myFunction(this)" value="${movie.showTime[1]}">` : ""}
                        ${movie.showTime?.[2] ? `<input type="button" class="slot-timing" onclick="myFunction(this)" value="${movie.showTime[2]}">` : ""}
                    </div>

                    <input type="hidden" class="selected-slot" value="">

                    <br>
                    <button type="submit" class="book-btn">Book</button>
                </form>
            `;

            // Attach event listener for booking
            movieCard.querySelector(".book-btn").addEventListener("click", handleBooking);

            movieContainer.appendChild(movieCard);
        });
    }
}

loadMovies();
