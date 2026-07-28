import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('US001 - Autenticação / Login (API)', () => {
  let createdUserId: string | null = null;
  const userCredentials = {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    administrador: 'false',
  };

  test.beforeEach(async ({ request }) => {
    const res = await request.post('https://serverest.dev/usuarios', {
      data: userCredentials,
    });

    if (res.ok()) {
      const data = await res.json();
      createdUserId = data._id;
    }
  });

  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      await request.delete(`https://serverest.dev/usuarios/${createdUserId}`).catch(() => {});
      createdUserId = null;
    }
  });

  test('POST /login - Autenticação com credenciais válidas', async ({ request }) => {
    const response = await request.post('https://serverest.dev/login', {
      data: {
        email: userCredentials.email,
        password: userCredentials.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toContain('Bearer');
  });

  test('POST /login - Autenticação com senha incorreta', async ({ request }) => {
    const response = await request.post('https://serverest.dev/login', {
      data: {
        email: userCredentials.email,
        password: 'senha_totalmente_incorreta',
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});