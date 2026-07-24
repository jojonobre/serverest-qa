import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('senha');
    this.submitButton = page.getByTestId('entrar');
    this.errorMessage = page.locator('.alert').first();
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/\/login/);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toContainText(expectedMessage, {
      timeout: 10000,
    });
  }

  async loginAsAdmin(email: string, password: string) {
    await this.login(email, password);

    await expect(this.page).toHaveURL(/\/admin\/home/, {
      timeout: 15000,
    });
  }

  async assertInvalidEmail() {
    await expect(this.emailInput).toBeVisible();

    const isValid = await this.emailInput.evaluate(
      (element) => (element as HTMLInputElement).validity.valid
    );

    expect(isValid).toBe(false);
  }
}