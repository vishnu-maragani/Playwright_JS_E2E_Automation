class LoginPage{
    constructor(page){
        this.page = page;
        this.signInHeading = page.getByRole('heading',{name:'Sign in to EventHub'});
        this.userName = page.getByPlaceholder('you@email.com');
        this.password = page.getByLabel('password');
        this.loginBtn = page.locator('#login-btn');
        this.dashboardHeading = page.getByRole('heading',{name:'Discover & Book Amazing Events'})
    }

    async waitForPage(){
        await this.page.waitForURL(/\/login$/);
        await this.signInHeading.waitFor({state:'visible'});
    }
    async loginUser(username,password){
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

}
module.exports = {LoginPage};