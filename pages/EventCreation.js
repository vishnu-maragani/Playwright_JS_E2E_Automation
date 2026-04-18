const { futureDateValue } = require("../utils/featureDateValue");

class EventCreation{
    constructor(page){
        this.page = page;
        this.admin = page.getByRole('button',{name:'Admin'});
        this.manageEvents = page.locator('.absolute').getByRole('link',{name:'Manage Events'});
        this.eventPageHeading = page.getByRole('heading',{name:'+ New Event'});
        this.EventTitleLocator =page.locator('#event-title-input');
        this.EventDescription = page.locator('#admin-event-form textarea');
        this.EventCity = page.getByLabel('city');
        this.EventVenue = page.getByLabel('venue');
        this.EventDateAndTime = page.getByLabel('Event Date & Time');
        this.EventPrice = page.getByLabel('price ($)');
        this.EventSeats = page.getByLabel('total seats');
        this.AddEventBtn = page.locator('#add-event-btn');
        this.EvnetSuccesToaster = page.getByText('Event created!');
    }

    async eventPageNavigation(){
        await this.admin.click();
        await this.manageEvents.click();
        //Sync navigation
        await this.page.waitForURL(/\/events$/);
        await this.eventPageHeading.waitFor({state:'visible'});
    }
    async EventForm({
        eventTitle,
        description= 'Qa Event for freshers',
        city = 'Hyderabad',
        venue ='Shilpakala vedika',
        price = '500',
        seats = '50'
    }){
        await this.EventTitleLocator.fill(eventTitle);
        await this.EventDescription.fill(description);
        await this.EventCity.fill(city);
        await this.EventVenue.fill(venue);
        await this.EventDateAndTime.fill(futureDateValue());
        await this.EventPrice.fill(price);
        await this.EventSeats.fill(seats);
        await this.AddEventBtn.click();
        await this.EvnetSuccesToaster.waitFor({state:'visible'});
    }   
}

module.exports = {EventCreation};