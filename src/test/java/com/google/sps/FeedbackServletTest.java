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

import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.Assert.assertEquals;

import com.google.sps.servlets.FeedbackServlet;
import com.google.sps.data.UrlOpener;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.Assert;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import org.mockito.Mock;
import org.mockito.ArgumentCaptor;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.io.PrintWriter;
import java.io.StringWriter;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

@RunWith(MockitoJUnitRunner.class)
public final class FeedbackServletTest {
  private final LocalServiceTestHelper helper = new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig().setDefaultHighRepJobPolicyUnappliedJobPercentage(0));
  
  @Mock
  HttpServletRequest request;
  @Mock
  HttpServletResponse response;
  @Mock
  HttpSession session;
  
  @Before
  public void setUp() throws Exception {
    helper.setUp();
  }

  @After
  public void done() throws Exception {
      helper.tearDown();
  }

  @Test
  public void postTest() throws IOException {
      when(request.getParameter("user-id")).thenReturn("1");
      when(request.getParameter("restaurant-name-fill")).thenReturn("Starbucks");
      when(request.getParameter("restaurant-rating")).thenReturn("Pretty good");
      when(request.getParameter("rrp-rating")).thenReturn("It met one or two");
      when(request.getParameter("notes")).thenReturn("yay coffee");

      new FeedbackServlet().doPost(request, response);

      DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
      List<Entity> results = ds.prepare(new Query("Feedback")).asList(FetchOptions.Builder.withDefaults());
      assertEquals(1, ds.prepare(new Query("Feedback")).countEntities());
      assertEquals((String)results.get(0).getProperty("notes"), "yay coffee");
  }

  @Test
  public void getOneMatching() throws IOException {
      //Test that the servlet retrieves items from the datastore
      DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
      Entity feedbackEntity = new Entity("Feedback");
      feedbackEntity.setProperty("user", "2");
      feedbackEntity.setProperty("restaurantName", "Mellow Mushroom");
      feedbackEntity.setProperty("restaurantRating", "Pretty good");
      feedbackEntity.setProperty("rrpRating", "It met all of them");
      feedbackEntity.setProperty("notes", "yay pizza");
      ds.put(feedbackEntity);

      //Handle calls to the mock objects
      when(request.getParameter("user")).thenReturn("2");
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      when(response.getWriter()).thenReturn(pw);

      //Run the servlet and verify functions are called
      new FeedbackServlet().doGet(request, response);
      verify(response).setContentType("application/json");
      verify(response).getWriter();

      //Process data and check correctness
      String results = sw.getBuffer().toString().trim();
      JsonObject resultsObj = new JsonParser().parse(results).getAsJsonArray().get(0).getAsJsonObject();
      assertEquals(resultsObj.get("user").getAsString(), "2");
      assertEquals(resultsObj.get("notes").getAsString(), "yay pizza");
  }

  @Test
  public void getZeroMatching() throws IOException {
      //Test the servlet when no items are in the datastore
      //Handle calls to the mock objects
      when(request.getParameter("user")).thenReturn("2");
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      when(response.getWriter()).thenReturn(pw);

      //Run the servlet and verify functions are called
      new FeedbackServlet().doGet(request, response);
      verify(response).setContentType("application/json");
      verify(response).getWriter();

      //Process data and check correctness
      String results = sw.getBuffer().toString().trim();
      assertEquals(results, "[]");
  }

  @Test
  public void getOneNotMatching() throws IOException {
      //Test that the servlet when an item in the datastore doesn't
      //match the user request that was processed
      DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
      Entity feedbackEntity = new Entity("Feedback");
      feedbackEntity.setProperty("user", "2");
      feedbackEntity.setProperty("restaurantName", "Whit's");
      feedbackEntity.setProperty("restaurantRating", "Pretty good");
      feedbackEntity.setProperty("rrpRating", "It met one or two");
      feedbackEntity.setProperty("notes", "yay ice cream");
      ds.put(feedbackEntity);

      //Handle calls to the mock objects
      when(request.getParameter("user")).thenReturn("3");
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      when(response.getWriter()).thenReturn(pw);

      //Run the servlet and verify functions are called
      new FeedbackServlet().doGet(request, response);
      verify(response).setContentType("application/json");
      verify(response).getWriter();

      //Process data and check correctness
      String results = sw.getBuffer().toString().trim();
      assertEquals(results, "[]");
  }

  @Test
  public void getTwoInOrder() throws IOException {
      //Test that the servlet returns the items in correct order
      //when two matching entities are in the datastore
      DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
      Entity feedbackEntity1 = new Entity("Feedback");
      feedbackEntity1.setProperty("user", "2");
      feedbackEntity1.setProperty("restaurantName", "Mr. Sushi");
      feedbackEntity1.setProperty("restaurantRating", "Pretty good");
      feedbackEntity1.setProperty("rrpRating", "It met one or two");
      feedbackEntity1.setProperty("notes", "yay sushi");
      ds.put(feedbackEntity1);

      Entity feedbackEntity2 = new Entity("Feedback");
      feedbackEntity2.setProperty("user", "2");
      feedbackEntity2.setProperty("restaurantName", "First Watch");
      feedbackEntity2.setProperty("restaurantRating", "Pretty good");
      feedbackEntity2.setProperty("rrpRating", "It met one or two");
      feedbackEntity2.setProperty("notes", "yay brunch");
      ds.put(feedbackEntity2);

      //Handle calls to the mock objects
      when(request.getParameter("user")).thenReturn("2");
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      when(response.getWriter()).thenReturn(pw);

      //Run the servlet and verify functions are called
      new FeedbackServlet().doGet(request, response);
      verify(response).setContentType("application/json");
      verify(response).getWriter();

      //Process data and check correctness
      String results = sw.getBuffer().toString().trim();
      JsonObject resultsObj1 = (new JsonParser().parse(results)).getAsJsonArray().get(0).getAsJsonObject();
      JsonObject resultsObj2 = (new JsonParser().parse(results)).getAsJsonArray().get(1).getAsJsonObject();
      assertEquals(resultsObj1.get("notes").getAsString(), "yay sushi");
      assertEquals(resultsObj2.get("notes").getAsString(), "yay brunch");
  }
}
