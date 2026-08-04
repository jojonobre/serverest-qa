import { test, expect } from '@playwright/test';
import { UserApi } from '../../api/UserApi';
import { AuthApi } from '../../api/AuthApi';
import { UserBuilder } from '../../builders/UserBuilder';
import { UserPayload } from '../../models/UserModel';

test.describe('US001 - Autenticação / Login (API)', () => {
  let userApi: UserApi;
  let authApi: AuthApi;
  let createdUserId: string | null = null;
  let userCredentials: UserPayload;

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
    authApi = new AuthApi(request);
    userCredentials = new UserBuilder().build();
    const res = await userApi.cadastrarUsuario(userCredentials);
    expect(res.status()).toBe(201);

    const data = await res.json();
    createdUserId = data._id;
  });

  test.afterEach(async () => {
    if (createdUserId) {
      await userApi.deletarUsuario(createdUserId).catch(() => {});
      createdUserId = null;
    }
  });

  test('POST /login - Autenticação com credenciais válidas', async () => {
    const response = await authApi.realizarLogin({
      email: userCredentials.email,
      password: userCredentials.password,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body).toHaveProperty('authorization');
    expect(body.authorization).toContain('Bearer ');
  });

  test('POST /login - Autenticação com senha incorreta', async () => {
    const response = await authApi.realizarLogin({
      email: userCredentials.email,
      password: 'senha_totalmente_incorreta',
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});