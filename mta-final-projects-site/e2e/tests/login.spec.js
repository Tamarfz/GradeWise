const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const adminID = process.env.E2E_ADMIN_ID;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe('Authentication', () => {
  test.skip(
    !adminID || !adminPassword,
    'Set E2E_ADMIN_ID and E2E_ADMIN_PASSWORD before running login tests.'
  );

  test('admin login redirects to the admin dashboard', async ({ page }) => {
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
});
