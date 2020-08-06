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

/** Servlet that returns the user's inputted favorite food */
@WebServlet("/fav-food")
public final class FavFoodServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("FavFood");

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<String> favFoodList = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
        String favFood = (String) entity.getProperty("food");
        favFoodList.add(favFood);
    }

    // Send the JSON as the response
    response.setContentType("application/json");
    response.getWriter().println(new Gson().toJson(favFoodList));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String food = request.getParameter("fav-food");

    // creates Entity for the food
    Entity foodEntity = new Entity("FavFood");
    foodEntity.setProperty("food", food);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(foodEntity);

    response.sendRedirect("/account-info.html");
  }
}
