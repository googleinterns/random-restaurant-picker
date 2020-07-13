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
import javax.servlet.http.HttpSession;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

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
import java.util.Random;

@WebServlet("/query")
public class QueryServlet extends HttpServlet {

    private final String apiKey = "AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc";
    private final Gson gson = new GsonBuilder().create();
    private User user;

    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doGet(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException {
        HttpSession session = servletRequest.getSession(false);
        Response response = (Response) session.getAttribute("response");
<<<<<<< HEAD
        if(response == null)
            servletResponse.getWriter().println(gson.toJson(new Response("NO_RESULTS", null)));
        else if (response.getStatus().equals("OK"))
            chooseRestaurant(response);
=======
        if(response.status().equals("OK")){
            chooseRestaurant(response, user.priceLevel());
        }
>>>>>>> 8bf0119... Fix variable names and make deployable
        servletResponse.getWriter().println(gson.toJson(response));
    }

    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doPost(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException, ServletException {
        String lat = servletRequest.getParameter("lat");
        String lon = servletRequest.getParameter("lng");
        String radius = servletRequest.getParameter("radius");
        String type = "restaurant";
        String searchTerms = servletRequest.getParameter("searchTerms");
        String urlStr = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        URLConnection conn = new URL(urlStr).openConnection();
        conn.connect();

        JsonElement jsonElement = new JsonParser().parse(new InputStreamReader(conn.getInputStream()));
        JsonObject responseJson = jsonElement.getAsJsonObject();
        Response response = gson.fromJson(responseJson, Response.class);

        HttpSession session = servletRequest.getSession(true);
        if (response.getStatus().equals("OK"))
            chooseRestaurant(response, servletRequest.getParameter("priceLevel"));
        session.setAttribute("response", response);
        session.setAttribute("user", new User(Integer.parseInt(servletRequest.getParameter("priceLevel"))));
        servletResponse.getWriter().println(gson.toJson(response));
        //TODO: make this a separate class or function, doesn't need a servlet to handle storing
        servletRequest.getRequestDispatcher("/searches").include(servletRequest, servletResponse);
    }

    private void chooseRestaurant(Response response, int requestedPrice){
        if(response.getResults().size() == 0){
            response.setStatus("EMPTY");
            return;
        }
        HashMap<String, Integer> restaurantScores = new HashMap<>();
        int score; 
        int total = 0;
        for(Restaurant restaurant : response.getResults()){
            score = 1;
            if(requestedPrice == 0 || requestedPrice == restaurant.getPrice())
                score += 50;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 1)
                score += 25;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 2)
                score += 12;
            else if(Math.abs(requestedPrice - restaurant.getPrice()) <= 3)
                score += 6;
            restaurantScores.put(restaurant.getName(), score);
            total += score;
        }
        int selectedNum = new Random().nextInt(total);
        int value = 0;
        for(String key : restaurantScores.keySet()){
            if(selectedNum <= value)){
                response.setPick(response.getResults().stream().filter(p -> p.getName().equals(key)).findFirst().orElse(null));
                response.getResults().remove(response.getPick());
                return;
            }
        }
    }
}
