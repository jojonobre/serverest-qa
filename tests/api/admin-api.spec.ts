import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('US005 - Gestão de Produtos e Usuários (API)', () => {
  let createdUserId: string | null = null;
  let createdProductIds: string[] = [];
  let userToken: string = '';

  test.beforeEach(async ({ request }) => {
    const userPayload = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      administrador: 'true',
    };

    const resUser = await request.post('https://serverest.dev/usuarios', {
      data: userPayload,
    });
    expect(resUser.ok()).toBeTruthy();
    const bodyUser = await resUser.json();
    createdUserId = bodyUser._id;
    const resLogin = await request.post('https://serverest.dev/login', {
      data: {
        email: userPayload.email,
        password: userPayload.password,
      },
    });
    expect(resLogin.ok()).toBeTruthy();
    const bodyLogin = await resLogin.json();
    userToken = bodyLogin.authorization;
  });

  test.afterEach(async ({ request }) => {
    for (const productId of createdProductIds) {
      await request.delete(`https://serverest.dev/produtos/${productId}`, {
        headers: { Authorization: userToken },
      });
    }
    createdProductIds = [];

    if (createdUserId) {
      await request.delete(`https://serverest.dev/usuarios/${createdUserId}`);
      createdUserId = null;
    }
  });

  test('POST /produtos - Deve criar produto via API com sucesso', async ({ request }) => {
    const productPayload = {
      nome: `Produto API ${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
      preco: faker.number.int({ min: 50, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 50 }),
    };

    const response = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: productPayload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');

    createdProductIds.push(body._id);
  });

  test('POST /produtos - Não deve permitir produto com nome duplicado', async ({ request }) => {
    const productName = `Produto API Duplicado ${faker.string.alphanumeric(6)}`;

    const payload = {
      nome: productName,
      preco: 150,
      descricao: faker.commerce.productDescription(),
      quantidade: 10,
    };

    const firstRes = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: payload,
    });
    expect(firstRes.status()).toBe(201);
    const firstBody = await firstRes.json();
    createdProductIds.push(firstBody._id);
    const secondRes = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: payload,
    });

    expect(secondRes.status()).toBe(400);
    const secondBody = await secondRes.json();
    expect(secondBody.message).toBe('Já existe produto com esse nome');
  });

  test('DELETE /produtos/:id - Deve excluir produto via API', async ({ request }) => {
    const productRes = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: {
        nome: `Produto para Deletar ${faker.string.alphanumeric(6)}`,
        preco: 200,
        descricao: faker.commerce.productDescription(),
        quantidade: 5,
      },
    });
    const productData = await productRes.json();
    const deleteRes = await request.delete(`https://serverest.dev/produtos/${productData._id}`, {
      headers: { Authorization: userToken },
    });

    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.message).toBe('Registro excluído com sucesso');
  });

  test('GET /produtos - Deve buscar produto por nome', async ({ request }) => {
    const productName = `Produto Para Buscar ${Date.now()}`;

    const createRes = await request.post('https://serverest.dev/produtos', {
      headers: { Authorization: userToken },
      data: {
        nome: productName,
        preco: '100',
        descricao: 'Teste',
        quantidade: '10',
      },
    });
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    createdProductIds.push(createBody._id);

    const response = await request.get(
      `https://serverest.dev/produtos?nome=${encodeURIComponent(productName)}`
    );
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.quantidade).toBeGreaterThan(0);
    expect(body.produtos[0].nome).toBe(productName);
  });
});