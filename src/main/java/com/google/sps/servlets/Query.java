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
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Collection;
import com.google.gson.reflect.TypeToken;
import java.util.Optional;

@WebServlet("/query")
public class Query extends HttpServlet {

    private JsonArray resultsJson;
    private String finalResult;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println(finalResult);
        response.getWriter().println(finalResult);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("hello");
        String requestedPrice = request.getParameter("price");
        String requestedRating = request.getParameter("rating");
        String lat = request.getParameter("lat");
        String lon = request.getParameter("lng");
        String radius = request.getParameter("radius");
        String searchTerms = request.getParameter("searchTerms");
        String apiKey = "AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw";
        if (searchTerms.contains("bakery") || searchTerms.contains("Bakery")) {
            resultsJson.add(findRestaurants(lat, lon, radius, "bakery", searchTerms, apiKey)); 
        } else if (searchTerms.contains("cafe") || searchTerms.contains("Cafe")) {
            resultsJson.add(findRestaurants(lat, lon, radius, "cafe", searchTerms, apiKey));
        } else if (searchTerms.contains("bar") || searchTerms.contains("Bar") || searchTerms.contains("drink") || searchTerms.contains("Drink")) {
            resultsJson.add(findRestaurants(lat, lon, radius, "bar", searchTerms, apiKey));
        } else if (searchTerms.contains("order") || searchTerms.contains("Order")) {
            resultsJson.add(findRestaurants(lat, lon, radius, "meal_delivery", searchTerms, apiKey));
            resultsJson.add(findRestaurants(lat, lon, radius, "meal_takeaway", searchTerms, apiKey));
        }
        resultsJson.add(findRestaurants(lat, lon, radius, "food", searchTerms, apiKey));
        resultsJson.add(findRestaurants(lat, lon, radius, "restaurant", searchTerms, apiKey));
        System.out.println("all results: " + resultsJson);

        JsonObject result = chooseRestaurant(resultsJson, Double.parseDouble(requestedPrice), Double.parseDouble(requestedRating));
        System.out.println("result: " + result);
        result.addProperty("status", "OK");
        finalResult = result.toString();
        System.out.println("final result: " + finalResult);

        response.setStatus(HttpServletResponse.SC_OK);
    }

    private JsonElement findRestaurants(String lat, String lon, String radius, String type, String searchTerms, String apiKey) throws IOException {
        String sURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        URL url = new URL(sURL);
        URLConnection requestURL = url.openConnection();
        requestURL.connect();

        JsonParser jp = new JsonParser();
        JsonElement jsonElement = jp.parse(new InputStreamReader((InputStream) requestURL.getContent()));
        JsonObject jsonObj = jsonElement.getAsJsonObject();
        System.out.println("json " + jsonObj.get("results"));
        return jsonObj.get("results");
    }

    private JsonObject chooseRestaurant(JsonArray restaurants, Double price, Double rating){
        Map<String, Integer> restaurantScores = new HashMap<>();
        Collection<JsonObject> restaurantCollection = new Gson().fromJson(restaurants, new TypeToken<Collection<JsonObject>>(){}.getType());
        int score;
        int total = 0;

        //Weights for how closely the searches follow the parameters
        for(JsonObject restaurant : restaurantCollection){
            score = 1;
            try{
                if(Double.parseDouble(restaurant.get("price_level").getAsString()) == price || price == 0)
                    score += 10;
                else if(Math.abs(Double.parseDouble(restaurant.get("price_level").getAsString())-price) <= 1)
                    score += 6;
                else if(Math.abs(Double.parseDouble(restaurant.get("price_level").getAsString())-price) <= 2)
                    score += 3;
                else if(Math.abs(Double.parseDouble(restaurant.get("price_level").getAsString())-price) <= 3)
                    score += 1;
            
            } catch (Exception e){
                System.out.println(e.getMessage());
            }
            try{
                if(Double.parseDouble(restaurant.get("rating").getAsString()) == rating || rating == 0)
                    score += 10;
                else if(Math.abs(Double.parseDouble(restaurant.get("rating").getAsString())-rating) <= .5)
                    score += 6;
                else if(Math.abs(Double.parseDouble(restaurant.get("rating").getAsString())-rating) <= 1)
                    score += 3;
                else if(Math.abs(Double.parseDouble(restaurant.get("rating").getAsString())-rating) <= 1.5)
                    score += 1;
            } catch (Exception e){
                System.out.println(e.getMessage());
            }
            total += score;
            restaurantScores.put(restaurant.get("name").getAsString(), score);
        }

        //Generate a random number and parse through the scores to find
        //the matching range
        Random rd = new Random();
        int selectedNum = rd.nextInt(total);
        int value = 0;
        String ans ="none";
        for (String key : restaurantScores.keySet()) {
            value += restaurantScores.get(key);
            if(selectedNum <= value){
                ans = key;
                break;
            }
        }

        //Get the final JSON object of the selected restaurant
        final String answer = ans;
        JsonObject result = restaurantCollection.stream().filter(p -> p.get("name").getAsString().equals(answer)).findFirst().orElse(null);
        return result;
    }
}
