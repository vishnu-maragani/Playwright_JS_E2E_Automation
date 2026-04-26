
require('dotenv').config();
class ApiUtils{
    constructor(request){
        this.request = request;
    }

    async loginToken(){
        let response = {}
        const username= `User_${Date.now()}_${Math.floor(Math.random()*1000)}@gmail.com`;
        const loginResponse = await this.request.post('https://api.eventhub.rahulshettyacademy.com/api/auth/register',{
            data:{
                email: username,
                password:process.env.PASSWORD
            }});

            if(!loginResponse.ok()){
                throw new Error('Registering user is failed');
            }
            console.log(loginResponse.status());
            const body = await loginResponse.json();
            response.token = body.token
            return response;
    }
}
module.exports = {ApiUtils};