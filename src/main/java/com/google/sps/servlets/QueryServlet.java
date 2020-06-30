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
import com.google.sps.data.AccessSecret;

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

@WebServlet("/query")
public class QueryServlet extends HttpServlet {
    private final Gson gson = new GsonBuilder().create();
    private User user;

    @Override
    // TODO: return a user-friendly error rather than throwing an exception
    public void doGet(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException {
        HttpSession session = servletRequest.getSession(false);
        Response response = (Response) session.getAttribute("response");
        if(response == null)
            servletResponse.getWriter().println(gson.toJson(new Response("NO_RESULTS", null)));
        else if (response.getStatus().equals("OK"))
            response.pick();
        servletResponse.getWriter().println(gson.toJson(response));
    }

    @Override
    public void doPost(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws IOException, ServletException {
        String apiKey = (AccessSecret.getInstance()).getKey();
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
            response.pick();
        session.setAttribute("response", response);
        session.setAttribute("user", new User(Integer.parseInt(servletRequest.getParameter("priceLevel"))));
        servletResponse.setContentType("application/json");
        servletResponse.getWriter().println(gson.toJson(response));
        //TODO: make this a separate class or function, doesn't need a servlet to handle storing
        servletRequest.getRequestDispatcher("/searches").include(servletRequest, servletResponse);
    }
}
