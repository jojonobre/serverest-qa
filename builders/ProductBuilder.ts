import { faker } from '@faker-js/faker';
import { ProductPayload } from '../models/ProductModel';

export class ProductBuilder {
  private product: ProductPayload;

  constructor() {
    this.product = {
      nome: `Produto Auto ${faker.commerce.productName()} ${Date.now()}`,
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 }),
    };
  }

  comNome(nome: string): this {
    this.product.nome = nome;
    return this;
  }

  comPreco(preco: number): this {
    this.product.preco = preco;
    return this;
  }

  build(): ProductPayload {
    return this.product;
  }
}