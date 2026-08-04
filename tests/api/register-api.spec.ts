import { test, expect } from '@playwright/test';
import { UserApi } from '../../api/UserApi';
import { UserBuilder } from '../../builders/UserBuilder';

test.describe('US002 - Cadastro de Usuários (API)', () => {
  let userApi: UserApi;
  let createdUserIds: string[] = [];

  test.beforeEach(({ request }) => {
    userApi = new UserApi(request);
  });

  test.afterEach(async () => {
    for (const userId of createdUserIds) {
      await userApi.deletarUsuario(userId).catch(() => {});
    }
    createdUserIds = [];
  });

  test('POST /usuarios - Deve cadastrar um usuário com sucesso via API', async () => {
    const payload = new UserBuilder().comoAdmin(true).build();
    const response = await userApi.cadastrarUsuario(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');

    if (body._id) {
      createdUserIds.push(body._id);
    }
  });

  test('POST /usuarios - Não deve permitir cadastro com e-mail duplicado', async () => {
    const payload = new UserBuilder().comoAdmin(false).build();
    const firstRes = await userApi.cadastrarUsuario(payload);
    expect(firstRes.status()).toBe(201);
    
    const firstData = await firstRes.json();
    expect(firstData).toHaveProperty('_id');
    createdUserIds.push(firstData._id);
    const secondRes = await userApi.cadastrarUsuario(payload);
    expect(secondRes.status()).toBe(400);

    const secondData = await secondRes.json();
    expect(secondData).toHaveProperty('message');
    expect(secondData.message).toBe('Este email já está sendo usado');
  });
});