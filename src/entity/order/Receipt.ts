import { Order } from '../order/Order';
import { Product } from '../product/Product';

export class Receipt {
  constructor() { }

  private id: string;
  private order: Order;
  private dateTime: Date;
  private products: Product[];
  private totalCost: number;
  private tax: number;

  showReceipt(): void {
    console.log(`Receipt ID: ${this.id}`);
    console.log(`Order ID: ${this.order.getOrderId()}`);
    console.log(`Date: ${this.dateTime}`);
    console.log(`Products: ${this.products.map(product => product.getTitle()).join(', ')}`);
    console.log(`Total Cost: ${this.totalCost}`);
    console.log(`Tax: ${this.tax}`);
  }
}
