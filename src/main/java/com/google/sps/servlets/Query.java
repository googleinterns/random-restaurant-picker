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

package com.google.sps.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.ArrayList;

@WebServlet("/query")
public class Query extends HttpServlet {

    private String resultsJson;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().println(resultsJson);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String lat = request.getParameter("lat");
        String lon = request.getParameter("lng");
        String radius = request.getParameter("radius");
        String searchTerms = request.getParameter("searchTerms");
        String apiKey = "AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw";
        if (searchTerms.contains("bakery") || searchTerms.contains("Bakery")) {
            resultsJson += findRestaurants(lat, lon, radius, "bakery", searchTerms, apiKey); 
        } else if (searchTerms.contains("cafe") || searchTerms.contains("Cafe")) {
            resultsJson += findRestaurants(lat, lon, radius, "cafe", searchTerms, apiKey);
        } else if (searchTerms.contains("bar") || searchTerms.contains("Bar") || searchTerms.contains("drink") || searchTerms.contains("Drink")) {
            resultsJson += findRestaurants(lat, lon, radius, "bar", searchTerms, apiKey);
        } else if (searchTerms.contains("order") || searchTerms.contains("Order")) {
            resultsJson += findRestaurants(lat, lon, radius, "meal_delivery", searchTerms, apiKey);
            resultsJson += findRestaurants(lat, lon, radius, "meal_takeaway", searchTerms, apiKey);
        }
        resultsJson += findRestaurants(lat, lon, radius, "food", searchTerms, apiKey);
        resultsJson += findRestaurants(lat, lon, radius, "restaurant", searchTerms, apiKey);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    public String findRestaurants(String lat, String lon, String radius, String type, String searchTerms, String apiKey) {
        String sURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        URL url = new URL(sURL);
        URLConnection requestURL = url.openConnection();
        requestURL.connect();

        JsonParser jp = new JsonParser();
        JsonElement jsonElement = jp.parse(new InputStreamReader((InputStream) requestURL.getContent()));
        JsonObject jsonObj = jsonElement.getAsJsonObject();
        String newResultsJson = jsonObj.toString();
        return newResultsJson;
    }
}
