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

import com.google.sps.data.User;
import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;
import com.google.sps.data.Photo;
import com.google.sps.servlets.QueryServlet;
import com.google.sps.data.UrlOpener;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.Mock;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.*;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.io.PrintWriter;
import java.io.StringWriter;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@RunWith(MockitoJUnitRunner.class)
public final class QueryServletTest {
  @Mock
  HttpServletRequest request;
  @Mock
  HttpServletResponse response;
  @Mock
  HttpSession session;
  @Mock
  UrlOpener urlOpener;
  
  @Before
  public void setUp() throws Exception {
    MockitoAnnotations.initMocks(this);
  }
  
  @Test
  public void POSTZeroResults() throws IOException{
    //Submit a post request to query servlet that returns 0 results
    String json = "{'html_attributions' : [], 'results' : [], 'status' : 'ZERO_RESULTS'}";
    JsonElement apiResponse = new JsonParser().parse(json);
    when(request.getParameter("lat")).thenReturn("40.7128");
    when(request.getParameter("lng")).thenReturn("74.0060");
    when(request.getParameter("radius")).thenReturn("1");
    when(request.getParameter("searchTerms")).thenReturn("asdk");
    when(request.getSession(true)).thenReturn(session);
    when(request.getParameter("priceLevel")).thenReturn("4");
    when(urlOpener.openUrl(anyString())).thenReturn(apiResponse);

    //Run servlet with mock objects and collect data
    ArgumentCaptor<String> asString = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<Object> asObject = ArgumentCaptor.forClass(Object.class);
    new QueryServlet(urlOpener).doPost(request, response);
    verify(session, atLeast(1)).setAttribute(asString.capture(), asObject.capture());
    verify(urlOpener).openUrl(asString.capture());

    //Process results and check correctness
    String resultStatus = ((Response) asObject.getAllValues().get(0)).getStatus();
    int userPrice = ((User) asObject.getAllValues().get(1)).getPriceLevel();
    Assert.assertEquals(resultStatus, "ZERO_RESULTS");
    Assert.assertEquals(userPrice, 4);
  }

  @Test
  public void POSTValidResults() throws IOException{
    //Submit a post request to query servlet that returns results
    String json = "{\"html_attributions\":[],\"results\":[{\"business_status\":\"OPERATIONAL\",\"id\":\"8d44812b1137bf4dd53eada0252dcbc31f151898\",\"name\":\"Molcajetes Mexican Restaurant\",\"place_id\":\"ChIJz4ZjbCdRwokRJPxzM_Zs_jE\",\"rating\":4.7,\"vicinity\":\"520 West Side Ave, Jersey City\"}],\"status\":\"OK\"}";
    JsonElement apiResponse = new JsonParser().parse(json);
    when(request.getParameter("lat")).thenReturn("40.7128");
    when(request.getParameter("lng")).thenReturn("-74.0060");
    when(request.getParameter("radius")).thenReturn("500");
    when(request.getParameter("searchTerms")).thenReturn("mexican");
    when(request.getSession(true)).thenReturn(session);
    when(request.getParameter("priceLevel")).thenReturn("4");
    when(urlOpener.openUrl(anyString())).thenReturn(apiResponse);

    //Run servlet with mock objects and collect data
    ArgumentCaptor<String> asString = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<Object> asObject = ArgumentCaptor.forClass(Object.class);
    new QueryServlet(urlOpener).doPost(request, response);
    verify(session, atLeast(1)).setAttribute(asString.capture(), asObject.capture());
    verify(urlOpener).openUrl(asString.capture());

    //Process results and check correctness
    String resultStatus = ((Response) asObject.getAllValues().get(0)).getStatus();
    int userPrice = ((User) asObject.getAllValues().get(1)).getPriceLevel();
    Assert.assertEquals(resultStatus, "OK");
    Assert.assertEquals(userPrice, 4);
  }

  @Test
  public void GETNoResults() throws IOException{
    //Submit a post request to query servlet that returns 0 results
    List<Restaurant> restArr = new ArrayList<>();
    Response apiResponse = new Response("ZERO_RESULTS", restArr);
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(request.getSession(false)).thenReturn(session);
    when(session.getAttribute("response")).thenReturn(apiResponse);
    when(response.getWriter()).thenReturn(pw);

    //Run servlet with mock objects
    new QueryServlet().doGet(request, response);
    verify(request).getSession(false);
    verify(session).getAttribute("response");
    verify(response).getWriter();

    //Process results and check correctness
    String results = sw.getBuffer().toString().trim();
    JsonElement jsonEl = new JsonParser().parse(results);
    JsonObject json = jsonEl.getAsJsonObject();
    Assert.assertEquals(json.get("status").getAsString(), "ZERO_RESULTS");
  }

  @Test
  public void GETOneResults() throws IOException{
    //Submit a post request to query servlet that returns one result
    List<Restaurant> restArr = new ArrayList<>();
    restArr.add(new Restaurant("McDonalds", 4.5, "OPERATIONAL", new Photo[]{}));
    Response apiResponse = new Response("OK", restArr);
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(request.getSession(false)).thenReturn(session);
    when(session.getAttribute("response")).thenReturn(apiResponse);
    when(response.getWriter()).thenReturn(pw);

    //Run the servlet with mock objects 
    new QueryServlet().doGet(request, response);
    verify(request).getSession(false);
    verify(session).getAttribute("response");
    verify(response).getWriter();

    //Process data and check correctness
    String results = sw.getBuffer().toString().trim();
    JsonElement jsonEl = new JsonParser().parse(results);
    JsonObject json = jsonEl.getAsJsonObject();
    JsonObject pick = json.get("pick").getAsJsonObject();
    Assert.assertEquals(pick.get("name").getAsString(), "McDonalds");
    Assert.assertEquals(pick.get("businessStatus").getAsString(), "OPERATIONAL");
    Assert.assertEquals(json.get("status").getAsString(), "NO_REROLLS");
  }

  @Test
  public void GETMultipleResults() throws IOException{
    //Submit a post request to query servlet that returns 0 results
    List<Restaurant> restArr = new ArrayList<>();
    restArr.add(new Restaurant("McDonalds", 4.5, "OPERATIONAL", new Photo[]{}));
    restArr.add(new Restaurant("Starbucks", 5, "OPERATIONAL", new Photo[]{}));
    Response apiResponse = new Response("OK", restArr);
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(request.getSession(false)).thenReturn(session);
    when(session.getAttribute("response")).thenReturn(apiResponse);
    when(response.getWriter()).thenReturn(pw);

    //Run the servlet with mock objects
    new QueryServlet().doGet(request, response);
    verify(request).getSession(false);
    verify(session).getAttribute("response");
    verify(response).getWriter();

    //Process data and check correctness
    String results = sw.getBuffer().toString().trim();
    JsonElement jsonEl = new JsonParser().parse(results);
    JsonObject json = jsonEl.getAsJsonObject();
    JsonObject pick = json.get("pick").getAsJsonObject();
    Assert.assertEquals(pick.get("businessStatus").getAsString(), "OPERATIONAL");
    Assert.assertEquals(json.get("status").getAsString(), "OK");
  }
}
