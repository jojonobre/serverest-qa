import { test, expect } from '@playwright/test';
import { UserApi } from '../../api/UserApi';
import { AuthApi } from '../../api/AuthApi';
import { ProductApi } from '../../api/ProductApi';
import { UserBuilder } from '../../builders/UserBuilder';
import { ProductBuilder } from '../../builders/ProductBuilder';
import { ProductPayload } from '../../models/ProductModel';

test.describe('US003 - Consulta e Listagem de Produtos (API)', () => {
  let userApi: UserApi;
  let authApi: AuthApi;
  let productApi: ProductApi;

  let createdProductId: string | null = null;
  let userToken = '';
  let productData: ProductPayload;

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
    authApi = new AuthApi(request);
    productApi = new ProductApi(request);


    const adminUser = new UserBuilder().comoAdmin(true).build();
    const resUser = await userApi.cadastrarUsuario(adminUser);
    expect(resUser.ok()).toBeTruthy();


    const resLogin = await authApi.realizarLogin({
      email: adminUser.email,
      password: adminUser.password,
    });
    expect(resLogin.ok()).toBeTruthy();
    
    const bodyLogin = await resLogin.json();
    userToken = bodyLogin.authorization;

  
    productData = new ProductBuilder().build();
    const createRes = await productApi.cadastrarProduto(productData, userToken);
    expect(createRes.status()).toBe(201);

    const response = await createRes.json();
    createdProductId = response._id;
  });

  test.afterEach(async () => {
    if (createdProductId) {
      await productApi.deletarProduto(createdProductId, userToken).catch(() => {});
      createdProductId = null;
    }
  });

  test('GET /produtos - Listar todos os produtos', async () => {
    const response = await productApi.listarProdutos();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('produtos');
    expect(Array.isArray(body.produtos)).toBeTruthy();
    expect(body.quantidade).toBeGreaterThanOrEqual(0);
  });

  test('GET /produtos?nome=... - Buscar produto por nome via filtro API', async () => {
    const response = await productApi.listarProdutos({ nome: productData.nome });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.quantidade).toBeGreaterThan(0);
    expect(body.produtos[0]).toHaveProperty('_id');
    expect(body.produtos[0].nome).toBe(productData.nome);
    expect(body.produtos[0]).toHaveProperty('preco');
    expect(body.produtos[0]).toHaveProperty('descricao');
    expect(body.produtos[0]).toHaveProperty('quantidade');
  });
});