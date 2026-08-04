import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserPayload } from '../models/UserModel';

export class UserApi {
  private request: APIRequestContext;
  private readonly endpoint = 'https://serverest.dev/usuarios';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async cadastrarUsuario(payload: UserPayload): Promise<APIResponse> {
    return await this.request.post(this.endpoint, { data: payload });
  }

  async deletarUsuario(id: string): Promise<APIResponse> {
    return await this.request.delete(`${this.endpoint}/${id}`);
  }
}