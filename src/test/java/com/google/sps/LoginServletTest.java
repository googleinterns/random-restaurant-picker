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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.Assert.assertEquals;

import com.google.sps.servlets.LoginServlet;

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

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;
import java.io.PrintWriter;
import java.io.StringWriter;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

@RunWith(MockitoJUnitRunner.class)
public final class LoginServletTest {
  
  @Mock
  HttpServletRequest request;
  @Mock
  HttpServletResponse response;
  @Mock
  HttpSession session;
  @Mock
  GoogleIdTokenVerifier verifier;
  @Mock
  GoogleIdToken token;
  @Mock
  Payload payload;

  @Test
  public void getTest() throws IOException, GeneralSecurityException {
      //See that the login authenticator works
      //Set up mock object responses
      String payloadResponse = "{\"name\":\"tom\",\"email\":\"tom@example.com\",\"age\":\"25\"}";
      when(request.getParameter("id_token")).thenReturn("45");
      when(verifier.verify(anyString())).thenReturn(token);
      when(token.getPayload()).thenReturn(payload);
      when(payload.toString()).thenReturn(payloadResponse);
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      when(response.getWriter()).thenReturn(pw);

      //Run the servlet with mock objects
      new LoginServlet(verifier).doGet(request, response);
      verify(response).setContentType("application/json;");
      verify(response).setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
      verify(response).getWriter();

      //Process data and check correctness
      String results = sw.getBuffer().toString().trim();
      JsonElement jsonEl = new JsonParser().parse(results);
      JsonObject json = jsonEl.getAsJsonObject();
      assertEquals("tom", json.get("name").getAsString());
      assertEquals("tom@example.com", json.get("email").getAsString());
      assertEquals("25", json.get("age").getAsString());
  }
}
