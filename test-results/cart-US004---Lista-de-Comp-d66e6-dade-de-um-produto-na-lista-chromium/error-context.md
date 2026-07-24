# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> US004 - Lista de Compras (Carrinho) >> CT020 - Diminuir quantidade de um produto na lista
- Location: tests\cart.spec.ts:55:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('aumentar-quantidade').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - list [ref=e7]:
        - listitem [ref=e8]:
          - generic [ref=e9] [cursor=pointer]: Home
        - listitem [ref=e10]:
          - generic [ref=e11] [cursor=pointer]: Lista de Compras
        - listitem [ref=e12]:
          - generic [ref=e13] [cursor=pointer]: Carrinho
      - button "Logout" [ref=e15] [cursor=pointer]
  - generic [ref=e16]:
    - heading "Em construção aguarde" [level=1] [ref=e17]
    - img [ref=e18]
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
  19 |     await expect(this.cartItems.first()).toBeVisible();
  20 |   }
  21 | 
  22 |   async getProductQuantity(): Promise<number> {
  23 |     const value = await this.quantityInput.inputValue();
  24 |     return parseInt(value, 10);
  25 |   }
  26 | 
  27 |   async increaseQuantity() {
> 28 |     await this.increaseButton.first().click();
     |                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  29 |   }
  30 | 
  31 |   async decreaseQuantity() {
  32 |     await this.decreaseButton.first().click();
  33 |   }
  34 | }
```