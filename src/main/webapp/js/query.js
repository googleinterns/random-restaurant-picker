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

const apiKey = 'AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw';
let searchResults;
let queryArr;

function loadPage() {
    window.location.replace("results.html");
}

function query() {
    let lat = localStorage.getItem("lat");
    let long = localStorage.getItem("lng");
    // const lat = 39.109635;
    // const long = -108.542347;
    const radius = document.getElementById('distance').value;
    const type = 'restaurant';
    const keyword = document.getElementById('searchTerms').value;
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'location=' + lat + ',' + long + '&radius=' + radius + '&type=' + type + '&keyword=' + keyword + '&key=' + apiKey;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    saveSearch(url, radius, keyword);
    fetch(proxyurl + url)
        .then(response => response.json())
        .then((response) => {
            console.log(response);
            let restaurantResults = response.results;
            weightedRestaurant = weightRestaurants(restaurantResults);
            console.log(weightedRestaurant);
        })
        .catch((error) => {
            console.log(error);
            console.log("Can’t access " + url + " response. Blocked by browser?")
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
    console.log(pos.lat);
}

// convert lat/lng format to human-readable address --> my goal was to call this in the above function and store the human-readable
// address in the location-container spot (so it was in the spot as the sydney australia address)
function convertLocation(location) {
    let lat = location.lat;
    let long = location.lng;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&result_type=street_address&key=' + apiKey;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    return fetch(proxyurl + url)
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

function saveSearch(url, radius, keyword){
    let userID = 0;
    if(localStorage.getItem("loggedIn")){
        userID = localStorage.getItem("user");
    }
    fetch(`/searches?user=${userID}&radius=${radius}&keywords=${keyword}&url=${url}`, {
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
    const cardElement = document.createElement('card-object');
    cardElement.className = 'card';
    
    const nameElement = document.createElement('p2');
    nameElement.innerText = search.name;

    const paramElement = document.createElement('p3');
    const tempParamElement = "Parameters: ";
    for (items in search.keywords) {
        tempParamElement += items;
        tempParamElement += ", ";
    }
    tempParamElement += radius;
    paramElement.innerText = tempParamElement;

    const feedbackElement = document.createElement('p3');
    // needs to create feedback element, submit feedback button if no feedback, 
    // and submit w/ these parameters again button
    const tempFeedbackElement = "Feedback: ";
    const buttons = null;
    feedbackElement.innerText, buttons = getFeedback(tempFeedbackElement, buttons);
    //still working on adding buttons here

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

function getFeedback(tempFeedbackElement, buttons) {
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

function createSearchesButtons(buttons) {
    if (!buttons) {
        feedbackButton = document.createElement('feedback button');
        feedbackButton.innerText = "Submit Feedback";
        feedbackButton.addEventListener('click', () => {
            feedbackWindow();
        });
        const popupText = document.createElement('span');
        popupText.className = 'popuptext';
        popupText.id = 'searchPopup';

    }
    // should essentially do 'reroll' with these parameters
    searchButton = document.createElement('search button');
    searchButton.innerText = "Search with These Parameters Again";
    searchButton.addEventListener('click', () => {
        searchAgain();
    });
}

function feedbackWindow() {
    fetch("/form.html")
      .then((response) => response.text())
      .then((data) => {
          feedbackButton.innerHTML = data;
      })
    var popup = document.getElementById("formPopup");
    popup.classList.toggle("show");
}
