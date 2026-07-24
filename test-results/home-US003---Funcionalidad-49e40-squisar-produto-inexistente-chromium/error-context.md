# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> US003 - Funcionalidades da Home >> CT013 - Pesquisar produto inexistente
- Location: tests\home.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('data-testid=pesquisar')

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
          - generic [ref=e11] [cursor=pointer]: Cadastrar Usuários
        - listitem [ref=e12]:
          - generic [ref=e13] [cursor=pointer]: Listar Usuários
        - listitem [ref=e14]:
          - generic [ref=e15] [cursor=pointer]: Cadastrar Produtos
        - listitem [ref=e16]:
          - generic [ref=e17] [cursor=pointer]: Listar Produtos
        - listitem [ref=e18]:
          - generic [ref=e19] [cursor=pointer]: Relatórios
      - button "Logout" [ref=e21] [cursor=pointer]
  - generic [ref=e22]:
    - heading "Bem Vindo Fulano da Silva" [level=1] [ref=e23]
    - paragraph [ref=e24]: Este é seu sistema para administrar seu ecommerce.
    - separator [ref=e25]
    - paragraph [ref=e26]:
      - generic [ref=e30]:
        - heading "Cadastrar Usuários" [level=5] [ref=e31]
        - paragraph [ref=e32]: Funcionalidade de cadastro de usuários para ter acesso ao ecommerce.
        - generic [ref=e33] [cursor=pointer]: Cadastrar
      - generic [ref=e36]:
        - heading "Listar Usuários" [level=5] [ref=e37]
        - paragraph [ref=e38]: Funcionalidade de listagem de usuários que estão cadastrados.
        - generic [ref=e39] [cursor=pointer]: Listar
      - generic [ref=e42]:
        - heading "Cadastrar Produtos" [level=5] [ref=e43]
        - paragraph [ref=e44]: Funcionalidade de cadastro de produtos para ser utilizado no ecommerce.
        - generic [ref=e45] [cursor=pointer]: Cadastrar
      - generic [ref=e48]:
        - heading "Listar Produtos" [level=5] [ref=e49]
        - paragraph [ref=e50]: Funcionalidade de listagem de produtos que estão cadastrados.
        - generic [ref=e51] [cursor=pointer]: Listar
      - generic [ref=e54]:
        - heading "Relatórios" [level=5] [ref=e55]
        - paragraph [ref=e56]: Funcionalidade de relatórios gerais do sistema de ecommerce.
        - generic [ref=e57] [cursor=pointer]: Ver
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class HomePage {
  4  |   readonly page: Page;
  5  |   readonly searchInput: Locator;
  6  |   readonly searchButton: Locator;
  7  |   readonly productCards: Locator;
  8  |   readonly addToListButton: Locator;
  9  |   readonly logoutButton: Locator;
  10 |   readonly noProductMessage: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.searchInput = page.locator('data-testid=pesquisar');
  15 |     this.searchButton = page.locator('data-testid=botaoPesquisar');
  16 |     this.productCards = page.locator('.card');
  17 |     this.addToListButton = page.locator('data-testid=adicionarNaLista');
  18 |     this.logoutButton = page.locator('data-testid=logout');
  19 |     this.noProductMessage = page.locator('text=Nenhum produto foi encontrado');
  20 |   }
  21 | 
  22 |   async searchProduct(name: string) {
> 23 |     await this.searchInput.fill(name);
     |                            ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  24 |     await this.searchButton.click();
  25 |   }
  26 | 
  27 |   async addFirstProductToCart() {
  28 |     await this.addToListButton.first().click();
  29 |   }
  30 | 
  31 |   async logout() {
  32 |     await this.logoutButton.click();
  33 |   }
  34 | 
  35 |   async assertProductIsVisible(productName: string) {
  36 |     await expect(this.productCards.filter({ hasText: productName })).toBeVisible();
  37 |   }
  38 | 
  39 |   async assertNoProductFound() {
  40 |     await expect(this.noProductMessage).toBeVisible();
  41 |   }
  42 | }
```