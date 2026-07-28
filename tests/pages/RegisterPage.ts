import { expect, Locator, Page, Response } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly adminCheckbox: Locator;
  readonly registerButton: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.getByTestId('nome');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.locator('input[type="password"]');
    this.adminCheckbox = page.getByTestId('checkbox');
    this.registerButton = page.getByTestId('cadastrar');
    this.alertMessage = page.locator('.alert').first();
  }

  async navigate() {
    await this.page.goto('/cadastrarusuarios');
    await expect(this.nameInput).toBeVisible();
  }

  async registerUser(
    name: string,
    email: string,
    password: string,
    isAdmin = false
  ): Promise<Response> {
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('/usuarios') && res.request().method() === 'POST'
    );

    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (isAdmin) {
      await this.adminCheckbox.check();
    } else {
      await this.adminCheckbox.uncheck();
    }

    await this.registerButton.click();

    return responsePromise;
  }

  async assertAlertMessage(expectedText: string) {
    await expect(this.alertMessage).toBeVisible({ timeout: 10000 });
    await expect(this.alertMessage).toContainText(expectedText);
  }
}