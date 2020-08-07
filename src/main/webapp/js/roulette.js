/* ==========================================================================
   ROULETTE
   ========================================================================== */
function query(queryStr) {
    const errorEl = document.getElementById("error");
    fetch(`/query?${queryStr}`, { method: "POST" })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === "OK")
                redirectToUrl('results.html');
            else if (response.status === "INVALID_REQUEST") throw "Invalid request";
            else if (response.status === "ZERO_RESULTS") throw "No results";
            else if (response.status === "NO_REROLLS") throw "No re-rolls left";
            else throw "Unforeseen error";
        })
        .catch((error) => {
            errorEl.classList.remove("success-banner");
            errorEl.classList.remove("hidden");
            errorEl.classList.add("error-banner");
            errorEl.innerText = error;
        });
}

/* ==========================================================================
   RE-ROLL
   ========================================================================== */
function roll() {
    const pickEl = document.getElementById("pick");
    const infoEl = document.getElementById("info");
    fetch(`/query`, { method: "GET" })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === "OK") {
                pickEl.innerText = response.pick.name;
                infoEl.innerText = convertPriceLevel(response.pick.priceLevel);
                infoEl.innerText += " • " +  response.pick.rating + ' ★';
                let photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photoreference=' + response.pick.photos[0].photoReference + '&key=AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc';
                localStorage.setItem("restaurantAddress", response.pick.vicinity);
                loadImage(photoUrl);
                calculateAndDisplayRoute(directionsService, directionsRenderer);
            } else if (response.status === "INVALID_REQUEST") throw "Invalid request";
            else if (response.status === "ZERO_RESULTS") throw "No results";
            else if (response.status === "NO_REROLLS") throw "No re-rolls left";
            else throw "Unforeseen error";
        })
        .catch((error) => { pickEl.innerText = error; });
}
