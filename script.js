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

    const selectedRestaurant = restaurant[Math.floor(Math.random() * restaurants.length)];
    window.location.replace("results.html");
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerText = selectedRestaurant;
}