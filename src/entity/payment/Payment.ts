export class Payment {

  private amount: number;
  private order: Order;

  constructor(amount: number, order: Order) {
    this.amount = amount;
    this.order = order;
  }
}
