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

const apiKey = 'AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc';
let searchResults;

function chooseRandomRestaurant() {
    const restaurants = [
        "Panera Bread",
        "Qdoba",
        "Los Tacos No 1",
        "The Modern",
        "Piccola Cucina",
        "Superiority Burger",
        "Cote",
        "Marea"
    ]
    const selectedRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const resultsText = document.getElementById("selected-restaurant");
    resultsText.innerText = selectedRestaurant;
}

function loadPage() {
    window.location.replace("results.html");
}

function test() {
    let obj;
    let url = 'https://jsonplaceholder.typicode.com/posts/1';

    fetch(url)
        .then(response => response.json())
        .then(data => obj = data)
        .then(() => console.log(obj))
}

function query() {
    const lat = -33.8670522;
    const long = 151.1957362;
    // const lat = 39.109635;
    // const long = -108.542347;
    const radius = document.getElementById('distance').value;
    const type = 'restaurant';
    const keyword = document.getElementById('searchTerms').value;
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'location=' + lat + ',' + long + '&radius=' + radius + '&type=' + type + '&keyword=' + keyword + '&key=' + apiKey;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyurl + url)
        .then(response => response.json())
        .then(response => searchResults = response)
        .then(() => {
            let restaurantResults = searchResults["results"];
            weightedRestaurant = weightRestaurants(restaurantResults);
            console.log(weightedRestaurant)
        })
        //console.log(searchResults))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

// retrieves the user's current location, if allowed -> not sure how to store this/return lat, lng vals for query function
function getLocation() {
    location = document.getElementById("location-container");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

      console.log(pos);
      location = pos;
    }, function() {
        // Geolocation service failed
      pos = {lat: 0, lng: 0};
      console.log(pos);
      location = pos;
    });
  } else {
    // Browser doesn't support Geolocation
    pos = {lat: -34.397, lng: 150.644};
    console.log(pos);
    location = pos;
  }
}

// convert lat/lng format to human-readable address --> my goal was to call this in the above function and store the human-readable
// address in the location-container spot (so it was in the spot as the sydney australia address)
function convertLocation(location) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + apiKey;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyurl + url)
        .then(response => response.json())
        .then(response => location = response)
        .then(() => console.log(location))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

function weightRestaurants(restaurants) {
    requestedPrice = document.getElementById('price');
    requestedRating = document.getElementById('rating');
    requestedType = document.getElementById('type');
    requestedDietary = document.getElementById('dietary');

    restaurantMap = new Map(); 
    for (restaurant in restaurants) {
        score = 1;
        priceLevel = restaurant.get("price_level");
        ratingLevel = restaurant.get("rating");
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
    total = restaurantMap.values().sum();
    selected = Math.floor(Math.random() * total);
    prevScore = 0;
    for (i = 0; i < restaurants.length; i++) {
        prevScore = restaurantMap.get(restaurants[i-1]);
        curScore = restaurantMap.get(restaurants[i]);
        if (prevScore <= selected && selected < prevScore + curScore) {
            return restaurants[i];
        }
        prevScore = prevScore + curScore;
    }
}
