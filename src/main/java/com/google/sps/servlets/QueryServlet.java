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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.io.UnsupportedEncodingException;

import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;
import com.google.sps.data.User;

import com.google.sps.data.AccessSecret;
import com.google.sps.data.RestaurantChooser;
import com.google.sps.data.UrlOpener;

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
    private final Gson gson = new GsonBuilder().create();
    private Response response;
    private User user;
    private UrlOpener urlOpener;

    public QueryServlet(UrlOpener opener) {
        this.urlOpener = opener;
    }

    public QueryServlet() {
        this.urlOpener = new UrlOpener();
    }
    
    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doGet(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException {
        HttpSession session = servletRequest.getSession(false);
        Response response = (Response) session.getAttribute("response");
        User user = (User) session.getAttribute("user");
        if (response == null)
            response = new Response("NO_RESULTS", null);
        else if (response.getStatus().equals("OK"))
            RestaurantChooser.chooseRestaurant(response, user.getPriceLevel());
        servletResponse.getWriter().println(gson.toJson(response));
    }

    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doPost(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException, ServletException, UnsupportedEncodingException {
        String apiKey = (AccessSecret.getInstance()).getKey();
        String lat = servletRequest.getParameter("lat");
        String lon = servletRequest.getParameter("lng");
        String radius = servletRequest.getParameter("radius");
        String type = "restaurant";
        String searchTerms = URLEncoder.encode(servletRequest.getParameter("searchTerms"), StandardCharsets.UTF_8.toString());

        //Adds the diet options to the search: causes the search to return multiple types
        String dietaryOptions = servletRequest.getParameter("dietary-options");
        if (!dietaryOptions.equals("Nothing specific"))
            searchTerms = searchTerms + "+" + dietaryOptions;

        String urlStr = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=" + radius + "&type=" + type + "&keyword=" + searchTerms + "&key=" + apiKey;

        JsonElement jsonElement = urlOpener.openUrl(urlStr);
        JsonObject responseJson = jsonElement.getAsJsonObject();
        Response response = gson.fromJson(responseJson, Response.class);
        HttpSession session = servletRequest.getSession(true);
        if (response.getStatus().equals("OK"))
            RestaurantChooser.chooseRestaurant(response, Integer.parseInt(servletRequest.getParameter("priceLevel")));

        session.setAttribute("response", response);
        session.setAttribute("user", new User(Integer.parseInt(servletRequest.getParameter("priceLevel"))));
        servletResponse.setContentType("application/json;");
        servletResponse.getWriter().println(gson.toJson(response));
        //TODO: make this a separate class or function, doesn't need a servlet to handle storing
        servletRequest.getRequestDispatcher("/searches").include(servletRequest, servletResponse);
    }
}

        