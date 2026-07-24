import { expect, Locator, Page } from '@playwright/test';

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

    this.searchInput = page.getByTestId('pesquisar');
    this.searchButton = page.getByTestId('botaoPesquisar');
    this.productCards = page.locator('.card, [class*="product"], [class*="item"]');
    this.addToListButton = page.getByTestId('adicionarNaLista');
    this.logoutButton = page.getByRole('button', { name: /logout|sair/i });
    this.noProductMessage = page.getByText(/nenhum produto|não encontrado/i);
  }

  async searchProduct(name: string) {
    await expect(this.searchInput).toBeVisible({ timeout: 10000 });
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async addFirstProductToCart() {
    await expect(this.addToListButton.first()).toBeVisible({ timeout: 10000 });
    await this.addToListButton.first().click();
  }

  async addProductToCart(productName: string) {
    const productCard = this.productCards.filter({
      hasText: productName,
    });

    await expect(productCard).toBeVisible();
    await productCard.locator('[data-testid="adicionarNaLista"]').click();
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login/);
  }

  async assertProductIsVisible(productName: string) {
  const productPattern = new RegExp(productName, 'i');
  await expect(
    this.productCards.filter({ hasText: productPattern }).first()
  ).toBeVisible({ timeout: 10000 });
}

  async assertNoProductFound() {
    await expect(this.noProductMessage).toBeVisible();
  }
}