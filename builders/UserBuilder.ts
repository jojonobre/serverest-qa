import { faker } from '@faker-js/faker';
import { UserPayload } from '../models/UserModel';

export class UserBuilder {
  private user: UserPayload;

  constructor() {
    this.user = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      administrador: 'false',
    };
  }

  comSenhaIncorreta(): this {
    this.user.password = 'senha_totalmente_incorreta';
    return this;
  }

  comoAdmin(isAdmin: boolean = true): this {
    this.user.administrador = isAdmin ? 'true' : 'false';
    return this;
  }

  build(): UserPayload {
    return this.user;
  }
}