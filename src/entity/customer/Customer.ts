export class Customer {
  constructor() {}
  
  private id: string;
  private firstName: string;
  private secondName: string;
  private isActive: boolean;
  private phone: string;
  private email: string;
  private address: string;
  private password: string;
  private shopCart;
  private history;
  private delivery;
  private orderList;

  getCustomerFullName() : string {
    return `${this.firstName} ${this.secondName}`;
  }

  checkPassword(pass: string) : boolean {
    return true;
  }
}
