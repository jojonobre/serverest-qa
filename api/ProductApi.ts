import { APIRequestContext, APIResponse } from '@playwright/test';
import { ProductPayload } from '../models/ProductModel';

export class ProductApi {
  private request: APIRequestContext;
  private readonly endpoint = 'https://serverest.dev/produtos';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async cadastrarProduto(payload: ProductPayload, token: string): Promise<APIResponse> {
    return await this.request.post(this.endpoint, {
      headers: { Authorization: token },
      data: payload,
    });
  }

  async listarProdutos(params?: { nome?: string }): Promise<APIResponse> {
    return await this.request.get(this.endpoint, {
      params,
    });
  }

  async deletarProduto(id: string, token: string): Promise<APIResponse> {
    return await this.request.delete(`${this.endpoint}/${id}`, {
      headers: { Authorization: token },
    });
  }
}