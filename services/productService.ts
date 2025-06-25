import { ProductRepository } from "../repositories/productRepository";

export class ProductService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getProducts(category: string | undefined, page: number, limit: number) {
    const filter = category ? { category } : {};
    const skip = (page - 1) * limit;

    // Получаем данные от репозитория
    const products = await this.productRepo.findProducts(filter, skip, limit);
    const total = await this.productRepo.countProducts(filter);

    return {
      products,
      total,
      page,
      limit,
    };
  }
}
