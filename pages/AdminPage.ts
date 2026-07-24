import { expect, Locator, Page, Response } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly registerProductMenu: Locator;
  readonly listProductsMenu: Locator;
  readonly productNameInput: Locator;
  readonly productPriceInput: Locator;
  readonly productDescriptionInput: Locator;
  readonly productQuantityInput: Locator;
  readonly saveProductButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.registerProductMenu = page.getByTestId('cadastrar-produtos');
    this.listProductsMenu = page.getByTestId('listar-produtos');

    this.productNameInput = page.getByTestId('nome');
    this.productPriceInput = page.getByTestId('preco');
    this.productDescriptionInput = page.getByTestId('descricao');
    this.productQuantityInput = page.getByTestId('quantity');
    this.saveProductButton = page.getByTestId('cadastarProdutos');
  }

  async goToRegisterProduct() {
    await this.registerProductMenu.click();
    await expect(this.productNameInput).toBeVisible();
  }

  async goToListProducts() {
    await this.listProductsMenu.click();
    await expect(
      this.page.getByRole('heading', { name: /lista dos produtos/i })
    ).toBeVisible();
  }

  async fillProductForm(
    name: string,
    price: string,
    description: string,
    quantity: string
  ) {
    await this.productNameInput.fill(name);
    await this.productPriceInput.fill(price);
    await this.productDescriptionInput.fill(description);
    await this.productQuantityInput.fill(quantity);
  }

  async submitProduct(): Promise<Response> {
    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes('/produtos') &&
        response.request().method() === 'POST'
    );

    await this.saveProductButton.click();

    return responsePromise;
  }

  async deleteProductByName(name: string) {
    const productRow = this.page
      .getByRole('row')
      .filter({ hasText: name });

    await expect(productRow).toBeVisible({ timeout: 10000 });

    this.page.once('dialog', dialog => dialog.accept());

    await productRow
      .getByRole('button', { name: /^Excluir$/i })
      .click();

    await expect(productRow).toBeHidden({ timeout: 10000 });
  }
}