require('dotenv').config();
class ApiEvent{
    constructor(request){
        this.request= request;
    }

    async eventBookId(){
        //Step 1: Login /Register
        let resoponse = {};
        const username = `Yaho_${Date.now()}@gmail.com`
        const loginresponse = await this.request.post('https://api.eventhub.rahulshettyacademy.com/api/auth/register',{
            data:{
                email:username,
                password:process.env.PASSWORD
            }
        });
        if(!loginresponse.ok()){
            throw new Error('Registering user failed');
        }
        const body = await loginresponse.json();
        resoponse.token = body.token;      //Login Token

        //Step 2: Grab the Evnet ID
        const eventId = await this.request.get('https://api.eventhub.rahulshettyacademy.com/api/events',{
            headers:{
                'Authorization':`Bearer ${resoponse.token}`
            }
        })
        if(!eventId.ok()){
            throw new Error('Event not found');
        };
        const eventBody = await eventId.json();
        resoponse.eventId = eventBody.data[0].id;   //Event ID

        //Step 3: Book an event
        const bookId = await this.request.post('https://api.eventhub.rahulshettyacademy.com/api/bookings',{
            headers:{
                'Authorization': `Bearer ${resoponse.token}`
            },
            data:{
                eventId:resoponse.eventId,
                customerName:'SunnySummer',
                customerEmail:username,
                customerPhone:'9832465729',
                quantity:1
            }
        })

        if(!bookId.ok()){
            throw new Error('Booking failed');
        }
        console.log(bookId.status());
        const bookingBody = await bookId.json();
        resoponse.bookID = bookingBody.data.id;
        return resoponse;
    }
}
module.exports = {ApiEvent};