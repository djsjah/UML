import { Customer } from '../customer/Customer';

export class Store {
  title: string;
  address: string;
  isActive: boolean;
  budget: number;
  workerList: { type: string, worker: SystemConductor }[];
  customerList: Customer[];
  productProviderList: ProductProvider[];

  constructor(title: string, address: string, isActive: boolean, budget: number) {
    this.title = title;
    this.address = address;
    this.isActive = isActive;
    this.budget = budget;
    this.workerList = [];
    this.customerList = [];
    this.productProviderList = [];
  }

  updateWorkerList(type: string, worker: SystemConductor): void {
    const existingWorker = this.workerList.find(item => item.worker.id === worker.id);
    if (existingWorker) {
      existingWorker.type = type;
      existingWorker.worker = worker;
    } else {
      this.workerList.push({ type, worker });
    }
  }

  updateCustomerList(customer: Customer): void {
    this.customerList.push(customer);
  }

  updateProductProviderList(productProvider: ProductProvider): void {
    const existingProductProvider = this.productProviderList.find(item => item.id === productProvider.id);
    if (existingProductProvider) {
    } else {
      this.productProviderList.push(productProvider);
    }
  }

  updateBudget(budget: number): void {
    this.budget = budget;
  }

  getMoney(amount: number): number {
    this.budget -= amount;
    return this.budget;
  }
}
