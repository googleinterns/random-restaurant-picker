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

import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;
import com.google.sps.data.User;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@WebServlet("/query")
public class Query extends HttpServlet {

    private final String apiKey = "AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc";
    private final Gson gson = new GsonBuilder().create();
    private Response response;
    private User user;

    @Override
    public void doGet(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException {
        if(response.status().equals("OK")){
            chooseRestaurant(response);
        }
        servletResponse.getWriter().println(gson.toJson(response));
    }

    @Override
    public void doPost(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException {
        String lat = servletRequest.getParameter("lat");
        String lon = servletRequest.getParameter("lng");
        String radius = servletRequest.getParameter("radius");
        String type = "restaurant";
        String searchTerms = servletRequest.getParameter("searchTerms");
        String urlStr = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        URL url = new URL(urlStr);
        URLConnection conn = url.openConnection();
        conn.connect();

        JsonElement jsonElement = new JsonParser().parse(new InputStreamReader(conn.getInputStream()));
        JsonObject responseJson = jsonElement.getAsJsonObject();
        response = gson.fromJson(responseJson, Response.class);

        int priceLevel = Integer.parseInt(servletRequest.getParameter("priceLevel"));
        user = new User(priceLevel);
    }

    private void chooseRestaurant(Response response, int requestedPrice){
        if(response.results().size() == 0){
            response.setStatus("EMPTY");
            return;
        }
        Map<String, int> restaurantScores = new HashMap<>();
        int score; 
        int total = 0;
        for(Restaurant restaurant : response.results()){
            score = 1;
            if(requestedPrice == 0 || requestedPrice == restaurant.price())
                score += 50;
            else if(Math.abs(requestedPrice - restaurant.price()) <= 1)
                score += 25;
            else if(Math.abs(requestedPrice - restaurant.price()) <= 2)
                score += 12;
            else if(Math.abs(requestedPrice - restaurant.price()) <= 3)
                score += 6;
            restaurantScores.put(restaurant.name(), score);
            total += score;
        }
        int selectedNum = new Random().nextInt(total);
        int value = 0;
        for(String key : restaurantScores.keySet()){
            if(selectedNum <= value)){
                response.setPick(response.results().stream().filter(p -> p.name().equals(key)).findFirst().orElse(null));
                response.results().remove(response.getPick());
            }
        }
    }
}