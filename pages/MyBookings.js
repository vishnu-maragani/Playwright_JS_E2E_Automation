class MyBookings{
    constructor(page){
        this.page  = page;
        this.viewMyBookings = page.getByRole('button',{name:'View My Bookings'});
        this.bookingCards = page.locator('#booking-card');
        this.viewDetailsBtn = page.getByRole('button',{name:'View Details'}).first();
        this.bookrefId = page.locator('.font-mono').first();
        this.eventNameLocator = page.locator('.text-2xl'); 
        this.refundLocator = page.getByTestId('check-refund-btn');
        this.loadSpinner = page.locator('#refund-spinner');
        this.refundText = page.getByTestId('refund-result');
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


    async bookRefFirstChar(){
        const bookRefText = await this.bookrefId.textContent();
        const bookReffirstChar = bookRefText.split('-')[0];
        return bookReffirstChar;
    }
    async eventRefFirstChar(){ 
        const EventName = await this.eventNameLocator.textContent();
        const EventFirstChar = EventName.charAt(0);
        return EventFirstChar;
    }

}
module.exports = {MyBookings};