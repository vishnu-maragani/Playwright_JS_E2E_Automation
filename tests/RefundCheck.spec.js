const {test,expect} = require('@playwright/test');
const {UserFlow}  = require('../flows/userFlow');

test('Refund validation checking',async ({page})=>{


    const username = `User_${Date.now()}_${Math.floor(Math.random()*10000)}@gmail.com`;
    const password = process.env.PASSWORD;
    const EventTitle = `QA Event${Date.now().toString().slice(-4)}`;
    const name='Vishnu';
    const phNumber = Math.floor(Math.random()*10000000000).toString();
    const flow = new UserFlow(page);
    await flow.registerUser(username,password);
    await flow.userLogin(username,password);
    await flow.createEvent(EventTitle);
    await flow.eventPage(EventTitle);
    await flow.bookEvent(name,username,phNumber,3);
    // expect(flow.bookEvent.ticket)
    const result = await flow.myBookingsRefundValidation();
    expect(result.refText).toBe(result.eventText);
    expect(result.refundText).toContain('Not eligible for refund');
});