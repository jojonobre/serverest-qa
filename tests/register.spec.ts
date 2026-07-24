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

    await registerPage.registerUser(
      'Novo Admin',
      randomEmail,
      'senha123',
      true
    );

    await expect(page).toHaveURL(/\/admin\/home$/, {
      timeout: 15000,
    });
  });

  test('CT006 - Cadastro com sucesso sem atribuição de Administrador', async ({ page }) => {
    const randomEmail = `user_comum_${Date.now()}@qa.com`;

    await registerPage.registerUser(
      'Usuário Comum',
      randomEmail,
      'senha123',
      false
    );

    await expect(page).toHaveURL(/\/home$/, {
      timeout: 15000,
    });
  });

  test('CT007 - Cadastrar com e-mail e senha válidos e nome inválido', async () => {
    const randomEmail = `user_${Date.now()}@qa.com`;
    await registerPage.registerUser('12345!@#$', randomEmail, 'senha123', false);

    await registerPage.assertAlertMessage('Nome não pode ser apenas caracteres especiais');
  });

  test('CT008 - Cadastrar com e-mail já utilizado', async ({ request }) => {
    const email = `duplicado_${Date.now()}@qa.com`;

    const cadastro = await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Usuário Existente',
        email,
        password: 'senha123',
        administrador: 'false',
      },
    });

    expect(cadastro.ok()).toBeTruthy();

    await registerPage.registerUser(
      'Outro Usuário',
      email,
      'senha123',
      false
    );

    await registerPage.assertAlertMessage(
      'Este email já está sendo usado'
    );
  });
});