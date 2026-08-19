const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const adminID = process.env.E2E_ADMIN_ID;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe('Authentication', () => {
  test('admin login redirects to the admin dashboard', async ({ page }) => {
    test.skip(
      !adminID || !adminPassword,
      'Set E2E_ADMIN_ID and E2E_ADMIN_PASSWORD before running this test.'
    );

    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(adminID, adminPassword);

    // Assert
    await expect(page).toHaveURL(/\/admin$/);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('token')))
      .not.toBeNull();
  });

  test('invalid password keeps the user on login and shows an error', async ({ page }) => {
    test.skip(!adminID, 'Set E2E_ADMIN_ID before running this test.');

    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(adminID, 'definitely-not-the-demo-password');

    // Assert
    await expect(loginPage.invalidCredentialsAlert).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('token')))
      .toBeNull();
  });
});
