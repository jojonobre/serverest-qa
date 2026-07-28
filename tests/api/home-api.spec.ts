import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('US003 - Consulta e Listagem de Produtos (API)', () => {
  let createdProductId: string | null = null;
  let userToken = '';
  const randomProductName = `Produto Para Buscar ${Date.now()}`;

  test.beforeEach(async ({ request }) => {
    const adminUser = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      administrador: 'true',
    };

    const resUser = await request.post('https://serverest.dev/usuarios', {
      data: adminUser,
    });
    expect(resUser.ok()).toBeTruthy();

    const resLogin = await request.post('https://serverest.dev/login', {
      data: {
        email: adminUser.email,
        password: adminUser.password,
      },
    });
    expect(resLogin.ok()).toBeTruthy();
    const bodyLogin = await resLogin.json();
    userToken = bodyLogin.authorization;

    const createRes = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: {
        nome: randomProductName,
        preco: '100',
        descricao: 'Teste',
        quantidade: '10',
      },
    });
    expect(createRes.ok()).toBeTruthy();

    const response = await createRes.json();
    createdProductId = response._id;
  });

  test.afterEach(async ({ request }) => {
    if (createdProductId) {
      await request.delete(`https://serverest.dev/produtos/${createdProductId}`).catch(() => {});
      createdProductId = null;
    }
  });

  test('GET /produtos - Listar todos os produtos', async ({ request }) => {
    const response = await request.get('https://serverest.dev/produtos');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.produtos)).toBeTruthy();
    expect(body.quantidade).toBeGreaterThanOrEqual(0);
  });

  test('GET /produtos?nome=... - Buscar produto por nome via filtro API', async ({ request }) => {
    const response = await request.get(
      `https://serverest.dev/produtos?nome=${encodeURIComponent(randomProductName)}`
    );
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.quantidade).toBeGreaterThan(0);
    expect(body.produtos[0].nome).toBe(randomProductName);
  });
});