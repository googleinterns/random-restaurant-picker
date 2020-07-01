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

package com.google.sps;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import com.google.gson.Gson;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import java.text.SimpleDateFormat;  
import java.util.Date;
import org.json.JSONObject;
import org.json.JSONException;
import org.json.HTTP;

@WebServlet("/searches")
public class SearchServlet extends HttpServlet {

  @Override
  /*public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    String numComments = request.getParameter("num-comments");
    int commentAmount = 0;
    try{
        commentAmount = Integer.parseInt(numComments);
    }catch (NumberFormatException e) {
      log("Could not convert " + numComments + "to int", e);
      commentAmount = 5;
    }

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(commentAmount))) {
      String content = (String) entity.getProperty("content");
      String date = (String) entity.getProperty("date");
      String tag = (String) entity.getProperty("tags");
      String user = (String) entity.getProperty("user");
      long timestamp = (long) entity.getProperty("timestamp");
      long id = entity.getKey().getId();

      Comment comment = new Comment(content, timestamp, id, date, user, tag);
      comments.add(comment);
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }*/

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JSONObject jsonObject = new JSONObject(request.getParameterMap());
    String user = (String)jsonObject.get("user");
    String radius = (String)jsonObject.get("radius");
    String keywords = (String)jsonObject.get("keywords");
    long timestamp = System.currentTimeMillis();

    SimpleDateFormat formatter = new SimpleDateFormat("MMM d, 'at' HH:mm");
    Date date = new Date(System.currentTimeMillis());
    String formattedDate = formatter.format(date);


    //Make an entity
    Entity searchEntity = new Entity("savedSearch");
    searchEntity.setProperty("user", user);
    searchEntity.setProperty("radius", radius);
    searchEntity.setProperty("date", formattedDate);
    searchEntity.setProperty("keywords", keywords);
    searchEntity.setProperty("timestamp", timestamp);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(searchEntity);

    // Redirect back to the HTML page.
    //response.sendRedirect("/more.html");
  }
}
