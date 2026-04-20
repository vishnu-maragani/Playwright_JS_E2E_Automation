class EventHub{
    constructor(page){
        this.page = page;
        this.EventHubNavigation = page.getByTestId('nav-events');
        this.EventCard = page.getByTestId('event-card');
    }

    async goToEvents(){
        await this.EventHubNavigation.click();
        await this.page.waitForLoadState('networkidle')
        await this.EventCard.first().waitFor({state:'visible'});
    }
    getEventByTitle(eventName){
        return this.EventCard.filter({
        has: this.page.getByRole('heading',{name:eventName})
    })};

    async getAvailableSeats (eventLocator){
        const rawSeatsText = await eventLocator.locator('.text-emerald-600').textContent();
        return rawSeatsText.split(' ')[0];
    }
    async bookEventBtn(eventLocator){
        await eventLocator.getByTestId('book-now-btn').click();
    }
}
module.exports = {EventHub};