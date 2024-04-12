export class Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;

  constructor(id: string, title: string, description: string, image: string, price: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
  }

  getPrice(): number {
    return this.price;
  }

  getTitle() : string {
    return this.title;
  }
}
