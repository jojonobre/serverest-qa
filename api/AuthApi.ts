import { APIRequestContext, APIResponse } from '@playwright/test';
import { LoginPayload } from '../models/UserModel';

export class AuthApi {
  private request: APIRequestContext;
  private readonly endpoint = 'https://serverest.dev/login';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async realizarLogin(payload: LoginPayload): Promise<APIResponse> {
    return await this.request.post(this.endpoint, { data: payload });
  }
}