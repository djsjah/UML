import { Customer } from '../customer/Customer';
import { Status } from '../order/Status';

export class Order {
  constructor() { }

  private id: string;
  private dateTime: Date;
  private customer: Customer;
  private products: any[] = [];
  private status: Status;

  addProduct(product: any): void {
    this.products.push(product);
  }

  getStatus(): Status {
    return this.status;
  }

  getTotalSum(): number {
    return this.products.reduce((sum, product) => sum + product.price, 0);
  }

  getOrderId() : string {
    return this.id;
  }

  cancel(): void {

  }
}
