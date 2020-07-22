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
let responseJson;

function query() {
    let lat = localStorage.getItem("lat");
    let lon = localStorage.getItem("lng");
    const radius = $('#radius').val();
    const searchTerms = document.getElementById('searchTerms').value;
    const errorEl = document.getElementById("error");
    errorEl.classList.add('hidden');
    fetch(`/query`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            if (response.status === "OK") {
                let choice = response.pick;
                errorEl.innerText = choice;
                resultsPage(choice);
                saveSearch(lat, lon, radius, searchTerms, choice);
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request';
            else if (response.status === "ZERO_RESULTS")
                throw 'No results';
            else if (response.status === "NO_REROLLS")
                throw 'No re-rolls left';
            else
                throw 'Unforeseen error';
        })
        .catch((error) => {
            errorEl.classList.remove('success-banner');
            errorEl.classList.remove('hidden');
            errorEl.classList.add('error-banner');
            errorEl.innerText = error;
        });
}

/*
    LOCATION AND DIRECTION FUNCTIONS
*/

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

//Directions to the selected restaurant
function initMap() {
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  let lat = localStorage.getItem("lat")
  let lng = localStorage.getItem("lng")
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: parseFloat(lat), lng: parseFloat(lng)}
  });
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("directionsPanel"));
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  let start = localStorage.getItem("lat") + "," + localStorage.getItem("lng");
  directionsService.route(
    {
      origin: start,
      destination: "1745 Plymouth Rd, Ann Arbor, MI 48105",
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

/*
    DROPDOWN MENU FUNCTIONS
*/

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

function backToHome() {
    window.location.replace("index.html");
}

function toAccount() {
    window.location.replace("account-info.html");
}

function toSearches() {
    window.location.replace("past-searches.html");
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

/*
    SAVING AND RETRIEVING PAST SEARCHES FUNCTIONS
*/

function saveSearch(lat, lng, radius, keyword, restaurantName){
    let userID = 0;
    if(localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}&radius=${radius}&keywords=${keyword}&lat=${lat}&lng=${lng}&restaurantName=${restaurantName}`, {
        method: 'POST'
    });
}

function getSearches(){
    let userID = 0;
    if(localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    
    fetch(`/searches?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((searches) => {
        let searchesEl = document.getElementById('cards');
        searches.forEach((search) => {
            let searchCard = createSearchElement(search);
            searchesEl.appendChild(searchCard);
        });
    });
}

function createSearchElement(search) {
    const newCardEl = document.createElement('div');
    newCardEl.className = 'card card-2';
    const newCardBody = document.createElement('div');
    newCardBody.className = 'card-body';
    //creating the restaurant name element
    const nameElement = document.createElement('p2');
    nameElement.id = 'restaurant-name';
    nameElement.innerText = search.restaurantName;
    newCardBody.appendChild(nameElement);
    newCardBody.appendChild(document.createElement('br'));

    //creating the list of parameters
    const paramElement = document.createElement('p3');
    const tempParamElement = "Parameters: " + search.keywords;

    // tempParamElement += radius;
    paramElement.innerText = tempParamElement;
    newCardBody.appendChild(paramElement);

    newCardBody.appendChild(document.createElement('br'));

    //creating the feedback element
    const feedbackElement = document.createElement('p3');

    feedbacks = getFeedback(search);
    let tempFeedbackElement = feedbacks[0];
    feedbackElement.innerText = tempFeedbackElement;
    newCardBody.appendChild(feedbackElement);
    newCardBody.appendChild(document.createElement('br'));

    // creating the buttons and filling in the feedback element 
    let buttons = feedbacks[1];
    newCardBodyWithButtons = createSearchesButtons(search, buttons, newCardBody);
    newCardEl.appendChild(newCardBodyWithButtons);
    return newCardEl;
}

function createSearchesButtons(search, buttons, newCardBody) {
    let feedbackButton = null;
    let formEl = document.getElementById('searches-form');
    if (buttons) {
        let modal = document.getElementById('searchModal');
        let span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            let restaurantContainerEl = document.getElementById("restaurant-name-container");
            restaurantContainerEl.remove();
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                let restaurantContainerEl = document.getElementById("restaurant-name-container");
                restaurantContainerEl.remove();
                modal.style.display = "none";
            }
        }
        feedbackButton = document.createElement('button');
        feedbackButton.className = 'btn1 feedback';
        feedbackButton.innerText = "Submit Feedback";
        feedbackButton.addEventListener('click', () => {
            let restaurantNameEl = createRestaurantElement(search.restaurantName);
            formEl.appendChild(restaurantNameEl);
            modal.style.display = "block";
        });
        newCardBody.appendChild(feedbackButton);
    }
    let searchButton = document.createElement('button');
    searchButton.className = 'btn1 search';
    searchButton.innerText = "Search with These Parameters Again";
    newCardBody.appendChild(searchButton);
    // searchButton.addEventListener('click', () => {
    //     reroll()});
    return newCardBody;
}

function createRestaurantElement(restaurantName) {
    let inputGroupEl = document.createElement('div');
    inputGroupEl.className = "input-group";
    inputGroupEl.id = "restaurant-name-container";
    let inputContainer = document.createElement('input');
    inputContainer.className = "input--style-2";
    inputContainer.type = "text";
    inputContainer.id = restaurantName + "-fill";
    inputContainer.value = restaurantName;
    inputContainer.innerText = restaurantName;
    inputGroupEl.appendChild(inputContainer);
    return inputGroupEl;
}

function getFeedback(search) {
    let userID = 0;
    let submitted = false;
    if (localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/feedback?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((feedbackList) => {
        for (feedback in feedbackList) {
            if (feedback.restaurantName == search.restaurantName) {
                submitted = true;
            }
        }
    });
    let tempFeedbackElement;
    let buttons;
    //feedback
    if (!submitted) {
        tempFeedbackElement = "Feedback: You haven't submitted feedback yet";
        buttons = true;
    } else {
        //search.feedback.notes? which rating? search.feedback.restaurantRating + notes
        tempFeedbackElement = "Feedback" + search.feedback;
        buttons = false;
    }
    return [tempFeedbackElement, buttons];
}

$('#randomize-form').submit(function(event) {
    const errorEl = document.getElementById("error");
    errorEl.classList.add('hidden');

    event.preventDefault();
    let url = $(this).attr('action');
    let lat = localStorage.getItem("lat");
    let lng = localStorage.getItem("lng");
    let queryStr = $(this).serialize() + `&lat=${lat}&lng=${lng}`;

    $.ajax({
        type: "POST",
        url: url,
        data: queryStr,
        success: function(response) {
            query();
        }
    });
});

$("input, textarea").blur(function() {
    if ($(this).val() != "") {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
});

function resultsPage(pick) {
    fetch(`../results.html`)
        .then(html => html.text())
        .then((html) => {
            document.getElementById("page-container").appendChild(html);
            document.getElementById("pick").innerText = pick;
        });
}

function reroll() {
    const pickEl = document.getElementById("pick");
    fetch(`/query`, { method: 'GET' })
        .then(response => response.json())
        .then((response) => {
            responseJson = response; // Debug
            if (response.status === "OK") {
                pickEl.innerText = response.pick;
            } else if (response.status === "INVALID_REQUEST")
                throw 'Invalid request';
            else if (response.status === "ZERO_RESULTS")
                throw 'No results';
            else if (response.status === "NO_REROLLS")
                throw 'No re-rolls left';
            else
                throw 'Unforeseen error';
        })
        .catch((error) => {
            pickEl.innerText = error;
        });
}

/*
    FUNCTIONS TO HANDLE USERS SIGNING IN
*/
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

function toggleShow() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdown = document.getElementById("myDropdown");
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
  }
}

/*
    FUNCTIONS RELATED TO THE ACCOUNTS PAGE
*/

function accountFunctions() {
    getNumSearches();
    getLastVisited();
    getFavFood();
    getNumReviews();
}

function getNumSearches() {
    let count = 0;
    let numSearchesEl = document.getElementById('num-searches');
    if (localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((searches) => {
        searches.forEach((search) => {
            count += 1;
        });
    });
    numSearchesEl.innerText = count;
}

function getLastVisited() {
    let lastVisitedEl = document.getElementById('last-visited');
    if (localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((searches) => {
        lastVisitedEl.innerText = searches[0].name()});
}

function getFavFood() {
    let food = document.getElementById('fav-food');
    fetch(`/fav-food?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((foods) => {
        if (foods[0].length == 0) {
            food.appendChild('<textarea id="food-selection" placeholder="or foods :)"></textarea>');
        } else {
            food.innerText = foods[0];
        }
    });
}

function getNumReviews() {
    let count = 0;
    let numFeedbackEl = document.getElementById('num-feedback');
    if (localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/feedback?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((feedbackList) => {
        feedbackList.forEach((feedback) => {
            count += 1;
        });
    });
    numFeedbackEl.innerText = count;
}
