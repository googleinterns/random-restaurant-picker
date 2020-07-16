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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

import com.google.sps.data.Feedback;
import com.google.sps.data.Search;
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

@WebServlet("/feedback")
public class FeedbackServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Query query = new Query("Feedback");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        List<Feedback> feedbackList = new ArrayList<>();
        for (Entity entity : results.asIterable()) {
            int restaurantRating = (int) entity.getProperty("restaurantRating");
            int rrpRating = (int) entity.getProperty("rrpRating");
            String notes = (String) entity.getProperty("notes");
            Feedback feedback = new Feedback(restaurantRating, rrpRating, notes);
            feedbackList.add(feedback);
        }
        // Send the JSON as the response
        response.setContentType("application/json");
        Gson gson = new Gson();
        gson.toJson(gson.toJsonTree(feedbackList), gson.newJsonWriter(response.getWriter()));
    }
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String restaurantRating = request.getParameter("restaurant-rating");
        String rrpRating = request.getParameter("rrp-rating");
        String notes = request.getParameter("notes");
        Entity feedbackEntity = new Entity("Feedback");
        feedbackEntity.setProperty("restaurantRating", restaurantRating);
        feedbackEntity.setProperty("rrpRating", rrpRating);
        feedbackEntity.setProperty("notes", notes);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(feedbackEntity);
    }
}
