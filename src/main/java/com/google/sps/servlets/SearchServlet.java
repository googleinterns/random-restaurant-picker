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

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import com.google.gson.Gson;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import java.text.SimpleDateFormat;  
import java.util.Date;
import org.json.JSONObject;
import org.json.JSONException;
import org.json.HTTP;
import com.google.sps.data.Search;
import com.google.sps.data.Feedback;

@WebServlet("/searches")
public class SearchServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String user = request.getParameter("user");
    Filter propertyFilter = new FilterPredicate("user", FilterOperator.EQUAL, user);
    Query query = new Query("savedSearch").setFilter(propertyFilter).addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Search> searches = new ArrayList<>();
    // HashMap<String, Search> restaurantMap = new HashMap<>();
    for (Entity entity : results.asIterable()) {
    //   String userID = (String) entity.getProperty("user");
    //   String date = (String) entity.getProperty("date");
        String keywords = (String) entity.getProperty("keywords");
    //   String radius = (String) entity.getProperty("radius");
    //   String lat = (String) entity.getProperty("lat");
    //   String lng = (String) entity.getProperty("lng");
    //   long id = (long) entity.getKey().getId();
    //   System.out.println("1" + entity.getProperty("restaurantRating"));
    //   int restaurantRating = Integer.parseInt(entity.getProperty("restaurantRating").toString());
    //   int rrpRating = Integer.parseInt(entity.getProperty("rrpRating").toString());
    //   String notes = (String) entity.getProperty("notes");
    //   Feedback feedback = new Feedback(restaurantRating, rrpRating, notes);
        Boolean feedbackSubmitted = false;
        Feedback feedback = new Feedback(0, 0, "none", feedbackSubmitted);
        String restaurantName = (String) entity.getProperty("restaurantName");
        Search search = new Search(keywords, restaurantName, feedback);
        // searches.add(restaurantName);
        // restaurantMap.put(search.getRestaurantName(), search);
    //   Search search = new Search(userID, date, keywords, lat, lng, radius, id, feedback, restaurantName);
        searches.add(search);
    }
    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(searches));
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String user = request.getParameter("user");
    String radius = request.getParameter("radius");
    String keywords = request.getParameter("keywords");
    String lat = request.getParameter("lat");
    String lng = request.getParameter("lng");
    long timestamp = System.currentTimeMillis();

    SimpleDateFormat formatter = new SimpleDateFormat("MMM d, 'at' HH:mm");
    Date date = new Date(System.currentTimeMillis());
    String formattedDate = formatter.format(date);
    String restaurantName = request.getParameter("restaurantName");

    //Make an entity
    Entity searchEntity = new Entity("savedSearch");
    searchEntity.setProperty("user", user);
    searchEntity.setProperty("radius", radius);
    searchEntity.setProperty("date", formattedDate);
    searchEntity.setProperty("keywords", keywords);
    searchEntity.setProperty("timestamp", timestamp);
    searchEntity.setProperty("lat", lat);
    searchEntity.setProperty("lng", lng);
    searchEntity.setProperty("restaurantRating", 0);
    searchEntity.setProperty("rrpRating", 0);
    searchEntity.setProperty("notes", "null");
    searchEntity.setProperty("restaurantName", restaurantName);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(searchEntity);

    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }
}
