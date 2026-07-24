import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('US001 - Funcionalidade de Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('CT001 - Login com sucesso (Usuário Cliente)', async ({ page }) => {
    await loginPage.login('fulano@qa.com', 'teste');
    await expect(page).toHaveURL(/.*home/);
  });

  test('CT002 - Login com senha inválida', async () => {
    await loginPage.login('fulano@qa.com', 'senha_incorreta');
    await loginPage.assertErrorMessage('Email e/ou senha inválidos');
  });

  test('CT003 - Login com email não cadastrado', async () => {
    await loginPage.login('email_inexistente_98765@qa.com', 'teste');
    await loginPage.assertErrorMessage('Email e/ou senha inválidos');
  });

  test('CT004 - Login com email em formato inválido', async () => {
    await loginPage.login('email_invalido.com', 'teste');
    await loginPage.assertErrorMessage('Email deve ser um email válido');
  });
});