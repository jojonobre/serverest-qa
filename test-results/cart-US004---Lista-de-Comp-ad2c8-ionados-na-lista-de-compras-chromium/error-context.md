# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> US004 - Lista de Compras (Carrinho) >> CT017 - Visualização dos produtos adicionados na lista de compras
- Location: tests\cart.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="item-carrinho"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="item-carrinho"]').first()

```

```yaml
- navigation:
  - img
  - list:
    - listitem: Home
    - listitem: Lista de Compras
    - listitem: Carrinho
  - button "Logout"
- heading "Em construção aguarde" [level=1]
- img
```

# Test source

```ts
  1  | import { expect, Locator, Page } from '@playwright/test';
  2  | 
  3  | export class CartPage {
  4  |   readonly page: Page;
  5  |   readonly cartItems: Locator;
  6  |   readonly increaseButton: Locator;
  7  |   readonly decreaseButton: Locator;
  8  |   readonly quantityInput: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.cartItems = page.locator('[data-testid="item-carrinho"]');
  13 |     this.increaseButton = page.getByTestId('aumentar-quantidade');
  14 |     this.decreaseButton = page.getByTestId('diminuir-quantidade');
  15 |     this.quantityInput = page.locator('input[type="number"]').first();
  16 |   }
  17 | 
  18 |   async assertCartIsNotEmpty() {
> 19 |     await expect(this.cartItems.first()).toBeVisible();
     |                                          ^ Error: expect(locator).toBeVisible() failed
  20 |   }
  21 | 
  22 |   async getProductQuantity(): Promise<number> {
  23 |     const value = await this.quantityInput.inputValue();
  24 |     return parseInt(value, 10);
  25 |   }
  26 | 
  27 |   async increaseQuantity() {
  28 |     await this.increaseButton.first().click();
  29 |   }
  30 | 
  31 |   async decreaseQuantity() {
  32 |     await this.decreaseButton.first().click();
  33 |   }
  34 | }
```