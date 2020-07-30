/*=========================
    USER'S LOCATION AND ADDRESS
 =========================*/
describe("Test the geoLocFallback function", () => {
    let dummyElement;

    beforeEach(() => {
        jasmine.Ajax.install();
        dummyElement = document.createElement('div');
        spyOn(window, 'geoLocFallback').and.callThrough();
        spyOn(document, 'getElementById').and.returnValue(dummyElement);
        spyOn(window, 'convertLocation').and.returnValue("155 W 51st St, New York, NY 10019");
        spyOn(window, 'geoLocHardcoded');
        spyOn(localStorage, 'setItem');
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it("Test that the function runs correctly", async () => {
        jasmine.Ajax.stubRequest('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBL_9GfCUu7DGDvHdtlM8CaAywE2bVFVJc').andReturn({
            "status": 200,
            "contentType": "application/json",
            "responseJSON": {location: {lat: 40, lng: -80}}
        });
        let x = await geoLocFallback();
        expect(geoLocFallback).toHaveBeenCalled();
        expect(convertLocation).toHaveBeenCalled();
        expect(dummyElement.innerText).toEqual("155 W 51st St, New York, NY 10019");
        expect(geoLocHardcoded).toHaveBeenCalledTimes(0);
        expect(setItem).toHaveBeenCalledTimes(2);
    });
});

describe("Test the geoLocHardcoded function", () => {
    let dummyElement;

    beforeEach(() => {
        dummyElement = document.createElement('div');
        spyOn(window, 'geoLocHardcoded').and.callThrough();
        spyOn(document, 'getElementById').and.returnValue(dummyElement);
    });

    it("Test the function runs correctly", async () => {
        spyOn(window, 'convertLocation').and.returnValue(Promise.resolve("155 W 51st St, New York, NY 10019"));
        await geoLocHardcoded();
        expect(convertLocation).toHaveBeenCalled();
        expect(geoLocHardcoded).toHaveBeenCalled();
        expect(dummyElement.innerText).toEqual("155 W 51st St, New York, NY 10019");
    });

    it("Test the function when an error is throw", async () => {
        spyOn(window, 'convertLocation').and.returnValue(Promise.resolve("Couldn't convert the address"));
        await geoLocHardcoded();
        expect(convertLocation).toHaveBeenCalled();
        expect(geoLocHardcoded).toHaveBeenCalled();
        expect(dummyElement.innerText).toEqual("Couldn't convert the address");
    });
});

describe("Test the convertLocation function", () => {
    let location;
    
    beforeEach(() => {
        spyOn(window, 'convertLocation').and.callThrough();
    });

    it("Check that the function runs properly", async () => {
        location = new Response('{\"plus_code\":{\"compound_code\":\"2232+5C Fredericktown, PA, USA\",\"global_code\":\"87G22232+5C\"},\"results\":[{\"formatted_address\":\"17 Water St, Fredericktown, PA 15333, USA\",\"geometry\":{\"location\":{\"lat\":40.00271559999999,\"lng\":-79.9978914},\"location_type\":\"ROOFTOP\",\"viewport\":{\"northeast\":{\"lat\":40.0040645802915,\"lng\":-79.99654241970849},\"southwest\":{\"lat\":40.0013666197085,\"lng\":-79.9992403802915}}},\"place_id\":\"ChIJc9FCJiYPNYgRO5lqnx-nPt8\",\"plus_code\":{\"compound_code\":\"2232+3R Fredericktown, PA, USA\",\"global_code\":\"87G22232+3R\"},\"types\":[\"street_address\"]}],\"status\":\"OK\"}');
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(location));
        let response =  await convertLocation({lat: 40.003, lng: -79.999});
        expect(convertLocation).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/convert?lat=40.003&lng=-79.999');
        expect(response).toEqual("17 Water St, Fredericktown, PA 15333, USA");
    });

    it("Check the function response with invalid return", async () => {
        location = new Response('{\"plus_code\":{\"compound_code\":\"2232+52 K\u00fc\u00e7\u00fckotlukbeli\/Otlukbeli\/Erzincan, Turkey\",\"global_code\":\"8HG22232+52\"},\"results\":[],\"status\":\"ZERO_RESULTS\"}');
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(location));
        let response = await convertLocation({lat: 40.003, lng: 40});
        expect(convertLocation).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('/convert?lat=40.003&lng=40');
        expect(response).toEqual("Couldn't convert the address");
    });
});

/*=========================
    USER SIGN-IN
 =========================*/
describe("Test the addUserContent Function", () => {

});

/*=========================
    HTML
 =========================*/
describe("Test the ResultsPage Function", () => {
    let dummyContainer;
    let dummyPick;
    let dummyRating;
    let htmlResponse;
    let htmlCode;
    
    beforeEach(async () => {
        htmlResponse = new Response('<div><h id="pick"></h><h1 id="rating"></h1><div id="photo"></div></div>');
        htmlCode = '<div><h id="pick"></h><h1 id="rating"></h1><div id="photo"></div></div>';
        spyOn(window, 'resultsPage').and.callThrough();
        dummyContainer = document.createElement('div');
        dummyPick = document.createElement('div');
        dummyRating = document.createElement('div');
        spyOn(document, 'getElementById').and.returnValues(dummyContainer, dummyPick, dummyRating);
        spyOn(window, 'loadImage');
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(htmlResponse));
    });

    it("Test that the function runs correctly", async () =>{
        let x = await resultsPage("restaurant", "5", "https://www.w3schools.com/images/lamp.jpg");
        expect(fetch).toHaveBeenCalledWith("../results.html");
        expect(resultsPage).toHaveBeenCalled();
    });

    it("Test that the function alters the DOM correctly", async () =>{
        let x = await resultsPage("restaurant", "5", "https://www.w3schools.com/images/lamp.jpg");
        expect(fetch).toHaveBeenCalledWith("../results.html");
        expect(resultsPage).toHaveBeenCalled();
        expect(dummyContainer.innerHTML).toEqual(htmlCode);
        expect(dummyPick.innerText).toEqual("restaurant");
        expect(dummyRating.innerText).toEqual("5");
    });
});

describe("Test Load Image Function", () => {
    it("see the the load image function runs", function() {
        spyOn(window, 'loadImage');
        loadImage('link');
        expect(loadImage).toHaveBeenCalledWith('link');
    });

    it("check the interior functions of loadImage", function() {
        spyOn(window, 'loadImage').and.callThrough();
        let dummyElement = document.createElement('div');
        spyOn(document, 'getElementById').and.returnValue(dummyElement);
        loadImage('https://www.w3schools.com/images/lamp.jpg');
        expect(loadImage).toHaveBeenCalledWith('https://www.w3schools.com/images/lamp.jpg');
        expect(dummyElement.firstChild.src).toEqual('https://www.w3schools.com/images/lamp.jpg');
    });
});