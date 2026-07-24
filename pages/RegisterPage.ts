import { Page, Locator, expect } from '@playwright/test';

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
    this.nameInput = page.locator('data-testid=nome');
    this.emailInput = page.locator('data-testid=email');
    this.passwordInput = page.locator('data-testid=senha');
    this.adminCheckbox = page.locator('data-testid=checkbox');
    this.registerButton = page.locator('data-testid=cadastrar');
    this.alertMessage = page.locator('.alert');
  }

  async navigate() {
    await this.page.goto('https://front.serverest.dev/cadastrarusuarios');
  }

  async registerUser(name: string, email: string, pass: string, isAdmin: boolean = false) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    
    if (isAdmin) {
      await this.adminCheckbox.check();
    }
    
    await this.registerButton.click();
  }

  async assertAlertMessage(expectedText: string) {
    await expect(this.alertMessage).toContainText(expectedText);
  }
}