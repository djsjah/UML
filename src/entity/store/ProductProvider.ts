export class ProductProvider {
  id: string;
  name: string;
  productList: { product: Product, price: number, quantity: number }[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.productList = [];
  }

  updateProductList(product: Product, price: number, quantity: number): void {
    const existingProduct = this.productList.find(item => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.price = price;
      existingProduct.quantity = quantity;
    } else {
      this.productList.push({ product, price, quantity });
    }
  }

  getProductList(): { product: Product, price: number, quantity: number }[] {
    return this.productList;
  }
}
