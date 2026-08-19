class LoginPage {
  constructor(page) {
    this.page = page;
    this.idNumberInput = page.getByLabel('ID Number:');
    this.passwordInput = page.getByLabel('Password:');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(userID, password) {
    await this.idNumberInput.fill(userID);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
