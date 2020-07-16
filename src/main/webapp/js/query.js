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
        const searchesEl = document.getElementById('cards');
        searches.forEach((search) => {
            searchesEl.appendChild(createSearchElement(search));
        });
    });
}

function createSearchElement(search) {
    const newCardEl = document.createElement('div');
    newCardEl.className = 'card card-2';
    const newCardBody = document.createElement('div');
    newCardBody.className = 'card-body';

    const nameElement = document.createElement('p2');
    // need to create a name attribute of search - linked to name of returned restaurant
    nameElement.innerText = search.name();

    const paramElement = document.createElement('p3');
    const tempParamElement = "Parameters: ";
    // pull from search object
    for (items in search.keywords()) {
        tempParamElement += items;
        tempParamElement += ", ";
    }
    tempParamElement += radius;
    paramElement.innerText = tempParamElement;

    const feedbackElement = document.createElement('p3');
    const tempFeedbackElement = "Feedback: ";
    const buttons = null;
    feedbackElement.innerText, buttons = getFeedback(tempFeedbackElement, buttons, search);
    feedbackButton = null;
    searchButton = null;
    const centerButtons = document.createElement('div1');
    if (buttons) {
        searchButton = createSearchesButtons(buttons, search);
    } else {
        searchButton, feedbackButton = createSearchesButtons(buttons, search);
    }
    if (feedbackButton == null) {
        centerButtons.innerHTML = searchButton;
    } else {
        centerButtons.innerHTML = searchButton + feedbackButton;
    }

    newCardBody.innerHTML = nameElement + paramElement + feedbackElement + centerButtons;
    newCardEl.innerHTML = newCardBody;
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

function getFeedback(tempFeedbackElement, buttons, search) {
    // need to create new feedback element attached to search; displays feedback if already provided
    if (search.feedback = null) {
        tempFeedbackElement += "You haven't submitted feedback yet";
        buttons = true;
    } else {
        tempFeedbackElement += search.feedback;
        buttons = false;
    }
    return tempFeedbackElement, buttons;
}

function createBreak() {
    return document.createElement('/br');
}

function createSearchesButtons(buttons, search) {
    feedbackButton = null;
    if (!buttons) {
        feedbackButton = document.createElement('feedback button');
        feedbackButton.innerText = "Submit Feedback";
        feedbackButton.addEventListener('click', () => {
            feedbackWindow(feedbackButton);
        });
        const popupText = document.createElement('span');
        popupText.className = 'popuptext';
        popupText.id = 'searchPopup';

    }
    // should essentially do 'reroll' with these parameters
    searchButton = document.createElement('search button');
    searchButton.innerText = "Search with These Parameters Again";
    searchButton.addEventListener('click', () => {
        searchAgain(search);
    });
    if (feedbackButton == null) {
        return searchButton;
    } else {
        return searchButton, feedbackButton;
    }
}

// needs to essentially perform a reroll
function searchAgain(search) {

}

function feedbackWindow(feedbackButton) {
    fetch("/form.html")
      .then((response) => response.text())
      .then((data) => {
          feedbackButton.innerHTML = data;
      })
    var popup = document.getElementById("formPopup");
    popup.classList.toggle("show");
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

function backToHome() {
    window.location.replace("index.html");
}

function toAccount() {
    window.location.replace("account-info.html");
}

function toSearches() {
    window.location.replace("past-searches.html");
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
            document.getElementById("page-container").innerHTML = html;
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
    FUNCTIONS TO GET THE USER'S LOCATION AND TRANSFORM TO AN ADDRESS
 */
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
    FUNCTIONS FOR SAVING SEARCHES
*/
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
    if (localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}`, {method: 'GET'}).then(response => response.json()).then((searches) => {
        let searchesEl = document.getElementById('cards');
        searches.forEach((search) => {
            searchesEl.appendChild(createSearchElement(search));
        });
    });
}

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
            food.innerHTML = '<textarea id="food-selection" placeholder="or foods :)"></textarea>';
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
