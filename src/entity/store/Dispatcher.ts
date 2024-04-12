export class Dispatcher {
  priceAmount: number;
  productNeed: { product: Product, quantity: number }[];

  constructor(priceAmount: number, productNeed: { product: Product, quantity: number }[]) {
    this.priceAmount = priceAmount;
    this.productNeed = productNeed;
  }

  getProductNeed(): { product: Product, quantity: number }[] {
    return this.productNeed;
  }

  updateProductNeed(product: Product, quantity: number): void {
    const existingProduct = this.productNeed.find(item => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      this.productNeed.push({ product, quantity });
    }
  }
}
