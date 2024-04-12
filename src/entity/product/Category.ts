export class Category {
  constructor() { }

  private id: string;
  private name: string;

  getCategoryName(): string {
    return this.name;
  }
}
