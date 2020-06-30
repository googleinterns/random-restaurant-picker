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

/*=========================
    RESTAURANT QUERY AND RE-ROLL
 =========================*/
$("#randomize-form").submit(function(event) {
    const errorEl = document.getElementById("error");
    errorEl.classList.add("hidden");

    event.preventDefault();
    let url = $(this).attr("action");
    let lat = localStorage.getItem("lat");
    let lng = localStorage.getItem("lng");
    let userID = 0;
    if (localStorage.getItem("loggedIn")) {
        userID = localStorage.getItem("user");
    }
    let queryStr = $(this).serialize() + `&lat=${lat}&lng=${lng}&user=${userID}`;
    query(queryStr);
});

function query(queryStr) {
    const errorEl = document.getElementById("error");
    fetch(`/query?${queryStr}`, { method: "POST"})
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.status === "OK") {
                let name = response.pick.name;
                let rating = response.pick.rating + ' ★';
                let photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=' + response.pick.photos[0].photoReference + '&key=';
                errorEl.innerText = name;
                resultsPage(name, rating, photoUrl);
            } else if (response.status === "INVALID_REQUEST") throw "Invalid request";
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

function reroll() {
    const pickEl = document.getElementById("pick");
    const ratingEl = document.getElementById("rating");
    fetch(`/query`, { method: "GET" })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === "OK") {
                pickEl.innerText = response.pick.name;
                ratingEl.innerText = response.pick.rating + ' ★';
                let photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=' + response.pick.photos[0].photoReference + '&key=';
                loadImage(photoUrl);
            } else if (response.status === "INVALID_REQUEST") throw "Invalid request";
            else if (response.status === "ZERO_RESULTS") throw "No results";
            else if (response.status === "NO_REROLLS") throw "No re-rolls left";
            else throw "Unforeseen error";
        })
        .catch((error) => { pickEl.innerText = error; });
}

/*=========================
    USER'S LOCATION AND ADDRESS
 =========================*/
function getLocation() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(geoLocEnabled, geoLocFallback);
    else
        geoLocFallback();
}

// Geolocation is supported and enabled
function geoLocEnabled(position) {
    let locationEl = document.getElementById("location-container");
    let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    };
    localStorage.setItem("lat", pos.lat);
    localStorage.setItem("lng", pos.lng);
    convertLocation(pos).then((address) => { locationEl.innerText = address; });
}

// Use inaccurate IP-based geolocation instead
function geoLocFallback() {
    let locationEl = document.getElementById("location-container");
    fetch("/geolocate", {method: "POST"}).then(response => response.json()).then(response => {
        try{
            let pos = {
                lat: response.location.lat,
                lng: response.location.lng,
            };
            console.log(response);
            localStorage.setItem("lat", pos.lat);
            localStorage.setItem("lng", pos.lng);
            convertLocation(pos).then((address) => { locationEl.innerText = address; });
        } catch(error){
            throw "Location not found";
            geoLocHardcoded();
        }
    });
}

// TODO: remove this entirely; fallback should be to leave form blank instead
function geoLocHardcoded() {
    let locationEl = document.getElementById("location-container");
    let pos = { lat: 40.730610, lng: -73.935242 };
    localStorage.setItem("lat", pos.lat);
    localStorage.setItem("lng", pos.lng);
    convertLocation(pos).then((address) => {
        locationEl.innerText = address;
    });
}

// Convert lat/lng to human readable address
function convertLocation(location) {
    let lat = location.lat;
    let long = location.lng;
    return fetch(`/convert?lat=${lat}&lng=${long}`)
        .then(response => response.json())
        .then((response) => { return response.results[0].formatted_address; })
        .catch((error) => console.log(error));
}

/*=========================
    USER SIGN-IN
 =========================*/
function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    let profile = googleUser.getBasicProfile();
    fetch(`/login?id_token=${id_token}`)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("user", data.sub);
            localStorage.setItem("loggedIn", true);
            addUserContent(profile.getName(), profile.getImageUrl());
            toggleAccountMenu();
        }).catch((error) =>{
            console.log(error);
        });
}

//Add user information to signed in UI
function addUserContent(name, image) {
    document.getElementById("user-name").innerText = name;
    document.getElementById("profile-pic").src = image;
}

//Replaces the sign-in button with signed in UI
function toggleAccountMenu() {
    document.getElementById("account-menu").classList.toggle("show");
    document.getElementById("sign-in").classList.toggle("hide");
}

//Logs out of the account
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log("User signed out.");
    });
    localStorage.setItem("user", 0);
    localStorage.setItem("loggedIn", false);
    toggleAccountMenu();
}

function toggleShow() {
    document.getElementById("myDropdown").classList.toggle("show");
}

//Close account dropdown when clicking elsewhere
window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
        let dropdownEl = document.getElementById("myDropdown");
        if (dropdownEl.classList.contains("show")) {
            dropdownEl.classList.remove("show");
        }
    }
};

/*=========================
    USER SIGN-IN
 =========================*/
function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    let profile = googleUser.getBasicProfile();
    fetch(`/login?id_token=${id_token}`)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("user", data.id);
            localStorage.setItem("loggedIn", true);
            addUserContent(profile.getName(), profile.getImageUrl());
            toggleAccountMenu();
        }).catch((error) =>{
            console.log(error);
        });
}

//Add user information to signed in UI
function addUserContent(name, image) {
    document.getElementById("user-name").innerText = name;
    document.getElementById("profile-pic").src = image;
}

//Replaces the sign-in button with signed in UI
function toggleAccountMenu() {
    document.getElementById("account-menu").classList.toggle("show");
    document.getElementById("sign-in").classList.toggle("hide");
}

//Logs out of the account
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log("User signed out.");
    });
    localStorage.setItem("user", 0);
    localStorage.setItem("loggedIn", false);
    toggleAccountMenu();
}

function toggleShow() {
    document.getElementById("myDropdown").classList.toggle("show");
}

//Close account dropdown when clicking elsewhere
window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
        let dropdownEl = document.getElementById("myDropdown");
        if (dropdownEl.classList.contains("show")) {
            dropdownEl.classList.remove("show");
        }
    }
};

/*=========================
    Retrieving SEARCHES
 =========================*/
//Retrieve searches associated with the current user
function getSearches() {
    let userID = 0;
    if (localStorage.getItem("loggedIn")) {
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}`, { method: "GET" })
        .then((response) => response.json())
        .then((searches) => {
            const searchesEl = document.getElementById("cards");
            searches.forEach((search) => {
                searchesEl.appendChild(createSearchElement(search));
            });
        });
}

/*=========================
    HTML
 =========================*/
// Form underline element
$("input, textarea").blur(function() {
    if ($(this).val() != "") {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
});

// TODO: make this more seamless
//Loads the results page
function resultsPage(name, rating, photoUrl) {
    fetch(`../results.html`)
        .then((html) => html.text())
        .then((html) => {
            document.getElementById("page-container").innerHTML = html;
            document.getElementById("pick").innerText = name;
            document.getElementById("rating").innerText = rating;
            loadImage(photoUrl);
        });
}

//Retrieve and display restaurant image
async function loadImage(photoUrl) {
    let photoEl = document.getElementById("photo");
    photoEl.innerHTML = "";

    let img = document.createElement('img');
    let url = encodeURIComponent(photoUrl);
    img.src = `/image?url=${url}`;
    photoEl.appendChild(img);
}