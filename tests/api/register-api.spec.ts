import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('US002 - Cadastro de Usuários (API)', () => {
  let createdUserIds: string[] = [];

  test.afterEach(async ({ request }) => {
    for (const userId of createdUserIds) {
      await request.delete(`https://serverest.dev/usuarios/${userId}`).catch(() => {});
    }
    createdUserIds = [];
  });

  test('POST /usuarios - Deve cadastrar um usuário com sucesso via API', async ({ request }) => {
    const payload = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      administrador: 'true',
    };

    const response = await request.post('https://serverest.dev/usuarios', {
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');

    if (body._id) {
      createdUserIds.push(body._id);
    }
  });

  test('POST /usuarios - Não deve permitir cadastro com e-mail duplicado', async ({ request }) => {
    const duplicatedEmail = faker.internet.email().toLowerCase();

    const payload = {
      nome: faker.person.fullName(),
      email: duplicatedEmail,
      password: faker.internet.password(),
      administrador: 'false',
    };

    const firstRes = await request.post('https://serverest.dev/usuarios', { data: payload });
    expect(firstRes.status()).toBe(201);
    const firstData = await firstRes.json();
    expect(firstData).toHaveProperty('_id');
    createdUserIds.push(firstData._id);

    const secondRes = await request.post('https://serverest.dev/usuarios', { data: payload });
    expect(secondRes.status()).toBe(400);

    const secondData = await secondRes.json();
    expect(secondData).toHaveProperty('message');
    expect(secondData.message).toBe('Este email já está sendo usado');
  });
});