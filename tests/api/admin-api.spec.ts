import { test, expect } from '@playwright/test';
import { UserApi } from '../../api/UserApi';
import { AuthApi } from '../../api/AuthApi';
import { ProductApi } from '../../api/ProductApi';
import { UserBuilder } from '../../builders/UserBuilder';
import { ProductBuilder } from '../../builders/ProductBuilder';

test.describe('US005 - Gestão de Produtos e Usuários (API)', () => {
  let userApi: UserApi;
  let authApi: AuthApi;
  let productApi: ProductApi;

  let createdUserId: string | null = null;
  let createdProductIds: string[] = [];
  let userToken: string = '';

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
    authApi = new AuthApi(request);
    productApi = new ProductApi(request);

    const userPayload = new UserBuilder().comoAdmin(true).build();
    const resUser = await userApi.cadastrarUsuario(userPayload);
    expect(resUser.ok()).toBeTruthy();
    
    const bodyUser = await resUser.json();
    createdUserId = bodyUser._id;

    const resLogin = await authApi.realizarLogin({
      email: userPayload.email,
      password: userPayload.password,
    });
    expect(resLogin.ok()).toBeTruthy();

    const bodyLogin = await resLogin.json();
    userToken = bodyLogin.authorization;
  });

  test.afterEach(async () => {
    for (const productId of createdProductIds) {
      await productApi.deletarProduto(productId, userToken).catch(() => {});
    }
    createdProductIds = [];

    if (createdUserId) {
      await userApi.deletarUsuario(createdUserId).catch(() => {});
      createdUserId = null;
    }
  });

  test('POST /produtos - Deve criar produto via API com sucesso', async () => {
    const productPayload = new ProductBuilder().build();

    const response = await productApi.cadastrarProduto(productPayload, userToken);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');

    createdProductIds.push(body._id);
  });

  test('POST /produtos - Não deve permitir produto com nome duplicado', async () => {
    const payload = new ProductBuilder().build();

    const firstRes = await productApi.cadastrarProduto(payload, userToken);
    expect(firstRes.status()).toBe(201);
    const firstBody = await firstRes.json();
    createdProductIds.push(firstBody._id);
    
    const secondRes = await productApi.cadastrarProduto(payload, userToken);

    expect(secondRes.status()).toBe(400);
    const secondBody = await secondRes.json();
    expect(secondBody).toHaveProperty('message');
    expect(secondBody.message).toBe('Já existe produto com esse nome');
  });

  test('DELETE /produtos/:id - Deve excluir produto via API', async () => {
    const productPayload = new ProductBuilder().build();
    const productRes = await productApi.cadastrarProduto(productPayload, userToken);
    const productData = await productRes.json();

    const deleteRes = await productApi.deletarProduto(productData._id, userToken);

    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody).toHaveProperty('message');
    expect(deleteBody.message).toBe('Registro excluído com sucesso');
  });

  test('DELETE /produtos/:id - Deve retornar mensagem ao tentar excluir produto inexistente', async () => {
    const idInexistente = 'IDINEXISTENTE123';

    const response = await productApi.deletarProduto(idInexistente, userToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Nenhum registro excluído');
  });

  test('GET /produtos - Deve buscar produto por nome', async () => {
    const productPayload = new ProductBuilder().build();

    const createRes = await productApi.cadastrarProduto(productPayload, userToken);
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    createdProductIds.push(createBody._id);

    const response = await productApi.listarProdutos({ nome: productPayload.nome });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.quantidade).toBeGreaterThan(0);
    expect(body.produtos[0].nome).toBe(productPayload.nome);
  });
});