class EventBook{
    constructor(page){
        this.page = page;
        this.ticketCount = page.locator('#ticket-count');
        this.name =page.getByLabel('Full Name');
        this.email = page.locator('#customer-email');
        this.phNo = page.getByLabel('Phone Number');
        this.bookBtn = page.getByRole('button',{name:'Confirm Booking'});
        this.ConfirmBookingHeading = page.getByRole('heading',{name:/Booking Confirmed/i});
        this.bookRef = page.locator('.booking-ref');
        this.ticketsLocator = page.getByRole('button',{name:'+'});
    }

    async eventBook({
        name,
        email,
        phno 
    }){
        await this.name.fill(name);
        await this.email.fill(email);
        await this.phNo.fill(phno);
    }

    async confirmBooking(){
        await this.bookBtn.click();
        await this.ConfirmBookingHeading.waitFor({state:'visible'});
    }
}
module.exports  = {EventBook};