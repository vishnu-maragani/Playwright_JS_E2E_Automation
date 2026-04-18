class RegisterUser{
    constructor(page){
        this.page=page;
        this.registerBtn = page.getByRole('link', { name: 'Register' });
        this.name = page.getByTestId('register-email');
        this.enterPassword =  page.getByTestId('register-password');
        this.confirmPassword = page.getByPlaceholder('Repeat your password');
        this.register =  page.getByTestId('register-btn');
        this.logOutBtn = page.getByTestId('logout-btn');
    }

    async goTo(){
        await this.page.goto('https://eventhub.rahulshettyacademy.com/login');
    }

    async registerNewAccount(username,password){
        await this.registerBtn.click();
        await this.name.fill(username);
        await this.enterPassword.fill(password);
        await this.confirmPassword.fill(password);
        await this.register.click();
    }
    
    async logout(){
        await this.logOutBtn.click();
    }

}
module.exports = {RegisterUser};