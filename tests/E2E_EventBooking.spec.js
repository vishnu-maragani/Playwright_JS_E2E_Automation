const {test, expect} = require('@playwright/test');
const{futureDateValue} = require('../utils/featureDateValue');

test('E2E event book automation flow',async({page})=>{
    //Setting env variables
    require('dotenv').config();
    const username = `user_${Date.now()}_${Math.floor(Math.random()*1000)}@gmail.com`;
    const password = process.env.PASSWORD;

    //Registering Account
    await page.goto('https://eventhub.rahulshettyacademy.com/login');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByTestId('register-email').fill(username);
    await page.getByTestId('register-password').fill(password);
    await page.getByPlaceholder('Repeat your password').fill(password);
    await page.getByTestId('register-btn').click();
    await expect(page.getByTestId('logout-btn')).toBeVisible();
    await page.getByTestId('logout-btn').click();

    //Login into the account 
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible();
    await page.getByPlaceholder('you@email.com').fill(username);
    await page.getByLabel('password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('heading',{name:'Discover & Book Amazing Events'})).toBeVisible();

    //Creating a new event
    await page.getByRole('button',{name:'Admin'}).click();
    await page.locator('.absolute').getByRole('link',{name:'Manage Events'}).click();
    await expect(page).toHaveURL(/\/events$/);
    await expect(page.getByRole('heading',{name:'+ New Event'})).toBeVisible();
    const EventTitle = `QA Event${Date.now().toString().slice(-4)}`;
    await page.locator('#event-title-input').fill(EventTitle);
    await page.locator('#admin-event-form textarea').fill('Qa Event for freshers');
    await page.getByLabel('city').fill('Hyderabad');
    await page.getByLabel('venue').fill('Shilpakala vedika');
    await page.getByLabel('Event Date & Time').fill(futureDateValue());
    await page.getByLabel('price ($)').fill('500');
    await page.getByLabel('total seats').fill('50');
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();

    //Navigate to events tab to check added event
     await page.getByTestId('nav-events').click();
     await expect(page.locator('#event-card').first()).toBeVisible();
     const eventLocator = page.getByTestId('event-card').filter({
        has: page.getByRole('heading',{name:EventTitle})
     });
     await expect(eventLocator).toBeVisible();
     const rawSeatsText = await eventLocator.locator('.text-emerald-600').textContent();
     const beforeBookSeatsCount = rawSeatsText.split(' ')[0];
     console.log("Before booking seats count:",beforeBookSeatsCount);
     await eventLocator.getByTestId('book-now-btn').click();  //Start book for event

     //Fill booking form
     await expect(page.locator('#ticket-count')).toHaveText('1');
     await page.getByLabel('Full Name').fill('Vishnu');
     await page.locator('#customer-email').fill(username);
     const phNumber = Math.floor(Math.random()*10000000000).toString();
     await page.getByLabel('Phone Number').fill(phNumber);
     await page.getByRole('button',{name:'Confirm Booking'}).click();

     //Verify Booking confirmation
     await expect(page.locator('.booking-ref')).toBeVisible({timeout:15000});   
     const bookRef = await page.locator('.booking-ref').textContent();
     console.log("Booking reference ID:",bookRef);

     //Verify in my bookings
     await page.getByRole('button',{name:'View My Bookings'}).click();
     await expect(page).toHaveURL(/\/bookings$/);
     await expect(page.locator('#booking-card').first()).toBeVisible();
     await expect(page.locator('.booking-ref',{hasText:bookRef})).toBeVisible();
     await expect(page.locator('.booking-ref')).toContainText(bookRef);
     await expect(page.locator('#booking-card h3',{hasText:EventTitle})).toBeVisible();

     //Verify seats reduces from events page
     await page.getByTestId('nav-events').click();
     await page.waitForResponse(res=>res.url().includes('/events') && res.status() === 200);
     await expect(page.getByTestId('event-card').first()).toBeVisible();
     const EventCard = page.getByTestId('event-card').filter({
        has: page.getByRole('heading',{name:EventTitle})
     });
     await expect(EventCard).toBeVisible();
     const rawTextUpdated = await EventCard.locator('.text-emerald-600').textContent();
     const updatedCount = rawTextUpdated.split(' ')[0];
     console.log('After booking seats count:',updatedCount);
     expect(Number(updatedCount)).toBe(Number(beforeBookSeatsCount)-1);
});