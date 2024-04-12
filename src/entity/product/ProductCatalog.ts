export class ProductCatalog {
  id: string;
  products: Product[];

  constructor(id: string) {
    this.id = id;
    this.products = [];
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter(product => product.id !== productId);
  }

  searchProduct(productId: string): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
}
