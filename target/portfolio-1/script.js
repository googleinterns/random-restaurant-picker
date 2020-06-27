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

function simulateLocationAccess() {
    alert("Allow Random Restaurant Picker to Use Your Location?");
}

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

function loadPage(){
    window.location.replace("results.html");
}

function getResults() {
    fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBcmH-zM_eWqi8tVB4CaVHNGERZvWeS6hU").then(response => response.json()).then((responseJson)=>console.log(responseJson));
    
    //console.log("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyAe6XHsLdycEkorMAKZN_7wtkWP8TQWtAg");
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

      console.log(pos);
      return pos;
    }, function() {
        // Geolocation service failed
      pos = {lat: 0, lng: 0};
      console.log(pos);
      return pos;
    });
  } else {
    // Browser doesn't support Geolocation
    pos = {lat: -34.397, lng: 150.644};
    console.log(pos);
    return pos;
  }
}
