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

import com.google.sps.data.Response;
import com.google.sps.data.Restaurant;
import com.google.sps.data.Photo;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.ArrayList;
import java.util.List;

@RunWith(JUnit4.class)
public final class ResponseTest {
  @Test
  public void NoRerolls() {
    // A Response with only one restaurant.
    // pick() is called once, which should update the response status to NO_REROLLS.

    List<Restaurant> restArr = new ArrayList<>();
    restArr.add(new Restaurant("McDonald's", 4.5, "OPERATIONAL", 2, new Photo[]{}));
    Response response = new Response("OK", restArr);
    response.pick();

    String actual = response.status();
    String expected = "NO_REROLLS";
    Assert.assertEquals(expected, actual);
  }
}
