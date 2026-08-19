class LoginPage {
  constructor(page) {
    this.page = page;
    this.idNumberInput = page.getByLabel('ID Number:');
    this.passwordInput = page.getByLabel('Password:');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.invalidCredentialsAlert = page.getByText('Invalid credentials', { exact: true });
  }

  async goto() {
    await this.page.goto('/');

    // The production login button deliberately pulses forever. Disable visual
    // motion only in the test browser so Playwright can perform a normal,
    // actionability-checked click instead of relying on force-clicking.
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `,
    });
  }

  async login(userID, password) {
    await this.idNumberInput.fill(userID);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
