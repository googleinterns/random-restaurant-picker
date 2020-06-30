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

// function loadPage() {
//     window.location.replace("results.html");
// }

function test() {
    let obj;
    let url = 'https://jsonplaceholder.typicode.com/posts/1';

    fetch(url)
        .then(response => response.json())
        .then(data => obj = data)
        .then(() => console.log(obj))
}

function test2() {
    let url = 'https://jsonplaceholder.typicode.com/posts/1';
    let url2 = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc';

    $.getJSON(url2, function(response) {
        console.log(response);
    });
}

function test3() {
    let obj;
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc';

    fetch(url)
        .then(response => response.json())
        .then(data => obj = data)
        .then(() => console.log(obj))
}

function test4() {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc';
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + url)
        .then(response => response.json())
        .then(contents => console.log(contents))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
}
