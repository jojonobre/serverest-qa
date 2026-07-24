# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> US002 - Cadastrar Usuário >> CT007 - Cadastrar com e-mail e senha válidos e nome inválido
- Location: tests\register.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('data-testid=senha')

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - img [ref=e6]
  - heading "Cadastro" [level=2] [ref=e7]
  - textbox "Digite seu nome" [ref=e9]: 12345!@#$
  - textbox "Digite seu email" [active] [ref=e11]: user_1784902414301@qa.com
  - textbox "Digite sua senha" [ref=e13]
  - generic [ref=e15]:
    - checkbox "Cadastrar como administrador?" [ref=e16]
    - generic [ref=e17]: Cadastrar como administrador?
  - button "Cadastrar" [ref=e19] [cursor=pointer]
  - generic [ref=e20]:
    - text: Já é cadastrado?
    - generic [ref=e21] [cursor=pointer]: Entrar
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class RegisterPage {
  4  |   readonly page: Page;
  5  |   readonly nameInput: Locator;
  6  |   readonly emailInput: Locator;
  7  |   readonly passwordInput: Locator;
  8  |   readonly adminCheckbox: Locator;
  9  |   readonly registerButton: Locator;
  10 |   readonly alertMessage: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.nameInput = page.locator('data-testid=nome');
  15 |     this.emailInput = page.locator('data-testid=email');
  16 |     this.passwordInput = page.locator('data-testid=senha');
  17 |     this.adminCheckbox = page.locator('data-testid=checkbox');
  18 |     this.registerButton = page.locator('data-testid=cadastrar');
  19 |     this.alertMessage = page.locator('.alert');
  20 |   }
  21 | 
  22 |   async navigate() {
  23 |     await this.page.goto('https://front.serverest.dev/cadastrarusuarios');
  24 |   }
  25 | 
  26 |   async registerUser(name: string, email: string, pass: string, isAdmin: boolean = false) {
  27 |     await this.nameInput.fill(name);
  28 |     await this.emailInput.fill(email);
> 29 |     await this.passwordInput.fill(pass);
     |                              ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  30 |     
  31 |     if (isAdmin) {
  32 |       await this.adminCheckbox.check();
  33 |     }
  34 |     
  35 |     await this.registerButton.click();
  36 |   }
  37 | 
  38 |   async assertAlertMessage(expectedText: string) {
  39 |     await expect(this.alertMessage).toContainText(expectedText);
  40 |   }
  41 | }
```