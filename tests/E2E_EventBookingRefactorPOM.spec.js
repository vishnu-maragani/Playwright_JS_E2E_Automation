const {test, expect} = require('@playwright/test');
const{futureDateValue} = require('../utils/featureDateValue');
const{RegisterUser,LoginPage,EventCreation,EventHub,EventBook,MyBookings} = require('../pages');

test('E2E event book automation flow',async({page})=>{
    //Setting env variables
    require('dotenv').config();
    const username = `user_${Date.now()}_${Math.floor(Math.random()*1000)}@gmail.com`;
    const password = process.env.PASSWORD;

    //Registering Account
    const registerUser = new RegisterUser(page);
    await registerUser.goTo();
    await registerUser.registerNewAccount(username,password);
    await expect(registerUser.logOutBtn).toBeVisible();
    await registerUser.logout();

    //Login into the account 
    const loginPage = new LoginPage(page);
    await loginPage.waitForPage();
    await loginPage.looginUser(username,password);
    await expect(loginPage.dashboardHeading).toBeVisible();

    //Creating a new event
    const eventCreation = new EventCreation(page);
    const EventTitle = `QA Event${Date.now().toString().slice(-4)}`;
    await eventCreation.eventPageNavigation();
    await eventCreation.EventForm({eventTitle:EventTitle});


    //Navigate to events tab to check added event
    const events = new EventHub(page);
    await events.goToEvents();
    const eventLocator = events.getEventByTitle(EventTitle);
    await expect(eventLocator).toBeVisible({timeout:5000});  
    const beforeBookSeatsCount = await events.getAvailableSeats(eventLocator);
    console.log("Before booking seats count:",beforeBookSeatsCount);
    await events.bookEventBtn(eventLocator);

     //Fill booking form
     const eventBookForm = new EventBook(page);
     const phNumber = Math.floor(Math.random()*10000000000).toString();
     await expect(eventBookForm.ticketCount).toHaveText('1');
     await eventBookForm.eventBook({name:'Vishnu',email:username,phno:phNumber});
     await eventBookForm.confirmBooking();
     const bookRef = await eventBookForm.bookRef.textContent();
     console.log("Booking reference ID:",bookRef);

     //Verify in my bookings
     const mybookings = new MyBookings(page);
     await mybookings.myBookingsNavigation();
     await expect(mybookings.getBookRef(bookRef)).toContainText(bookRef);
     await expect(mybookings.getBookingEvenTitle(EventTitle)).toBeVisible();

     //Verify seats reduces from events page
     await events.goToEvents();
     const EventCard = await events.getEventByTitle(EventTitle);
     await expect(EventCard).toBeVisible();
     const updatedCount = await events.getAvailableSeats(EventCard);
     console.log('After booking seats count:',updatedCount);
     expect(Number(updatedCount)).toBe(Number(beforeBookSeatsCount)-1);
});