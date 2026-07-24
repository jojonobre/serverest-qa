import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('US002 - Cadastrar Usuário', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test('CT005 - Cadastro com sucesso com atribuição de Administrador', async ({ page }) => {
    const randomEmail = `admin_${Date.now()}@qa.com`;
    await registerPage.registerUser('Novo Admin', randomEmail, 'senha123', true);

    await expect(page).toHaveURL(/.*admin\/home/);
  });

  test('CT006 - Cadastro com sucesso sem atribuição de Administrador', async ({ page }) => {
    const randomEmail = `user_comum_${Date.now()}@qa.com`;
    await registerPage.registerUser('Usuário Comum', randomEmail, 'senha123', false);

    await expect(page).toHaveURL(/.*home/);
  });

  test('CT007 - Cadastrar com e-mail e senha válidos e nome inválido', async () => {
    const randomEmail = `user_${Date.now()}@qa.com`;
    await registerPage.registerUser('12345!@#$', randomEmail, 'senha123', false);

    await registerPage.assertAlertMessage('Nome não pode ser apenas caracteres especiais');
  });

  test('CT008 - Cadastrar com e-mail já utilizado', async () => {
    await registerPage.registerUser('Fulano QA', 'fulano@qa.com', 'senha123', false);

    await registerPage.assertAlertMessage('Este email já está sendo usado');
  });
});