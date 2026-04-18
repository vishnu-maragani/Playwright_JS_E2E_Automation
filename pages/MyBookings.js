class MyBookings{
    constructor(page){
        this.page  = page;
        this.viewMyBookings = page.getByRole('button',{name:'View My Bookings'});
        this.bookingCards = page.locator('#booking-card');
    }

    async myBookingsNavigation(){
        await this.viewMyBookings.click();
        await this.page.waitForURL(/\/bookings$/);
        await this.bookingCards.first().waitFor({state:'visible'});
    }

    getBookRef(bookRef){
        return this.page.locator('.booking-ref',{hasText:bookRef});
    }
    getBookingEvenTitle(eventtitle){
        return this.page.locator('#booking-card h3',{hasText:eventtitle});
    }
}
module.exports = {MyBookings};