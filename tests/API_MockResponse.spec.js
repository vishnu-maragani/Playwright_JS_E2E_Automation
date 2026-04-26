require('dotenv').config();
const {test,expect} = require('@playwright/test');
const {ApiUtils} = require('../utils/Api_LoginToken');
const {EventsResponse,EventResponse2} = require('../mocks//EventMockResponse');
//Getting token before all tescases
let response;
test.beforeAll(async({request})=>{
    const API = new ApiUtils(request);
    response = await API.loginToken();
})

test('API Mock event response 6 events',async({page})=>{

    //Step 1: Login to the application using Bypass localstorage
    await page.addInitScript(value=>{
        window.localStorage.setItem('eventhub_token',value);
    },response.token);
    console.log(response.token);

    //Step 2: Mocking the events response with 6 events
    await EventsResponse(page)

    //Step 3: Navigating to Events page
    await page.goto('http://eventhub.rahulshettyacademy.com/events');
    await expect(page).toHaveURL(/\/events$/);

    //Step 4: Verify cards loaded from Mock
    await expect(page.locator('#event-card').first()).toBeVisible();
    await expect(page.locator('#event-card')).toHaveCount(6);

    //Step 5: Verify banner waring visisble
    const sandboxBanner = page.getByText(/sandbox holds up to/i);
    await expect(sandboxBanner).toBeVisible();
    await expect(sandboxBanner).toContainText('9 bookings');
});


test('API Mock Event response 4 events',async({page})=>{
    
    //Step 1: Bypass the login using local storage
    await page.addInitScript(value=>{
        window.localStorage.setItem('eventhub_token',value);
    },response.token);

    //Step 2: Mocking event response 4 events
    await EventResponse2(page);

    //Step 3: Navigating to events page
    await page.goto('http://eventhub.rahulshettyacademy.com/events');
    await expect(page).toHaveURL(/\/events$/);

    //Step 4: Verify cards loaded from mock
    const eventCards = page.locator('#event-card');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(4);

    //Step 5: Verify banner is visble
    const sandboxBanner = page.getByText(/sandbox holds up to/i);
    await expect(sandboxBanner).toBeHidden();
});