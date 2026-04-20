require('dotenv').config();
const {test,expect} = require('@playwright/test');
const {RegisterUser,LoginPage,EventCreation,EventHub,EventBook,MyBookings} = require('../pages');

test('Refund eligibility check - for Single ticket',async ({page})=>{

    //Login credentials
    const username = `User_${Date.now()}_${Math.floor(Math.random()*10000)}@gmail.com`
    const password = process.env.PASSWORD;

    //Navigate to Application & Register User Account
    const register = new RegisterUser(page);
    await register.goTo();
    await register.registerNewAccount(username,password);
    await register.logout();
    
    //Login to application
    const login = new LoginPage(page);
    await login.waitForPage();
    await login.loginUser(username,password);


    //Navigate to Events Hub 
    const eventCreation = new EventCreation(page);
    await eventCreation.eventPageNavigation();
    const EventTitle = `QA Event ${Date.now().toString().slice(-4)}`;
    await eventCreation.EventForm({eventTitle:EventTitle});

    //Navigate to Book for an event
    const event = new EventHub(page);
    await event.goToEvents()
    const eventFound = event.getEventByTitle(EventTitle);
    const TotalSeats = await event.getAvailableSeats(eventFound)
    console.log(TotalSeats);
    await event.bookEventBtn(eventFound);

//Tes case:1 - Book event for Single Ticket
    const eventBookPage = new EventBook(page);
    const phNumber = Math.floor(Math.random()*10000000000).toString();
    await expect(eventBookPage.ticketCount).toHaveText('1');
    await eventBookPage.eventBook({name:'Vishnu',email:username,phno:phNumber});
    await eventBookPage.confirmBooking();
    
    //
    const myBooking = new MyBookings(page);
    await myBooking.myBookingsNavigation();
    await myBooking.viewDetailsBtn.click();
    const refText = await myBooking.eventRefFirstChar();
    const eventText = await myBooking.bookRefFirstChar();
    expect(refText).toBe(eventText);
    await myBooking.refundLocator.click();
    await expect(myBooking.loadSpinner).toBeVisible();
    await expect(myBooking.loadSpinner).toBeHidden({timeout:6000});

    //refund tex validation
    await expect(myBooking.refundText).toBeVisible();
    await expect(myBooking.refundText).toContainText('Eligible for refund');
    await expect(myBooking.refundText).toBeVisible('Single-ticket bookings qualify for a full refund');
})



//Test :2 
test('Refund eligibility check - For Multiple tickets',async ({page})=>{

    //Login credentials 
    const username = `User_${Date.now()}_${Math.floor(Math.random()*10000)}@gmail.com`
    const password = process.env.PASSWORD;

    //Navigate to Application & Register User Account
    const register = new RegisterUser(page);
    await register.goTo();
    await register.registerNewAccount(username,password);
    await register.logout();
    
    //Login to application
    const login = new LoginPage(page);
    await login.waitForPage();
    await login.loginUser(username,password);


    //Navigate to Events Hub 
    const eventCreation = new EventCreation(page);
    await eventCreation.eventPageNavigation();
    const EventTitle = `QA Event ${Date.now().toString().slice(-4)}`;
    await eventCreation.EventForm({eventTitle:EventTitle});

    //Navigate to Book for an event
    const event = new EventHub(page);
    await event.goToEvents()
    const eventFound = event.getEventByTitle(EventTitle);
    const TotalSeats = await event.getAvailableSeats(eventFound)
    console.log(TotalSeats);
    await event.bookEventBtn(eventFound);

//Tes case:1 - Book event for Single Ticket
    const eventBookPage = new EventBook(page);
    const phNumber = Math.floor(Math.random()*10000000000).toString();
    await eventBookPage.ticketsLocator.click();
    await eventBookPage.ticketsLocator.click();
    await expect(eventBookPage.ticketCount).toHaveText('3');
    await eventBookPage.eventBook({name:'Vishnu',email:username,phno:phNumber});
    await eventBookPage.confirmBooking();
    
    //Refund check for 3 tickets booking
    const myBooking = new MyBookings(page);
    await myBooking.myBookingsNavigation();
    await myBooking.viewDetailsBtn.click();
    const refText = await myBooking.eventRefFirstChar();
    const eventText = await myBooking.bookRefFirstChar();
    expect(refText).toBe(eventText);
    await myBooking.refundLocator.click();
    await expect(myBooking.loadSpinner).toBeVisible();
    await expect(myBooking.loadSpinner).toBeHidden({timeout:6000});
    //refund text validation
    await expect(myBooking.refundText).toBeVisible();
    await expect(myBooking.refundText).toContainText('Not eligible for refund.');
    await expect(myBooking.refundText).toBeVisible('Group bookings (3 tickets) are non-refundable');
})