// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//git 
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
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns the user's favorite food, if previously inputted */
@WebServlet("/fav-food")
public final class FavFoodServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String user = request.getParameter("user");
    Filter propertyFilter = new FilterPredicate("user", FilterOperator.EQUAL, user);
    Query query = new Query("FavFood").setFilter(propertyFilter);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService().addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    String favFood;
    for (Entity entity : results.asIterable()) {
        String food = (String) entity.getProperty("food");
        favFood = food;
    }

    // Send the JSON as the response
    response.setContentType("application/json");
    Gson gson = new Gson();
    gson.toJson(gson.toJsonTree(favFood), gson.newJsonWriter(response.getWriter()));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String food = request.getParameter("fav-food");
    long timestamp = System.currentTimeMillis();

    // creates Entity for the food
    Entity foodEntity = new Entity("FavFood");
    foodEntity.setProperty("food", food);
    foodEntity.setProperty("timestamp", timestamp);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(foodEntity);
  }
}
