// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

function convertPriceLevel(priceLevel) {
    let priceLevelStr = "";
    for (let i = 0; i <= priceLevel; i++)
        priceLevelStr += "$";
    return priceLevelStr;
}

//Retrieve and display restaurant image
function loadImage(photoUrl) {
    let photoEl = document.getElementById("photo");
    photoEl.innerHTML = "";

    let img = document.createElement('img');
    img.src = photoUrl;
    photoEl.appendChild(img);
}

/* ==========================================================================
   DIRECTIONS TO THE RESTAURANT
   ========================================================================== */
let directionsRenderer;
let directionsService;

function addMapScript() {
    let script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw&callback=initMap';
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

function initMap() {
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    let lat = localStorage.getItem("lat")
    let lng = localStorage.getItem("lng")
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directionsPanel"));
    calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let start = localStorage.getItem("lat") + "," + localStorage.getItem("lng");
    let end = localStorage.getItem("restaurantAddress");
    directionsService.route({
            origin: start,
            destination: end,
            travelMode: "DRIVING"
        },
        function(response, status) {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}
