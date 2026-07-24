import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('data-testid=email');
    this.passwordInput = page.locator('data-testid=senha');
    this.submitButton = page.locator('data-testid=entrar');
    this.errorMessage = page.locator('.alert');
  }

  async navigate() {
    await this.page.goto('https://front.serverest.dev/login');
    await expect(this.page).toHaveURL(/\/login/);
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);

    await Promise.all([
      this.page.waitForURL(/\/admin\/home/, { timeout: 15000 }),
      this.submitButton.click(),
    ]);
  }


}