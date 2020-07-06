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
function tryQuery() {
    let lat = localStorage.getItem("lat");
    let lon = localStorage.getItem("lng");
    const radius = document.getElementById('distance').value;
    const type = 'restaurant';
    const searchTerms = document.getElementById('searchTerms').value;

    const errorEl = document.getElementById("error");
    saveSearch(lat, lon, radius, searchTerms);
    errorEl.classList.add('hidden');
    fetch(`/query?lat=${lat}&lon=${lon}&radius=${radius}&type=${type}&searchTerms=${searchTerms}`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            if (response.status === "OK") {
                queryArr = response.results;
                console.log(queryArr);
                errorEl.classList.remove('error-banner');
                errorEl.classList.remove('hidden');
                errorEl.classList.add('success-banner');
                errorEl.innerText = "Success!";
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request'
            else if (response.status === "ZERO_RESULTS")
                throw 'No results'
            else
                throw 'Unforeseen error'
        })
        .catch((error) => {
            errorEl.classList.remove('success-banner');
            errorEl.classList.remove('hidden');
            errorEl.classList.add('error-banner');
            errorEl.innerText = error;
        });
}
let queryArr;

function loadPage() {
    window.location.replace("results.html");
}

// retrieves the user's current location, if allowed -> not sure how to store this/return lat, lng vals for query function
function getLocation() {
    let location = document.getElementById("location-container");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            localStorage.setItem("lat", pos.lat);
            localStorage.setItem("lng", pos.lng);
            convertLocation(pos).then((address)=>{
                console.log(address);
                location.innerText = address;
            });
        });
    } else {
    // Browser doesn't support Geolocation
        let pos = {lat: -34.397, lng: 150.644};
        localStorage.setItem("lat", pos.lat);
        localStorage.setItem("lng", pos.lng);
        convertLocation(pos).then((address)=>{
            console.log(address);
            location.innerText = address;
        });
    }
}

// convert lat/lng format to human-readable address --> my goal was to call this in the above function and store the human-readable
// address in the location-container spot (so it was in the spot as the sydney australia address)
function convertLocation(location) {
    let lat = location.lat;
    let long = location.lng;
    return fetch(`/convert?lat=${lat}&lng=${long}`)
        .then(response => response.json())
        .then(response => {
            console.log(response.results[0].formatted_address);
            return response.results[0].formatted_address;
        })
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;
  let profile = googleUser.getBasicProfile();
  fetch(`/login?id_token=${id_token}`).then(response => response.json()).then((data) => {
      localStorage.setItem("user", data.id); 
      localStorage.setItem("loggedIn", true);
      addUserContent(profile.getName(), profile.getImageUrl());
      toggleAccountMenu();
    }); 
}

function addUserContent(name, image){
    document.getElementById("user-name").innerText = name;
    document.getElementById("profile-pic").src = image;
}

function toggleAccountMenu() {
    document.getElementById("account-menu").classList.toggle('show');
    document.getElementById("sign-in").classList.toggle('hide');
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  localStorage.setItem("user", 0);
  toggleAccountMenu();
}

function saveSearch(lat, lng, radius, keyword){
    let userID = 0;
    if(localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}&radius=${radius}&keywords=${keyword}&lat=${lat}&lng=${lng}`, {
        method: 'POST'
    });
}

function getSearches(){
    let userID = 0;
    if(localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}`, {method: 'GET'}).then(response => response.json()).then(data => console.log(data));
}

function toggleShow() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdown = document.getElementById("myDropdown");
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
  }
}

function weightRestaurants(restaurants) {
    let requestedPrice = document.getElementById('price');
    let requestedRating = document.getElementById('rating');
    let requestedType = document.getElementById('type');
    let requestedDietary = document.getElementById('dietary');

    let restaurantMap = new Map(); 
    for (restaurant in restaurants) {
        let score = 1;
        let priceLevel = restaurant.get("price_level");
        let ratingLevel = restaurant.get("rating");
        if (requestedPrice == 0 || requestedPrice == priceLevel) {
            score += 4;
        } else if (Math.abs(requestedPrice-priceLevel) <= 1) {
            score += 3;
        } else if (Math.abs(requestedPrice-priceLevel) <= 2) {
            score += 2;
        }

        if (requestedRating == 0 || requestedRating == ratingLevel) {
            score += 4;
        } else if (Math.abs(requestedRating-ratingLevel) <= 1) {
            score += 3;
        } else if (Math.abs(requestedRating-ratingLevel) <= 2) {
            score += 2;
        } else if (Math.abs(requestedRating.ratingLevel) <= 3) {
            score += 1;
        }

        // not sure below is helpful/accurate - might want to eliminate b/c will prob get taken care of w $$$
        if (requestedType == "No preference" || 
        (requestedType == "Fast Food" && restaurant.get("types").contains("meal_takeaway")) || 
        (requestedType == "Dine-in" && !restaurant.get("types").contains("meal_takeaway"))) {
            score += 2;
        }

        if (restaurant.get("reviews").get("text").contains(requestedDietary)) {
            if (!(restaurant.get("reviews").get("text").contains("no " + requestedDietary)) || !(restaurant.get("reviews").get("text").contains("not " + requestedDietary))) {
                score += 4;
            }
        }
        restaurantMap.set(restaurant, score);
    }
    let total = restaurantMap.values().reduce((a,b) => a + b, 0);
    let selected = Math.floor(Math.random() * total);
    let prevScore = 0;
    for (i = 0; i < restaurants.length; i++) {
        prevScore = restaurantMap.get(restaurants[i-1]);
        let curScore = restaurantMap.get(restaurants[i]);
        if (prevScore <= selected && selected < prevScore + curScore) {
            return restaurants[i];
        }
        prevScore = prevScore + curScore;
    }
}

