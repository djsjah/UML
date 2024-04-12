export class Warehouse {
  id: string;
  capacity: number;
  productCatalogList: ProductCatalog[];

  constructor(id: string, capacity: number) {
    this.id = id;
    this.capacity = capacity;
    this.productCatalogList = [];
  }

  updateProductCatalogList(productCatalog: ProductCatalog): void {
    const existingProductCatalog = this.productCatalogList.find(item => item.id === productCatalog.id);
    if (existingProductCatalog) {
    } else {
      this.productCatalogList.push(productCatalog);
    }
  }
}
