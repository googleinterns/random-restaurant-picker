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

import com.google.sps.servlets.ConvertLocationServlet;
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
import com.google.gson.JsonArray;
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
  public void GETZeroResults() throws IOException{
    //Submit a post request to ConvertLocationServlet that has zero results
    //Actual JSON response
    String json = "{\"plus_code\":{\"global_code\":\"8MJ57PJR+22\"},\"results\":[],\"status\":\"ZERO_RESULTS\"}";
    JsonElement apiResponse = new JsonParser().parse(json);
    when(request.getParameter("lat")).thenReturn("40.84");
    when(request.getParameter("lng")).thenReturn("74.01");
    when(urlOpener.openUrl(anyString())).thenReturn(apiResponse);
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(response.getWriter()).thenReturn(pw);

    //Run the servlet with mock objects and collect data
    new ConvertLocationServlet(urlOpener).doPost(request, response);
    ArgumentCaptor<String> asString = ArgumentCaptor.forClass(String.class);
    verify(response).getWriter();
    verify(urlOpener).openUrl(asString.capture());

    //process results and check correctness
    String results = sw.getBuffer().toString().trim();
    JsonElement jsonEl = new JsonParser().parse(results);
    JsonObject json = jsonEl.getAsJsonObject();
    Assert.assertEquals(json.get("status").getAsString(), "ZERO_RESULTS");
    Assert.assertEquals(asString.getValue(), "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.84,74.01&result_type=street_address&key=AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw");
  }

  @Test
  public void GETValidResults() throws IOException{
    //Submit a post request to ConvertLocationServlet that has zero results
    //Actual response abridged for readability
    String json = "{\"plus_code\":{\"compound_code\":\"77J6+22 Ann Arbor, MI, USA\",\"global_code\":\"86JR77J6+22\"},\"results\":[{\"formatted_address\":\"220 S Thayer St, Ann Arbor, MI 48104, USA\",\"place_id\":\"ChIJKQkrYECuPIgRVL8htvW27eM\",\"types\":[\"street_address\"]},{\"formatted_address\":\"208 S Thayer St, Ann Arbor, MI 48104, USA\",\"place_id\":\"EikyMDggUyBUaGF5ZXIgU3QsIEFubiBBcmJvciwgTUkgNDgxMDQsIFVTQSIbEhkKFAoSCTH47V5ArjyIEYGV766E3_UFENAB\",\"types\":[\"street_address\"]}],\"status\":\"OK\"}";
    JsonElement apiResponse = new JsonParser().parse(json);

    //Handle mock object return values
    when(request.getParameter("lat")).thenReturn("42.28");
    when(request.getParameter("lng")).thenReturn("-83.74");
    when(urlOpener.openUrl(anyString())).thenReturn(apiResponse);
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    when(response.getWriter()).thenReturn(pw);

    //Run the function with the mock objects
    new ConvertLocationServlet(urlOpener).doPost(request, response);
    ArgumentCaptor<String> asString = ArgumentCaptor.forClass(String.class);
    verify(response).getWriter();
    verify(urlOpener).openUrl(asString.capture());

    //Process the results and check correctness
    String resultsString = sw.getBuffer().toString().trim();
    JsonElement jsonEl = new JsonParser().parse(resultsString);
    JsonObject json = jsonEl.getAsJsonObject();
    JsonArray results = json.get("results").getAsJsonArray();
    String address = results.get(0).getAsJsonObject().get("formatted_address").getAsString();
    Assert.assertEquals(json.get("status").getAsString(), "OK");
    Assert.assertEquals(address, "220 S Thayer St, Ann Arbor, MI 48104, USA");
    Assert.assertEquals(asString.getValue(), "https://maps.googleapis.com/maps/api/geocode/json?latlng=42.28,-83.74&result_type=street_address&key=AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw");
  }
}
