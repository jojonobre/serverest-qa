# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> US001 - Funcionalidade de Login >> CT003 - Login com email não cadastrado
- Location: tests\login.spec.ts:22:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - img [ref=e6]
  - heading "Login" [level=1] [ref=e7]
  - alert [ref=e8]:
    - button "Close" [ref=e9] [cursor=pointer]: ×
    - text: Email e/ou senha inválidos
  - textbox "Digite seu email" [ref=e11]: email_inexistente_98765@qa.com
  - textbox "Digite sua senha" [ref=e13]: teste
  - button "Entrar" [active] [ref=e14] [cursor=pointer]
  - generic [ref=e15]:
    - text: Não é cadastrado?
    - generic [ref=e16] [cursor=pointer]: Cadastre-se
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class LoginPage {
  4  |   readonly page: Page;
  5  |   readonly emailInput: Locator;
  6  |   readonly passwordInput: Locator;
  7  |   readonly submitButton: Locator;
  8  |   readonly errorMessage: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.emailInput = page.locator('data-testid=email');
  13 |     this.passwordInput = page.locator('data-testid=senha');
  14 |     this.submitButton = page.locator('data-testid=entrar');
  15 |     this.errorMessage = page.locator('.alert');
  16 |   }
  17 | 
  18 |   async navigate() {
  19 |     await this.page.goto('https://front.serverest.dev/login');
  20 |     await expect(this.page).toHaveURL(/\/login/);
  21 |   }
  22 | 
  23 |   async login(email: string, pass: string) {
  24 |     await this.emailInput.fill(email);
  25 |     await this.passwordInput.fill(pass);
  26 | 
  27 |     await Promise.all([
> 28 |       this.page.waitForURL(/\/admin\/home/, { timeout: 15000 }),
     |                 ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  29 |       this.submitButton.click(),
  30 |     ]);
  31 |   }
  32 | 
  33 | 
  34 | }
```