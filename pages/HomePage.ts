import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly addToListButton: Locator;
  readonly logoutButton: Locator;
  readonly noProductMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('data-testid=pesquisar');
    this.searchButton = page.locator('data-testid=botaoPesquisar');
    this.productCards = page.locator('.card');
    this.addToListButton = page.locator('data-testid=adicionarNaLista');
    this.logoutButton = page.locator('data-testid=logout');
    this.noProductMessage = page.locator('text=Nenhum produto foi encontrado');
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async addFirstProductToCart() {
    await this.addToListButton.first().click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async assertProductIsVisible(productName: string) {
    await expect(this.productCards.filter({ hasText: productName })).toBeVisible();
  }

  async assertNoProductFound() {
    await expect(this.noProductMessage).toBeVisible();
  }
}