const {test,expect} = require('@playwright/test');
const {ApiEvent} = require('../utils/EventUnautorized');

//Grab the Response frrom API
let response ;
test.beforeAll(async({request})=>{
    const API = new ApiEvent(request);
    response = await API.eventBookId();
    console.log(response.bookID);
})

test('User1 Booking Event Via API',async({page})=>{
    //Step 1: Login to APPLICATION through UI 
    const username = `Gmail_${Date.now()}@gmail.com`
    await page.goto('https://eventhub.rahulshettyacademy.com/register');
    await page.locator('#register-email').fill(username);
    await page.locator('#register-password').fill(process.env.PASSWORD);
    await page.getByPlaceholder('Repeat your password').fill(process.env.PASSWORD);
    await page.locator('#register-btn').click();
    await expect(page.getByText('Home')).toBeVisible();


    //Step 2: Navigate to the Booking details to view Others booking details
    await page.goto(`https://eventhub.rahulshettyacademy.com/bookings/${response.bookID}`);
    await expect(page.getByText('You are not authorized to view this booking')).toBeVisible({timeout:10*1000});
})