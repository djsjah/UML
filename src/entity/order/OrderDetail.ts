export class OrderDetail {
  constructor() { }

  private quantity: number;
  private sumTotal: number;


  calcSumTotal(sum: number): number {
    return this.quantity * sum;
  }
}
