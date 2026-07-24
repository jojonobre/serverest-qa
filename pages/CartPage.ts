import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly increaseQuantityBtn: Locator;
  readonly decreaseQuantityBtn: Locator;
  readonly totalPriceText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.card-body');
    this.increaseQuantityBtn = page.locator('data-testid=produtoAumentarQuantidade');
    this.decreaseQuantityBtn = page.locator('data-testid=produtoDiminuirQuantidade');
    this.totalPriceText = page.locator('data-testid=total');
  }

  async increaseQuantity() {
    await this.increaseQuantityBtn.first().click();
  }

  async decreaseQuantity() {
    await this.decreaseQuantityBtn.first().click();
  }

  async assertCartIsNotEmpty() {
    await expect(this.cartItems.first()).toBeVisible();
  }
}