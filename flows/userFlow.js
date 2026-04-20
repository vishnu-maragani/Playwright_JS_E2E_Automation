const {RegisterUser,LoginPage,EventCreation,EventHub,EventBook,MyBookings} = require('../pages');

class UserFlow{
    constructor(page){
        this.page = page; 
        
        this.register = new RegisterUser(page);
        this.login = new LoginPage(page);
        this.createevent = new EventCreation(page);
        this.eventpage = new EventHub(page);
        this.bookevent = new EventBook(page);
        this.bookings = new MyBookings(page);
    }

    async registerUser(username,password){
        await this.register.goTo();
        await this.register.registerNewAccount(username,password);
        await this.register.logout();
    }

    async userLogin(username,password){
        await this.login.waitForPage();
        await this.login.loginUser(username,password);
    }

    async createEvent(eventTitle){
        await this.createevent.eventPageNavigation();
        await this.createevent.EventForm({eventTitle:eventTitle});
    }

    async eventPage(eventTitle){
        await this.eventpage.goToEvents()
        const eventFound = this.eventpage.getEventByTitle(eventTitle);
        const TotalSeats = await this.eventpage.getAvailableSeats(eventFound)
        console.log(TotalSeats);
        await this.eventpage.bookEventBtn(eventFound);
    }

    async bookEvent(Name,Email,Ph,ticket=1){
        for(let i=1;i<ticket;i++){
            await this.bookevent.ticketsLocator.click();
        }
        // await expect(this.bookevent.ticketCount).toHaveText(toString(ticket));
        await this.bookevent.eventBook({name:Name,email:Email,phno:Ph});
        await this.bookevent.confirmBooking();
    }

    async myBookingsRefundValidation(){
        await this.bookings.myBookingsNavigation();
        await this.bookings.viewDetailsBtn.click();
        const refText = await this.bookings.eventRefFirstChar();
        const eventText = await this.bookings.bookRefFirstChar();
        await this.bookings.refundLocator.click();
        await this.bookings.loadSpinner.waitFor({state:'hidden'});
        const refundText = await this.bookings.refundText.textContent();
        return {
            refText,eventText,refundText
        }
    }
}
module.exports = {UserFlow};